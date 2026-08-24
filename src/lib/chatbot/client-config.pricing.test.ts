/**
 * Guards the chatbot's price list against the published rate sheet.
 *
 * The bot is the surface a buyer hears first, so a price that drifts here gets
 * quoted back to us before anyone notices the page says something else. That
 * happened: the bot quoted $100/mo hosting while /corporate/website-design
 * published $399/mo, denied building on Wix while the entry tier IS a Wix
 * build, and had never heard of Session Capture.
 *
 * Session Capture figures are asserted against the module they come from, so
 * changing the price there updates the bot and this test together. The rest are
 * literals on purpose — they should fail loudly when a page price changes, to
 * force someone to update both.
 */
import { describe, it, expect } from 'vitest';
import { semperFiConfig } from './client-config';
import { buildSystemPrompt } from './system-prompt';
import {
  SESSION_CAPTURE_PRICE,
  SESSION_CAPTURE_ADD_ONS,
  addOnPriceLabel,
  formatPrice,
} from '@/lib/session-capture';

const md = semperFiConfig.servicesMarkdown;

describe('chatbot price list', () => {
  it('renders with no unresolved template placeholders', () => {
    expect(buildSystemPrompt(semperFiConfig)).not.toMatch(/\$\{/);
  });

  it('quotes Session Capture from its single source of truth', () => {
    expect(md).toContain(`${formatPrice(SESSION_CAPTURE_PRICE)} flat`);
    for (const addOn of SESSION_CAPTURE_ADD_ONS) {
      expect(md).toContain(`${addOn.name}: ${addOnPriceLabel(addOn)}`);
    }
  });

  it('steers a single conference talk to Session Capture, not Spotlight', () => {
    expect(md).toContain('Do NOT quote the $1,500 Spotlight');
  });

  it('matches the published wedding tiers', () => {
    for (const p of ['$3,500', '$5,000', '$8,000']) expect(md).toContain(p);
  });

  it('matches the published website tiers and hosting rate', () => {
    for (const p of ['$4,500', '$7,500', '$18,000', '$22,500']) expect(md).toContain(p);
    expect(md).toContain('$399/month on a 24-month plan');
  });

  it('does not resurrect the retired hosting tiers', () => {
    for (const dead of ['$100/month', '$400/month', '$600/month']) {
      expect(md).not.toContain(dead);
    }
  });

  it('does not deny building on Wix', () => {
    expect(md).not.toContain('NOT on Wix');
  });

  it('matches the published film production day rates', () => {
    for (const p of ['$1,500', '$2,500', '$5,500']) expect(md).toContain(p);
  });

  it('matches the published trailer, drone, and bundle prices', () => {
    for (const p of ['$3,500+', '$575', '$25,000', '$9,500']) expect(md).toContain(p);
  });

  it('withholds wedding bundle figures, matching the weddings page', () => {
    expect(md).toContain('Do NOT quote bundle figures');
    expect(md).not.toContain('vs $4,000 separate');
  });

  it('covers every service on the rate sheet', () => {
    for (const path of [
      '/weddings',
      '/corporate',
      '/session-capture',
      '/corporate/music-videos',
      '/corporate/trailer-editing',
      '/corporate/website-design',
      '/film-production',
      '/corporate/drone',
      '/refer',
    ]) {
      expect(md).toContain(path);
    }
  });

  it('quotes the one published mileage rate', () => {
    // Was $0.67 across the site and $0.75 on /film-production. TJ confirmed
    // $0.75 is the real rate; this pins the bot to it.
    expect(md).toContain('$0.75/mile');
    expect(md).not.toContain('$0.67');
  });

  it('cites only blog URLs that exist', () => {
    // The old prompt handed visitors a 404 built from the post's title.
    expect(md).not.toContain('/blog/sony-fx3-vs-fx30-dallas-wedding-cinematography.');
    expect(md).toContain(
      '/blog/sony-fx3-vs-sony-fx30-for-dallas-wedding-cinematography-the-definitive-guide',
    );
  });
});
