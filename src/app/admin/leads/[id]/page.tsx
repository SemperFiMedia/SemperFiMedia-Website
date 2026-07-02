import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { getLead } from '@/lib/chatbot/leads-admin';
import { fmtLeadDate } from '@/lib/chatbot/format';
import { LeadStatusControl } from '@/components/admin/lead-status-control';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function AdminLeadDetailPage({ params }: { params: Params }) {
  if (!(await isAdmin())) notFound();
  if (!hasDb) notFound();

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const fields: { label: string; value: ReactNode }[] = [
    { label: 'Received', value: fmtLeadDate(lead.createdAt) },
    { label: 'Client', value: lead.clientSlug },
    {
      label: 'Email',
      value: lead.email ? (
        <a href={`mailto:${lead.email}`} className="text-brass underline">
          {lead.email}
        </a>
      ) : (
        '—'
      ),
    },
    {
      label: 'Phone',
      value: lead.phone ? (
        <a href={`tel:${lead.phone}`} className="text-brass underline">
          {lead.phone}
        </a>
      ) : (
        '—'
      ),
    },
    { label: 'Service', value: lead.service },
    { label: 'Tier recommended', value: lead.tierRecommended ?? '—' },
    { label: 'Captured on page', value: lead.pagePath ?? '—' },
    { label: 'Project details', value: lead.projectDetails ?? '—' },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[760px]">
          <Link href="/admin/leads" className="text-sm text-bone-subtle hover:text-bone-muted">
            ← All leads
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl text-bone-muted">{lead.name}</h1>
            <LeadStatusControl leadId={lead.id} status={lead.status} />
          </div>

          <dl className="mt-6 space-y-3 border-b border-bone/10 pb-8">
            {fields.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 md:flex-row md:gap-4">
                <dt className="w-44 shrink-0 text-sm text-bone-subtle">{f.label}</dt>
                <dd className="text-sm text-bone-muted">{f.value}</dd>
              </div>
            ))}
          </dl>

          <DataLabel className="mt-8 mb-4 text-brass">Conversation</DataLabel>
          {lead.transcript && lead.transcript.length > 0 ? (
            <ul className="space-y-3">
              {lead.transcript.map((m, i) => (
                <li
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'ml-8 rounded border border-brass/30 bg-brass/5 p-3 text-sm text-bone-muted'
                      : 'mr-8 rounded border border-bone/10 p-3 text-sm text-bone-muted'
                  }
                >
                  <div className="mb-1 text-xs text-bone-subtle">
                    {m.role === 'user' ? 'Visitor' : 'Assistant'}
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-bone-muted">No transcript stored for this lead.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
