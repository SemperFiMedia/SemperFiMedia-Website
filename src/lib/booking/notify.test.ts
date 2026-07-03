import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendOwnerAlert = vi.fn();
vi.mock('@/lib/notify/channel', () => ({
  sendOwnerAlert: (...a: unknown[]) => sendOwnerAlert(...a),
}));
vi.mock('@/lib/env', () => ({
  env: { resend: { apiKey: '', fromEmail: 'x@x.co' } },
}));

import { notifyBooking } from './notify';
import { semperFiConfig } from '@/lib/chatbot/client-config';

beforeEach(() => sendOwnerAlert.mockReset());

describe('notifyBooking owner alert', () => {
  it('fires the booking alert even when Resend is unconfigured', async () => {
    await notifyBooking(
      {
        type: 'zoom',
        start: '2026-07-08T19:00:00.000Z',
        name: 'Jane Doe',
        email: 'jane@x.com',
        phone: undefined,
        notes: undefined,
        meetingUrl: null,
      },
      semperFiConfig,
    );
    expect(sendOwnerAlert).toHaveBeenCalledTimes(1);
    expect(String(sendOwnerAlert.mock.calls[0]![0])).toContain('📅 Booked: video call');
  });
});
