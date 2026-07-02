'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/chatbot/lead-status';

export function LeadStatusControl({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  async function onChange(next: LeadStatus) {
    setError(false);
    setSaving(true);
    setValue(next);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      startTransition(() => router.refresh());
    } catch {
      setValue(status); // revert
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => void onChange(e.target.value as LeadStatus)}
        aria-label="Lead status"
        className="rounded border border-bone/20 bg-black px-2 py-1 text-sm text-bone-muted disabled:opacity-50"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-400">save failed</span> : null}
    </span>
  );
}
