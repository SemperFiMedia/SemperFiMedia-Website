import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { LEADS_PAGE_SIZE, distinctClientSlugs, listLeads } from '@/lib/chatbot/leads-admin';
import { LEAD_STATUSES, isLeadStatus, type LeadStatus } from '@/lib/chatbot/lead-status';
import { fmtLeadDate } from '@/lib/chatbot/format';
import { LeadStatusControl } from '@/components/admin/lead-status-control';

export const dynamic = 'force-dynamic';

type Search = Promise<{ status?: string; client?: string; page?: string }>;

function href(params: { status?: string; client?: string; page?: number }) {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.client) q.set('client', params.client);
  if (params.page && params.page > 1) q.set('page', String(params.page));
  const s = q.toString();
  return s ? `/admin/leads?${s}` : '/admin/leads';
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: Search }) {
  if (!(await isAdmin())) notFound();

  const sp = await searchParams;
  const status: LeadStatus | undefined = isLeadStatus(sp.status) ? sp.status : undefined;
  const client = sp.client || undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);

  if (!hasDb) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
          <div className="mx-auto max-w-[1100px]">
            <DataLabel className="mb-6 text-brass">Chatbot Leads</DataLabel>
            <p className="text-bone-muted">Leads unavailable — database is not configured.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [{ rows, total }, slugs] = await Promise.all([
    listLeads({ status, client, page }),
    distinctClientSlugs(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE));

  const tabs: { label: string; value?: LeadStatus }[] = [
    { label: 'All' },
    ...LEAD_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[1100px]">
          <DataLabel className="mb-2 text-brass">Chatbot Leads</DataLabel>
          <p className="mb-6 text-sm text-bone-subtle">
            {total} lead{total === 1 ? '' : 's'}
            {status ? ` · ${status}` : ''}
            {client ? ` · ${client}` : ''}
          </p>

          {/* Status tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = t.value === status;
              return (
                <Link
                  key={t.label}
                  href={href({ status: t.value, client })}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'rounded border border-brass px-3 py-1 text-sm text-brass'
                      : 'rounded border border-bone/20 px-3 py-1 text-sm text-bone-muted hover:border-bone/40'
                  }
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          {/* Client filter — only when leads span more than one client */}
          {slugs.length > 1 ? (
            <div className="mb-6 flex flex-wrap gap-2">
              <Link
                href={href({ status })}
                aria-current={!client ? 'page' : undefined}
                className={
                  !client
                    ? 'rounded border border-brass px-3 py-1 text-xs text-brass'
                    : 'rounded border border-bone/20 px-3 py-1 text-xs text-bone-muted hover:border-bone/40'
                }
              >
                All clients
              </Link>
              {slugs.map((s) => (
                <Link
                  key={s}
                  href={href({ status, client: s })}
                  aria-current={client === s ? 'page' : undefined}
                  className={
                    client === s
                      ? 'rounded border border-brass px-3 py-1 text-xs text-brass'
                      : 'rounded border border-bone/20 px-3 py-1 text-xs text-bone-muted hover:border-bone/40'
                  }
                >
                  {s}
                </Link>
              ))}
            </div>
          ) : null}

          {rows.length === 0 ? (
            <p className="text-bone-muted">No leads{status || client ? ' match this filter' : ' yet'}.</p>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden w-full border-collapse text-left text-sm md:table">
                <thead>
                  <tr className="border-b border-bone/20 text-bone-subtle">
                    <th scope="col" className="py-2 pr-4 font-normal">Received</th>
                    <th scope="col" className="py-2 pr-4 font-normal">Name</th>
                    <th scope="col" className="py-2 pr-4 font-normal">Contact</th>
                    <th scope="col" className="py-2 pr-4 font-normal">Service</th>
                    <th scope="col" className="py-2 pr-4 font-normal">Tier</th>
                    <th scope="col" className="py-2 pr-4 font-normal">Page</th>
                    <th scope="col" className="py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l) => (
                    <tr key={l.id} className="border-b border-bone/10 align-top">
                      <td className="py-3 pr-4 whitespace-nowrap text-bone-subtle">{fmtLeadDate(l.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Link href={`/admin/leads/${l.id}`} className="text-brass underline">
                          {l.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-bone-muted">
                        {l.email ?? ''}
                        {l.email && l.phone ? ' · ' : ''}
                        {l.phone ?? ''}
                      </td>
                      <td className="py-3 pr-4 text-bone-muted">{l.service}</td>
                      <td className="py-3 pr-4 text-bone-muted">{l.tierRecommended ?? '—'}</td>
                      <td className="py-3 pr-4 text-bone-subtle">{l.pagePath ?? '—'}</td>
                      <td className="py-3">
                        <LeadStatusControl key={`${l.id}-${l.status}`} leadId={l.id} status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="space-y-4 md:hidden">
                {rows.map((l) => (
                  <li key={l.id} className="rounded border border-bone/10 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/admin/leads/${l.id}`} className="text-brass underline">
                        {l.name}
                      </Link>
                      <LeadStatusControl key={`${l.id}-${l.status}`} leadId={l.id} status={l.status} />
                    </div>
                    <div className="mt-1 text-sm text-bone-muted">
                      {l.service}
                      {l.tierRecommended ? ` · ${l.tierRecommended}` : ''}
                    </div>
                    <div className="mt-1 text-sm text-bone-muted">
                      {[l.email, l.phone].filter(Boolean).join(' · ')}
                    </div>
                    <div className="mt-1 text-xs text-bone-subtle">{fmtLeadDate(l.createdAt)}</div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 ? (
                <div className="mt-8 flex items-center gap-4 text-sm">
                  {page > 1 ? (
                    <Link href={href({ status, client, page: page - 1 })} className="text-brass underline">
                      ← Newer
                    </Link>
                  ) : null}
                  <span className="text-bone-subtle">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link href={href({ status, client, page: page + 1 })} className="text-brass underline">
                      Older →
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
