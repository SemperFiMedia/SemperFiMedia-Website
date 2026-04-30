'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { track } from '@/lib/analytics/track';
import type { EventName } from '@/lib/analytics/events';

type TrackProps = {
  trackEvent: EventName;
  trackParams?: Record<string, unknown>;
};

export function TrackedLink({
  trackEvent,
  trackParams,
  onClick,
  ...rest
}: TrackProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        void track(trackEvent, trackParams ?? {});
        onClick?.(e);
      }}
    />
  );
}

export function TrackedButton({
  trackEvent,
  trackParams,
  onClick,
  ...rest
}: TrackProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onClick={(e) => {
        void track(trackEvent, trackParams ?? {});
        onClick?.(e);
      }}
    />
  );
}
