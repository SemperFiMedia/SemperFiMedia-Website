'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics/track';
import { captureUtmIfFirstTouch } from '@/lib/analytics/utm';

const SCROLL_THRESHOLDS = [25, 50, 75, 90];
const TIME_MILESTONES = [30, 60, 180]; // seconds
const RAGE_WINDOW_MS = 2000;
const RAGE_THRESHOLD = 3;

function PageTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);
  const scrollFired = useRef<Set<number>>(new Set());
  const timersRef = useRef<number[]>([]);
  const rageRef = useRef<{ selector: string; times: number[] } | null>(null);

  // Capture UTM on first paint
  useEffect(() => {
    if (typeof window === 'undefined') return;
    captureUtmIfFirstTouch(window.location.href);
  }, []);

  // page_view on every nav
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (lastPath.current === url) return;
    lastPath.current = url;
    scrollFired.current = new Set();
    void track('page_view');

    // Reset time milestones
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = TIME_MILESTONES.map((s) =>
      window.setTimeout(() => void track('page_timing', { milestone: s }), s * 1000),
    );

    return () => timersRef.current.forEach((id) => window.clearTimeout(id));
  }, [pathname, searchParams]);

  // Scroll depth
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      const pct = Math.round((doc.scrollTop / max) * 100);
      for (const t of SCROLL_THRESHOLDS) {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t);
          void track('scroll_depth', { percent: t });
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outbound + file-download click delegate
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest('a') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href') ?? '';
      if (!href) return;

      // File download
      if (/\.(pdf|zip|doc|docx|xls|xlsx|ppt|pptx|csv)$/i.test(href)) {
        const ext = href.split('.').pop()?.toLowerCase();
        void track('file_download', { url: href, ext });
        return;
      }

      // Outbound
      if (/^https?:/i.test(href)) {
        try {
          const u = new URL(href, window.location.href);
          if (u.host && u.host !== window.location.host) {
            void track('outbound_click', { url: u.toString(), host: u.host });
          }
        } catch {
          /* ignore malformed */
        }
      }

      // Rage detection
      const sel = elementSelector(target);
      const now = Date.now();
      if (rageRef.current && rageRef.current.selector === sel) {
        rageRef.current.times = rageRef.current.times.filter((t) => now - t < RAGE_WINDOW_MS);
        rageRef.current.times.push(now);
        if (rageRef.current.times.length >= RAGE_THRESHOLD) {
          void track('rage_click', { selector: sel });
          rageRef.current = null;
        }
      } else {
        rageRef.current = { selector: sel, times: [now] };
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}

function elementSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const cls = (el.className || '').toString().trim().split(/\s+/).slice(0, 2).join('.');
  return cls ? `${tag}.${cls}` : tag;
}

export function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerInner />
    </Suspense>
  );
}
