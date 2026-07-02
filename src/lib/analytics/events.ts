import { z } from 'zod';

// Event names are app-internal. Each maps to GA4 + Meta names + CAPI flag.
export const EVENTS = {
  page_view: { ga4: 'page_view', meta: 'PageView', capi: false },
  Lead: { ga4: 'generate_lead', meta: 'Lead', capi: true },
  Schedule: { ga4: 'schedule', meta: 'Schedule', capi: true },
  Contact: { ga4: 'contact', meta: 'Contact', capi: true },
  ViewContent: { ga4: 'view_item', meta: 'ViewContent', capi: true },
  configurator_open: { ga4: 'begin_checkout', meta: 'InitiateCheckout', capi: true },
  configurator_change: { ga4: 'add_to_cart', meta: 'AddToCart', capi: true },
  configurator_quote: { ga4: 'view_item', meta: 'ViewContent', capi: true },
  configurator_abandon: { ga4: 'configurator_abandon', meta: null, capi: false },
  form_start: { ga4: 'form_start', meta: null, capi: false },
  form_progress: { ga4: 'form_progress', meta: null, capi: false },
  form_abandon: { ga4: 'form_abandon', meta: null, capi: false },
  video_play: { ga4: 'video_start', meta: null, capi: false },
  video_progress: { ga4: 'video_progress', meta: null, capi: false },
  video_complete: { ga4: 'video_complete', meta: null, capi: false },
  scroll_depth: { ga4: 'scroll', meta: null, capi: false },
  outbound_click: { ga4: 'click_outbound', meta: null, capi: false },
  file_download: { ga4: 'file_download', meta: null, capi: false },
  cta_click: { ga4: 'cta_click', meta: null, capi: false },
  chat_open: { ga4: 'chat_open', meta: null, capi: false },
  chat_message_sent: { ga4: 'chat_message_sent', meta: null, capi: false },
  chat_exit_intent: { ga4: 'chat_exit_intent', meta: null, capi: false },
  social_follow_click: { ga4: 'social_follow_click', meta: null, capi: false },
  page_timing: { ga4: 'page_timing', meta: null, capi: false },
  rage_click: { ga4: 'rage_click', meta: null, capi: false },
} as const;

export type EventName = keyof typeof EVENTS;

// Allowlist of CAPI-eligible names (used by the server route to reject arbitrary events).
export const CAPI_EVENT_NAMES = Object.entries(EVENTS)
  .filter(([, v]) => v.capi)
  .map(([k]) => k as EventName);

// Per-event param schema. Loose by design — values get spread into ga4/meta/custom_data.
export const EventParamsSchema = z
  .object({
    value: z.number().optional(),
    currency: z.string().optional(),
    content_ids: z.array(z.string()).optional(),
    content_type: z.string().optional(),
    content_name: z.string().optional(),
    method: z.enum(['tel', 'mailto']).optional(),
    label: z.string().optional(),
    location: z.string().optional(),
    field: z.string().optional(),
    tier: z.string().optional(),
    addOnId: z.string().optional(),
    action: z.enum(['add', 'remove']).optional(),
    network: z.string().optional(),
    url: z.string().optional(),
    host: z.string().optional(),
    ext: z.string().optional(),
    percent: z.number().optional(),
    milestone: z.number().optional(),
    selector: z.string().optional(),
    video_title: z.string().optional(),
    video_id: z.string().optional(),
    video_duration: z.number().optional(),
    video_provider: z.string().optional(),
    message_count: z.number().optional(),
    page_path: z.string().optional(),
    page_title: z.string().optional(),
    page_referrer: z.string().optional(),
    em: z.string().optional(),
    ph: z.string().optional(),
    fn: z.string().optional(),
    ln: z.string().optional(),
    zp: z.string().optional(),
  })
  .passthrough();

export type EventParams = z.infer<typeof EventParamsSchema>;
