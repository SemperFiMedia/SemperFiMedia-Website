import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendTelegram = vi.fn();
vi.mock('./telegram', () => ({ sendTelegram: (...a: unknown[]) => sendTelegram(...a) }));

import { sendOwnerAlert } from './channel';
import type { ChatbotClientConfig } from '@/lib/chatbot/client-config';

function cfg(channel: 'telegram' | 'sms' | 'none'): ChatbotClientConfig {
  return { vip: { channel, thresholds: [] } } as unknown as ChatbotClientConfig;
}

beforeEach(() => sendTelegram.mockReset());

describe('sendOwnerAlert', () => {
  it('dispatches telegram', async () => {
    sendTelegram.mockResolvedValue(undefined);
    await sendOwnerAlert('hello', cfg('telegram'));
    expect(sendTelegram).toHaveBeenCalledWith('hello');
  });

  it('sms stub warns and does not throw', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(sendOwnerAlert('x', cfg('sms'))).resolves.toBeUndefined();
    expect(sendTelegram).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('none is a no-op', async () => {
    await sendOwnerAlert('x', cfg('none'));
    expect(sendTelegram).not.toHaveBeenCalled();
  });

  it('swallows adapter throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    sendTelegram.mockImplementationOnce(async () => {
      throw new Error('boom');
    });
    await expect(sendOwnerAlert('x', cfg('telegram'))).resolves.toBeUndefined();
    warn.mockRestore();
  });
});
