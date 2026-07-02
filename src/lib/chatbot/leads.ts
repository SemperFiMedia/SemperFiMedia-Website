import { Resend } from 'resend';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { env } from '@/lib/env';
import type { ChatbotClientConfig } from './client-config';

export type LeadInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  projectDetails?: unknown;
  tierRecommended?: unknown;
};

export type LeadContext = {
  config: ChatbotClientConfig;
  pagePath?: string | null;
  transcript?: { role: string; content: string }[];
};

export type CaptureResult = { ok: boolean; id?: string; reason?: string };

function clean(v: unknown): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

/**
 * Persist a lead and notify the owner + the customer. Both steps are
 * best-effort — a DB or email failure must never break the live chat, so we
 * swallow those errors and still return ok when the lead is valid.
 */
export async function captureLead(raw: LeadInput, ctx: LeadContext): Promise<CaptureResult> {
  const name = clean(raw.name);
  const email = clean(raw.email);
  const phone = clean(raw.phone);
  const service = clean(raw.service) ?? 'General inquiry';
  const projectDetails = clean(raw.projectDetails);
  const tierRecommended = clean(raw.tierRecommended);

  if (!name || (!email && !phone)) {
    return { ok: false, reason: 'need a name and at least a phone or email' };
  }

  // 1. Persist (best-effort).
  let id: string | undefined;
  if (db) {
    try {
      const [row] = await db
        .insert(leads)
        .values({
          clientSlug: ctx.config.domain,
          name,
          email,
          phone,
          service,
          projectDetails,
          tierRecommended,
          pagePath: ctx.pagePath ?? null,
          transcript: ctx.transcript ?? null,
        })
        .returning({ id: leads.id });
      id = row?.id;
    } catch {
      /* keep going — a lost DB write shouldn't cost us the notification */
    }
  }

  // 2. Notify owner + customer (best-effort).
  if (env.resend.apiKey) {
    const resend = new Resend(env.resend.apiKey);
    const vipNote = ctx.config.vip.thresholds.length
      ? `\nHigh-value tiers to watch: ${ctx.config.vip.thresholds.join('; ')}`
      : '';

    try {
      await resend.emails.send({
        from: env.resend.fromEmail,
        to: [ctx.config.notify.toEmail],
        replyTo: email ?? undefined,
        subject: `New chatbot lead: ${service} — ${name}`,
        text: [
          `New lead captured by the ${ctx.config.businessName} chatbot`,
          `---`,
          `Name: ${name}`,
          `Phone: ${phone ?? '(not provided)'}`,
          `Email: ${email ?? '(not provided)'}`,
          `Service: ${service}`,
          `Tier recommended: ${tierRecommended ?? '(none)'}`,
          `Project details: ${projectDetails ?? '(none)'}`,
          `Page: ${ctx.pagePath ?? '(unknown)'}`,
          `Lead ID: ${id ?? '(not stored)'}`,
          vipNote,
        ].join('\n'),
      });
    } catch {
      /* swallow */
    }

    if (email) {
      try {
        await resend.emails.send({
          from: env.resend.fromEmail,
          to: [email],
          subject: `Thanks, ${name.split(' ')[0]} — ${ctx.config.founder.name} will be in touch`,
          text: [
            `Hey ${name.split(' ')[0]},`,
            ``,
            `Thanks for reaching out to ${ctx.config.businessName}. ${ctx.config.founder.name} personally leads every project and will follow up within 24 hours${phone ? ` at ${phone}` : ''}.`,
            ``,
            `Here's what I've got noted:`,
            `• Service: ${service}`,
            projectDetails ? `• Details: ${projectDetails}` : '',
            ``,
            `Talk soon.`,
            `Semper Fi.`,
            `— The ${ctx.config.businessName} team`,
          ]
            .filter(Boolean)
            .join('\n'),
        });
      } catch {
        /* swallow */
      }
    }
  }

  return { ok: true, id };
}
