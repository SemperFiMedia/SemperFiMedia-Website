import { describe, it, expect } from 'vitest';
import { leadAlertText, bookingAlertText } from './messages';

describe('leadAlertText', () => {
  const base = {
    name: 'Jane Doe',
    service: 'Wedding',
    tierRecommended: 'Heirloom ($8,000)',
    phone: '210-555-1234',
    email: 'jane@x.com',
    pagePath: '/weddings',
    projectDetails: 'October 10 at The Adolphus, ~120 guests',
    isVip: true,
  };

  it('VIP header with fire emoji', () => {
    const t = leadAlertText(base);
    expect(t.startsWith('🔥 VIP LEAD — Jane Doe')).toBe(true);
    expect(t).toContain('Wedding (Heirloom ($8,000))');
    expect(t).toContain('📞 210-555-1234');
    expect(t).toContain('✉️ jane@x.com');
    expect(t).toContain('from /weddings');
    expect(t).toContain('📝 October 10 at The Adolphus');
  });

  it('non-VIP header', () => {
    expect(leadAlertText({ ...base, isVip: false }).startsWith('📥 New lead — Jane Doe')).toBe(true);
  });

  it('omits absent fields cleanly', () => {
    const t = leadAlertText({ name: 'Bo', service: 'Website', isVip: false });
    expect(t).not.toContain('📞');
    expect(t).not.toContain('✉️');
    expect(t).not.toContain('📝');
    expect(t).not.toContain('from ');
    expect(t).not.toContain('(');
  });

  it('truncates details at 300 chars with ellipsis', () => {
    const t = leadAlertText({ ...base, projectDetails: 'x'.repeat(400) });
    const line = t.split('\n').find((l) => l.startsWith('📝'))!;
    expect(line.length).toBe('📝 '.length + 300 + 1); // 300 chars + '…'
    expect(line.endsWith('…')).toBe(true);
  });
});

describe('bookingAlertText', () => {
  it('video call with date and contact', () => {
    const t = bookingAlertText({
      type: 'zoom',
      start: '2026-07-08T19:00:00.000Z',
      name: 'Jane Doe',
      email: 'jane@x.com',
    });
    expect(t.startsWith('📅 Booked: video call')).toBe(true);
    expect(t).toContain('Jul 8'); // fmtLeadDate, America/Chicago
    expect(t).toContain('Jane Doe (jane@x.com)');
  });

  it('phone call includes the phone number', () => {
    const t = bookingAlertText({
      type: 'phone',
      start: '2026-07-08T19:00:00.000Z',
      name: 'Bo',
      email: 'bo@x.com',
      phone: '210-555-9999',
    });
    expect(t.startsWith('📅 Booked: phone call')).toBe(true);
    expect(t).toContain('Bo (bo@x.com · 210-555-9999)');
  });
});
