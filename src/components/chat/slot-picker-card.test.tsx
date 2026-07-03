import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/weddings' }));
vi.mock('@/lib/analytics/track', () => ({ track: vi.fn() }));

import { SlotPickerCard } from './slot-picker-card';

const fetchMock = vi.fn();

const SLOTS = {
  slots: { '2026-07-06': [{ start: '2026-07-06T14:00:00.000Z' }] },
  timezone: 'America/Chicago',
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe('SlotPickerCard', () => {
  it('books the selected slot with prefilled contact info', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, SLOTS)) // slots load
      .mockResolvedValueOnce(jsonResponse(200, { ok: true, meetingUrl: 'https://cal.com/v/u1' }));
    render(
      <SlotPickerCard prefill={{ name: 'Jane', email: 'jane@x.com' }} onOpenEmbed={() => {}} />,
    );
    const chip = await screen.findByRole('button', { name: /9:00/ });
    await userEvent.click(chip);
    await userEvent.click(screen.getByRole('button', { name: /book it/i }));
    await waitFor(() => expect(screen.getByText(/you're booked/i)).toBeInTheDocument());
    const postBody = JSON.parse((fetchMock.mock.calls[1]![1] as RequestInit).body as string);
    expect(postBody).toMatchObject({ type: 'zoom', name: 'Jane', email: 'jane@x.com' });
  });

  it('shows slot-taken and refreshes on 409', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, SLOTS))
      .mockResolvedValueOnce(jsonResponse(409, { ok: false, reason: 'slot_taken' }))
      .mockResolvedValueOnce(jsonResponse(200, SLOTS));
    render(<SlotPickerCard prefill={{ name: 'J', email: 'j@x.co' }} onOpenEmbed={() => {}} />);
    await userEvent.click(await screen.findByRole('button', { name: /9:00/ }));
    await userEvent.click(screen.getByRole('button', { name: /book it/i }));
    await waitFor(() => expect(screen.getByText(/just got grabbed/i)).toBeInTheDocument());
  });

  it('falls back to the embed button when slots fail to load', async () => {
    const onOpenEmbed = vi.fn();
    fetchMock.mockResolvedValueOnce(jsonResponse(503, { error: 'Booking unavailable.' }));
    render(<SlotPickerCard prefill={{}} onOpenEmbed={onOpenEmbed} />);
    const btn = await screen.findByRole('button', { name: /open booking window/i });
    await userEvent.click(btn);
    expect(onOpenEmbed).toHaveBeenCalled();
  });

  it('falls back to the embed button when no times are open', async () => {
    const onOpenEmbed = vi.fn();
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { slots: {}, timezone: 'America/Chicago' }),
    );
    render(<SlotPickerCard prefill={{}} onOpenEmbed={onOpenEmbed} />);
    expect(await screen.findByText(/no open times/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /open booking window/i }));
    expect(onOpenEmbed).toHaveBeenCalled();
  });
});
