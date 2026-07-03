// Owner-alert dispatch. Channel comes from per-client config so a resold
// chatbot swaps channels without code changes. ALWAYS best-effort — an alert
// failure must never break lead capture, booking, or the chat stream.
import { sendTelegram } from './telegram';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

export async function sendOwnerAlert(
  text: string,
  config: ChatbotClientConfig,
): Promise<void> {
  try {
    switch (config.vip.channel) {
      case 'telegram':
        await sendTelegram(text);
        break;
      case 'sms':
        // Stub until the first resold-chatbot client needs SMS (Twilio).
        console.warn('[notify] sms channel not implemented — alert skipped');
        break;
      case 'none':
        break;
    }
  } catch (err) {
    console.warn('[notify] owner alert failed:', err instanceof Error ? err.message : err);
  }
}
