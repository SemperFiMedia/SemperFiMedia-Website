import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/lib/env';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-system-prompt';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const client = new Anthropic({ apiKey: env.anthropic.apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: env.anthropic.model,
          max_tokens: 1024,
          system: [
            {
              type: 'text',
              text: CHAT_SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          tools: [
            {
              type: 'web_search_20260209',
              name: 'web_search',
              max_uses: 3,
            },
          ],
          messages,
        });

        for await (const event of claudeStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
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
