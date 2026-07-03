// Telegram owner-alert adapter. Plain text only (no parse_mode — Telegram
// entity parsing fails on user-supplied names). Best-effort: missing creds
// skip silently; API failures warn and return.
import { env } from '@/lib/env';

export async function sendTelegram(text: string): Promise<void> {
  const { botToken, chatId } = env.telegram;
  if (!botToken || !chatId) return;
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  });
  if (!res.ok) {
    console.warn('[notify] telegram send failed:', res.status);
  }
}
