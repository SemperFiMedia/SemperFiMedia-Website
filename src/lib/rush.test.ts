/**
 * Rush fees on music videos, trailers and websites are a percent of the BASE
 * (package or tier) price only, never of add-ons, colour work or hosting, and
 * only when the client asks for rush. Owner's call, 2026-10-04.
 */
import { describe, it, expect } from 'vitest';
import { semperFiConfig } from './chatbot/client-config';
import { MUSIC_VIDEO_PRICE, MUSIC_VIDEO_RUSH_PERCENT, musicVideoRushFee } from './music-videos';
import { TRAILER_TIERS, TRAILER_ADD_ONS, TRAILER_RUSH_PERCENT, trailerRushFee } from './trailer-editing';
import { WEBSITE_TIERS, WEBSITE_ADD_ONS, WEBSITE_RUSH_PERCENT, websiteRushFee } from './website-design';

const md = semperFiConfig.servicesMarkdown;

describe('rush fees', () => {
  it('are a percent of the base price only', () => {
    expect(musicVideoRushFee()).toBe((MUSIC_VIDEO_PRICE * MUSIC_VIDEO_RUSH_PERCENT) / 100);
    for (const t of TRAILER_TIERS) expect(trailerRushFee(t.id)).toBe(Math.round((t.price * TRAILER_RUSH_PERCENT) / 100));
    for (const t of WEBSITE_TIERS) expect(websiteRushFee(t.id)).toBe(Math.round((t.price * WEBSITE_RUSH_PERCENT) / 100));
  });

  it('every page that lists rush says it is on the base price only', () => {
    const trailerRush = TRAILER_ADD_ONS.find((a) => a.name === 'Rush Delivery');
    const websiteRush = WEBSITE_ADD_ONS.find((a) => a.name === 'Rush Delivery');
    expect(trailerRush?.price).toBe(`+${TRAILER_RUSH_PERCENT}%`);
    expect(trailerRush?.note).toMatch(/^Of the tier price only/);
    expect(websiteRush?.price).toBe(`+${WEBSITE_RUSH_PERCENT}%`);
    expect(websiteRush?.note).toMatch(/^Of the build price only/);
  });

  it('the chatbot is told to add rush only when asked, on the base only', () => {
    const flat = md.replace(/\s+/g, ' ');
    expect(flat.match(/Add rush ONLY if/g)?.length).toBe(3);
    expect(flat).toContain('25% of the tier price only');
    expect(flat).toContain('25% of the tier (build) price only');
  });
});
