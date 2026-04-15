import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { PROPOSAL_SYSTEM_PROMPT } from '@/lib/proposal-system-prompt';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ProposalRequest = {
  name: string;
  email: string;
  weddingDate?: string;
  venue?: string;
  vision: string;
};

type Proposal = {
  greeting: string;
  recommendedTier: 'essentials' | 'cinematic' | 'heirloom';
  tierReasoning: string;
  suggestedAddOns: Array<{ id: string; name: string; reasoning: string }>;
  customMoments: string;
  closing: string;
};

const TIER_LABELS: Record<Proposal['recommendedTier'], { name: string; price: string }> = {
  essentials: { name: 'Essentials', price: '$3,500' },
  cinematic: { name: 'Cinematic', price: '$5,000' },
  heirloom: { name: 'Heirloom', price: '$8,000' },
};

function isValidPayload(body: unknown): body is ProposalRequest {
  if (typeof body !== 'object' || body === null) return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    o.name.length >= 2 &&
    typeof o.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email) &&
    typeof o.vision === 'string' &&
    o.vision.length >= 10
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProposalHtml(payload: ProposalRequest, proposal: Proposal): string {
  const tier = TIER_LABELS[proposal.recommendedTier];
  const addOnRows = proposal.suggestedAddOns
    .map(
      (a) =>
        `<tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;">
          <div style="font-family:Georgia,serif;font-style:italic;color:#f4ece0;font-size:16px;">${escapeHtml(a.name)}</div>
          <div style="margin-top:4px;font-size:13px;color:#a9a39a;">${escapeHtml(a.reasoning)}</div>
        </td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#0d0e0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f4ece0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0e0f;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#16181a;border:1px solid rgba(212,160,87,0.2);border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:32px 32px 16px 32px;border-bottom:1px solid rgba(212,160,87,0.15);">
            <div style="font-family:Georgia,serif;font-size:22px;font-style:italic;color:#f4ece0;">
              Semper Fi <span style="color:#D4A057;">Media</span>
            </div>
            <div style="margin-top:4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a9a39a;">
              Your Custom Wedding Proposal
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#cfc8be;">
              ${escapeHtml(proposal.greeting)}
            </p>

            <div style="margin:32px 0;padding:24px;border:1px solid rgba(212,160,87,0.3);border-radius:8px;background:rgba(212,160,87,0.05);">
              <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D4A057;margin-bottom:8px;">
                Recommended Tier
              </div>
              <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;">
                <div style="font-family:Georgia,serif;font-style:italic;font-size:28px;color:#f4ece0;">${escapeHtml(tier.name)}</div>
                <div style="font-family:Georgia,serif;font-size:24px;color:#D4A057;">${escapeHtml(tier.price)}</div>
              </div>
              <p style="margin:16px 0 0 0;font-size:14px;line-height:1.6;color:#cfc8be;">
                ${escapeHtml(proposal.tierReasoning)}
              </p>
            </div>

            ${
              proposal.suggestedAddOns.length > 0
                ? `<div style="margin:32px 0 24px 0;">
                    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D4A057;margin-bottom:12px;">
                      Add-Ons That Fit Your Day
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${addOnRows}
                    </table>
                  </div>`
                : ''
            }

            <div style="margin:32px 0;">
              <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D4A057;margin-bottom:12px;">
                Moments We&rsquo;ll Capture
              </div>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#cfc8be;font-style:italic;">
                ${escapeHtml(proposal.customMoments)}
              </p>
            </div>

            <p style="margin:32px 0 0 0;font-size:15px;line-height:1.7;color:#cfc8be;">
              ${escapeHtml(proposal.closing)}
            </p>

            <div style="margin:32px 0 0 0;text-align:center;">
              <a href="https://www.semperfimedia.llc/contact" style="display:inline-block;background:#D4A057;color:#16181a;font-size:12px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;padding:14px 28px;text-decoration:none;border-radius:4px;">
                Book a Discovery Call →
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;border-top:1px solid rgba(212,160,87,0.15);background:#0d0e0f;text-align:center;">
            <div style="font-size:11px;color:#7a7468;letter-spacing:0.05em;">
              Semper Fi Media · Forney, TX · Always Faithful · Established 2020
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderLeadHtml(payload: ProposalRequest, proposal: Proposal): string {
  const tier = TIER_LABELS[proposal.recommendedTier];
  const addOns = proposal.suggestedAddOns.map((a) => `  • ${a.name}`).join('\n');
  return `<!doctype html>
<html><body style="font-family:monospace;background:#16181a;color:#f4ece0;padding:24px;">
<h2 style="color:#D4A057;">New AI Proposal Request</h2>
<pre style="background:#0d0e0f;padding:16px;border-radius:6px;color:#cfc8be;line-height:1.6;">
Name: ${escapeHtml(payload.name)}
Email: ${escapeHtml(payload.email)}
Wedding Date: ${escapeHtml(payload.weddingDate ?? '(not provided)')}
Venue: ${escapeHtml(payload.venue ?? '(not provided)')}

Vision:
${escapeHtml(payload.vision)}

----- AI RECOMMENDED -----
Tier: ${escapeHtml(tier.name)} (${escapeHtml(tier.price)})

Add-Ons:
${escapeHtml(addOns || '(none)')}
</pre>
<p style="color:#a9a39a;">The full personalized proposal email has been sent to the couple. Reply to their address to start the conversation.</p>
</body></html>`;
}

export async function POST(request: Request) {
  if (!env.anthropic.apiKey || !env.resend.apiKey) {
    return Response.json(
      { error: 'AI proposal service is not configured.' },
      { status: 503 },
    );
  }

  const clientKey = getClientKey(request);
  const limit = checkRateLimit(`proposal:${clientKey}`, 3, 60 * 60_000);
  if (!limit.ok) {
    return Response.json(
      { error: 'You\'ve hit the proposal request limit for this hour. Reach out at /contact directly.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: 'Please fill in your name, a valid email, and tell us about your vision.' },
      { status: 400 },
    );
  }
  const payload = body as ProposalRequest;

  const userMessage = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.weddingDate ? `Wedding date: ${payload.weddingDate}` : `Wedding date: not yet set`,
    payload.venue ? `Venue: ${payload.venue}` : `Venue: not yet locked`,
    ``,
    `Their vision:`,
    payload.vision,
  ].join('\n');

  const client = new Anthropic({ apiKey: env.anthropic.apiKey });

  let proposal: Proposal;
  try {
    const response = await client.messages.create({
      model: env.anthropic.model,
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: PROPOSAL_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              greeting: { type: 'string' },
              recommendedTier: {
                type: 'string',
                enum: ['essentials', 'cinematic', 'heirloom'],
              },
              tierReasoning: { type: 'string' },
              suggestedAddOns: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    reasoning: { type: 'string' },
                  },
                  required: ['id', 'name', 'reasoning'],
                  additionalProperties: false,
                },
              },
              customMoments: { type: 'string' },
              closing: { type: 'string' },
            },
            required: [
              'greeting',
              'recommendedTier',
              'tierReasoning',
              'suggestedAddOns',
              'customMoments',
              'closing',
            ],
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Empty response from AI.');
    }
    proposal = JSON.parse(textBlock.text) as Proposal;
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown';
    return Response.json(
      { error: `Couldn't generate the proposal: ${detail}` },
      { status: 502 },
    );
  }

  const resend = new Resend(env.resend.apiKey);

  const couplePromise = resend.emails.send({
    from: env.resend.fromEmail,
    to: payload.email,
    replyTo: env.resend.toEmail,
    subject: `Your Custom Wedding Proposal — Semper Fi Media`,
    html: renderProposalHtml(payload, proposal),
  });

  const leadPromise = resend.emails.send({
    from: env.resend.fromEmail,
    to: env.resend.toEmail,
    replyTo: payload.email,
    subject: `🎬 AI Proposal sent: ${payload.name} (${TIER_LABELS[proposal.recommendedTier].name})`,
    html: renderLeadHtml(payload, proposal),
  });

  const [coupleResult, leadResult] = await Promise.all([couplePromise, leadPromise]);
  if (coupleResult.error) {
    return Response.json(
      { error: 'Generated the proposal but couldn\'t send the email. Try again or use /contact.' },
      { status: 502 },
    );
  }
  if (leadResult.error) {
    // non-fatal — couple still got their proposal
    console.error('Lead email failed:', leadResult.error);
  }

  return Response.json({ ok: true });
}
