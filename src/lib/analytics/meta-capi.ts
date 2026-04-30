import { hashPhone, normalizeAndHash, sha256Hex } from './hash';

export type CapiUserData = {
  em?: string; // hashed email
  ph?: string; // hashed phone
  fn?: string;
  ln?: string;
  zp?: string;
  fbp?: string;
  fbc?: string;
  client_ip_address?: string;
  client_user_agent?: string;
};

export type CapiEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: 'website';
  user_data: CapiUserData;
  custom_data: Record<string, unknown>;
};

export type BuildInput = {
  event_name: string;
  event_id: string;
  event_time: number;
  event_source_url: string;
  custom_data: Record<string, unknown>;
  user_data: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    zp?: string;
    fbp?: string;
    fbc?: string;
  };
  ip: string;
  ua: string;
};

// 64-char SHA-256 hex check — skip re-hashing values the client already hashed.
function looksHashed(s?: string): boolean {
  return !!s && /^[a-f0-9]{64}$/.test(s);
}

export async function buildCapiPayload(input: BuildInput): Promise<CapiEvent> {
  const u = input.user_data;
  const user_data: CapiUserData = {
    em: u.em ? (looksHashed(u.em) ? u.em : await normalizeAndHash(u.em)) : undefined,
    ph: u.ph ? (looksHashed(u.ph) ? u.ph : await hashPhone(u.ph)) : undefined,
    fn: u.fn ? (looksHashed(u.fn) ? u.fn : await normalizeAndHash(u.fn)) : undefined,
    ln: u.ln ? (looksHashed(u.ln) ? u.ln : await normalizeAndHash(u.ln)) : undefined,
    zp: u.zp ? (looksHashed(u.zp) ? u.zp : await sha256Hex(u.zp.trim())) : undefined,
    fbp: u.fbp,
    fbc: u.fbc,
    client_ip_address: input.ip,
    client_user_agent: input.ua,
  };

  return {
    event_name: input.event_name,
    event_time: input.event_time,
    event_id: input.event_id,
    event_source_url: input.event_source_url,
    action_source: 'website',
    user_data,
    custom_data: input.custom_data,
  };
}

export async function postCapiEvent(args: {
  pixelId: string;
  accessToken: string;
  event: CapiEvent;
  testEventCode?: string;
  signal?: AbortSignal;
}): Promise<{ ok: boolean; status: number; bodyText: string }> {
  const url = `https://graph.facebook.com/v21.0/${args.pixelId}/events?access_token=${encodeURIComponent(
    args.accessToken,
  )}`;
  const body = {
    data: [args.event],
    ...(args.testEventCode ? { test_event_code: args.testEventCode } : {}),
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: args.signal,
  });
  return { ok: res.ok, status: res.status, bodyText: await res.text() };
}
