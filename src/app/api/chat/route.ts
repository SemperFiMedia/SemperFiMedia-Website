import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/lib/env';
import { semperFiConfig } from '@/lib/chatbot/client-config';
import { buildSystemPrompt } from '@/lib/chatbot/system-prompt';
import { captureLead, type LeadInput } from '@/lib/chatbot/leads';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Assembled once at module load from the reseller config engine.
const SYSTEM_PROMPT = buildSystemPrompt(semperFiConfig);

// The one client-side tool the bot can call: it saves the lead + notifies TJ.
const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: 'capture_lead',
  description:
    "Save a qualified lead and email TJ. Call this as soon as you have the visitor's name AND at least a phone or email, plus which service they want. Never ask for info already in the conversation. After it succeeds, tell the visitor TJ will reach out within 24 hours.",
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "Visitor's name" },
      email: { type: 'string', description: 'Email, if given' },
      phone: { type: 'string', description: 'Phone number, if given' },
      service: {
        type: 'string',
        description: 'Wedding, Corporate video, Music video, Website, or other',
      },
      projectDetails: {
        type: 'string',
        description: 'Short summary of what they need (date, venue, scope, etc.)',
      },
      tierRecommended: { type: 'string', description: 'The package/tier you recommended, if any' },
    },
    required: ['name', 'service'],
  },
};

const MAX_AGENT_TURNS = 5;

// Per-request context appended as a second (uncached) system block so the bot's
// replies stay relevant to the page and time of day. The cached SYSTEM_PROMPT
// stays first, so prompt caching is unaffected.
function buildContextBlock(pagePath: string | null): string | null {
  const lines: string[] = [];
  if (pagePath) {
    lines.push(
      `The visitor is currently on the page: ${pagePath}. Lead with what's relevant to that page.`,
    );
  }
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: semperFiConfig.hours.timezone,
      weekday: 'short',
      hour: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
    const afterHours = weekday === 'Sat' || weekday === 'Sun' || hour < 9 || hour >= 18;
    if (afterHours) {
      lines.push(
        `It is currently outside business hours (${semperFiConfig.hours.label}). If the visitor wants to talk to ${semperFiConfig.founder.name}, acknowledge he's off the clock but will follow up first thing (by 9 AM), and still capture their info with capture_lead.`,
      );
    }
  } catch {
    /* timezone lookup failed — skip the after-hours note */
  }
  return lines.length ? lines.join('\n') : null;
}

const MAX_MESSAGES = 30;
const MAX_USER_CONTENT_LENGTH = 4000;
const RATE_LIMIT_PER_MINUTE = 20;
const RATE_LIMIT_PER_HOUR = 80;

type ChatMessageInput = {
  role: 'user' | 'assistant';
  content: string;
};

function isValidMessage(m: unknown): m is ChatMessageInput {
  if (typeof m !== 'object' || m === null) return false;
  const obj = m as Record<string, unknown>;
  return (
    (obj.role === 'user' || obj.role === 'assistant') &&
    typeof obj.content === 'string' &&
    obj.content.length > 0
  );
}

export async function POST(request: Request) {
  if (!env.anthropic.apiKey) {
    return new Response(
      JSON.stringify({ error: 'Chat is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const clientKey = getClientKey(request);
  const minuteCheck = checkRateLimit(`m:${clientKey}`, RATE_LIMIT_PER_MINUTE, 60_000);
  if (!minuteCheck.ok) {
    return new Response(
      JSON.stringify({ error: 'Slow down — too many messages in the last minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }
  const hourCheck = checkRateLimit(`h:${clientKey}`, RATE_LIMIT_PER_HOUR, 60 * 60_000);
  if (!hourCheck.ok) {
    return new Response(
      JSON.stringify({ error: 'You\'ve hit the hourly chat limit. Try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rawMessages =
    typeof body === 'object' && body !== null && Array.isArray((body as Record<string, unknown>).messages)
      ? ((body as Record<string, unknown>).messages as unknown[])
      : null;

  if (!rawMessages || rawMessages.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing messages.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const trimmed = rawMessages.slice(-MAX_MESSAGES);
  if (!trimmed.every(isValidMessage)) {
    return new Response(JSON.stringify({ error: 'Malformed messages.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (trimmed[0]!.role !== 'user') {
    return new Response(JSON.stringify({ error: 'First message must be from user.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages: Anthropic.MessageParam[] = trimmed.map((m) => ({
    role: m.role,
    content: m.content.slice(0, MAX_USER_CONTENT_LENGTH),
  }));

  // Page the visitor is on (widget sends this) — stored with the lead as context.
  const pagePath =
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).pagePath === 'string'
      ? ((body as Record<string, unknown>).pagePath as string).slice(0, 256)
      : null;

  const contextBlock = buildContextBlock(pagePath);

  const client = new Anthropic({ apiKey: env.anthropic.apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Agentic loop: stream text, and if the model calls capture_lead,
        // run it, feed the result back, and keep going until it's done talking.
        const convo: Anthropic.MessageParam[] = [...messages];
        let emittedText = false;

        for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
          const claudeStream = client.messages.stream({
            model: env.anthropic.model,
            // Headroom for Fable 5's always-on thinking (thinking shares the
            // output budget) so concise replies never truncate mid-sentence.
            max_tokens: 4096,
            system: [
              {
                type: 'text',
                text: SYSTEM_PROMPT,
                cache_control: { type: 'ephemeral' },
              },
              ...(contextBlock
                ? [{ type: 'text' as const, text: contextBlock }]
                : []),
            ],
            tools: [
              { type: 'web_search_20260209', name: 'web_search', max_uses: 3 },
              CAPTURE_LEAD_TOOL,
            ],
            messages: convo,
          });

          for await (const event of claudeStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              emittedText = true;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          const final = await claudeStream.finalMessage();

          // The bot called capture_lead — run it, return the result, loop so
          // it can produce its confirming message.
          if (final.stop_reason === 'tool_use') {
            const toolUses = final.content.filter(
              (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
            );
            convo.push({ role: 'assistant', content: final.content });
            const results: Anthropic.ToolResultBlockParam[] = [];
            for (const tu of toolUses) {
              if (tu.name === 'capture_lead') {
                const res = await captureLead(tu.input as LeadInput, {
                  config: semperFiConfig,
                  pagePath,
                  transcript: convo
                    .filter((m) => typeof m.content === 'string')
                    .map((m) => ({ role: m.role, content: m.content as string })),
                });
                results.push({
                  type: 'tool_result',
                  tool_use_id: tu.id,
                  content: res.ok
                    ? 'Lead saved and TJ notified. Confirm to the visitor that TJ will reach out within 24 hours.'
                    : `Not saved (${res.reason}). Ask for the missing detail, or point them to ${semperFiConfig.booking.path}.`,
                  is_error: !res.ok,
                });
              } else {
                results.push({ type: 'tool_result', tool_use_id: tu.id, content: 'ok' });
              }
            }
            convo.push({ role: 'user', content: results });
            continue;
          }

          // Server tool (web_search) hit its iteration cap — resume the turn.
          if (final.stop_reason === 'pause_turn') {
            convo.push({ role: 'assistant', content: final.content });
            continue;
          }

          // Fable 5 safety classifiers declined (rare for this domain). If it
          // happened before any text, fall back to a human hand-off.
          if (final.stop_reason === 'refusal' && !emittedText) {
            controller.enqueue(
              encoder.encode(
                "I want to make sure I get this right — let me have TJ follow up with you personally. Drop your name and the best number or email, and he'll reach out within 24 hours. Semper Fi.",
              ),
            );
          }

          break; // end_turn / max_tokens — done.
        }

        controller.close();
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `API error (${err.status}): ${err.message}`
            : err instanceof Error
              ? err.message
              : 'Unknown error';
        controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
