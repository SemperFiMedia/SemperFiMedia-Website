'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getBookingStrings } from '@/lib/chatbot/booking-strings';
import type { BookPrefill } from '@/lib/chatbot/book-token';
import { track } from '@/lib/analytics/track';

type MeetingType = 'zoom' | 'phone';
type SlotsByDay = Record<string, { start: string }[]>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TZ = 'America/Chicago';
const MAX_DAYS = 4;
const MAX_PER_DAY = 6;

type Props = {
  prefill: BookPrefill;
  onOpenEmbed: () => void;
};

export function SlotPickerCard({ prefill, onOpenEmbed }: Props) {
  const pathname = usePathname();
  const s = getBookingStrings(pathname);

  const [type, setType] = useState<MeetingType>('zoom');
  const [refreshKey, setRefreshKey] = useState(0);
  const [slots, setSlots] = useState<SlotsByDay | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState(prefill.name ?? '');
  const [email, setEmail] = useState(prefill.email ?? '');
  const [phone, setPhone] = useState(prefill.phone ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<'taken' | 'generic' | null>(null);
  const [done, setDone] = useState<{ when: string; email: string; meetingUrl: string | null } | null>(null);

  const dayFmt = useMemo(
    () => new Intl.DateTimeFormat(s.locale, { weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ }),
    [s.locale],
  );
  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(s.locale, { hour: 'numeric', minute: '2-digit', timeZone: TZ }),
    [s.locale],
  );

  useEffect(() => {
    let alive = true;
    setSlots(null);
    setSelected(null);
    setLoadFailed(false);
    fetch(`/api/book/slots?type=${type}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { slots: SlotsByDay }) => {
        if (alive) setSlots(j.slots);
      })
      .catch(() => {
        if (alive) setLoadFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [type, refreshKey]);

  async function book() {
    if (!selected || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, start: selected, name, email, phone: phone || undefined }),
      });
      if (res.status === 409) {
        // The picked slot is gone — retrigger the guarded slots effect instead
        // of racing an unguarded inline fetch against it.
        setSelected(null);
        setError('taken');
        setRefreshKey((k) => k + 1);
        return;
      }
      if (!res.ok) {
        setError('generic');
        return;
      }
      const j = (await res.json()) as { meetingUrl: string | null };
      const when = `${dayFmt.format(new Date(selected))} · ${timeFmt.format(new Date(selected))}`;
      setDone({ when, email, meetingUrl: j.meetingUrl });
      void track('chat_booking_confirmed', { label: type });
    } catch {
      setError('generic');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4 text-sm text-bone-muted" role="status">
        <p>{s.success(done.when, done.email)}</p>
        {done.meetingUrl ? (
          <a href={done.meetingUrl} className="mt-2 inline-block text-brass underline" target="_blank" rel="noreferrer">
            {s.joinLink} →
          </a>
        ) : null}
      </div>
    );
  }

  const noTimes = slots !== null && Object.keys(slots).length === 0;
  if (loadFailed || noTimes) {
    return (
      <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4 text-sm text-bone-muted">
        <p>{loadFailed ? s.loadFailed : s.noTimes}</p>
        <button
          type="button"
          onClick={onOpenEmbed}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brass px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour"
        >
          {s.openEmbed} →
        </button>
      </div>
    );
  }

  const days = slots ? Object.keys(slots).sort().slice(0, MAX_DAYS) : [];
  const valid =
    Boolean(selected) && name.trim().length > 0 && EMAIL_RE.test(email) && (type !== 'phone' || phone.trim().length > 0);

  return (
    <div className="mt-3 rounded-lg border border-brass/40 bg-brass/10 p-4">
      <div className="font-serif text-base italic text-bone">{s.heading}</div>
      <div className="text-[10px] text-bone-subtle">{s.tzNote}</div>

      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={s.heading}>
        {(['zoom', 'phone'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => setType(t)}
            className={
              type === t
                ? 'rounded border border-brass px-2.5 py-1 text-xs text-brass'
                : 'rounded border border-bone/20 px-2.5 py-1 text-xs text-bone-muted hover:border-bone/40'
            }
          >
            {t === 'zoom' ? s.typeZoom : s.typePhone}
          </button>
        ))}
      </div>

      {slots === null ? (
        <p className="mt-3 text-xs text-bone-subtle">…</p>
      ) : (
        <div className="mt-3 space-y-2">
          {days.map((day) => (
            <div key={day}>
              <div className="text-[10px] uppercase tracking-wider text-bone-subtle">
                {dayFmt.format(new Date(`${day}T12:00:00Z`))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {(slots[day] ?? []).slice(0, MAX_PER_DAY).map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    aria-pressed={selected === slot.start}
                    onClick={() => {
                      setError(null);
                      setSelected(slot.start);
                    }}
                    className={
                      selected === slot.start
                        ? 'rounded bg-brass px-2 py-1 text-xs font-bold text-gunpowder'
                        : 'rounded border border-bone/20 px-2 py-1 text-xs text-bone-muted hover:border-brass/60'
                    }
                  >
                    {timeFmt.format(new Date(slot.start))}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={s.namePlaceholder}
          aria-label={s.namePlaceholder}
          className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={s.emailPlaceholder}
          aria-label={s.emailPlaceholder}
          type="email"
          className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
        />
        {type === 'phone' ? (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={s.phonePlaceholder}
            aria-label={s.phonePlaceholder}
            type="tel"
            className="w-full rounded-md border border-brass/30 bg-gunpowder/80 px-3 py-2 text-sm text-bone placeholder:text-bone-subtle focus:border-brass focus:outline-none"
          />
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-400" role="status">
          {error === 'taken' ? s.slotTaken : s.errorGeneric}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void book()}
        disabled={!valid || submitting}
        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brass px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gunpowder transition-colors hover:bg-golden-hour disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? s.booking : `${s.confirmCta} →`}
      </button>
    </div>
  );
}
