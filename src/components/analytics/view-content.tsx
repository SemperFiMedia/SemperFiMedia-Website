'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics/track';

export function ViewContent({
  contentType,
  contentIds,
  contentName,
  value,
}: {
  contentType: string;
  contentIds?: string[];
  contentName?: string;
  value?: number;
}) {
  useEffect(() => {
    void track('ViewContent', {
      content_type: contentType,
      content_ids: contentIds,
      content_name: contentName,
      value,
      currency: value ? 'USD' : undefined,
    });
  }, [contentType, contentName, value, contentIds]);
  return null;
}
