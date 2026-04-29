import { describe, it, expect } from 'vitest';
import { looksLikeBot } from './bot-defense';

const HUMAN_LOADED_AT = () => Date.now() - 5_000;

describe('looksLikeBot', () => {
  it('passes a normal human-looking submission', () => {
    expect(
      looksLikeBot({
        name: 'Jane Doe',
        email: 'jane@example.com',
        loadedAt: HUMAN_LOADED_AT(),
      }),
    ).toBe(false);
  });

  it('catches honeypot filled with a URL (classic bot)', () => {
    expect(
      looksLikeBot({
        name: 'Jane Doe',
        loadedAt: HUMAN_LOADED_AT(),
        website: 'http://spammer.example.com',
      }),
    ).toBe(true);
  });

  it('catches honeypot filled with whitespace-padded string', () => {
    expect(
      looksLikeBot({
        loadedAt: HUMAN_LOADED_AT(),
        website: '   anything   ',
      }),
    ).toBe(true);
  });

  it('ignores honeypot when empty string (humans never fill it)', () => {
    expect(
      looksLikeBot({
        loadedAt: HUMAN_LOADED_AT(),
        website: '',
      }),
    ).toBe(false);
  });

  it('catches submissions arriving <3s after page load', () => {
    expect(
      looksLikeBot({
        loadedAt: Date.now() - 500,
      }),
    ).toBe(true);
  });

  it('catches submissions with no loadedAt at all (no JS executed)', () => {
    expect(looksLikeBot({ name: 'Bot' })).toBe(true);
  });

  it('catches non-numeric loadedAt (garbage payload)', () => {
    expect(looksLikeBot({ loadedAt: 'not-a-number' })).toBe(true);
  });

  it('accepts numeric-string loadedAt (FormData stringifies values)', () => {
    expect(looksLikeBot({ loadedAt: String(Date.now() - 5_000) })).toBe(false);
  });

  it('does not flag malformed payloads (downstream validators will 400)', () => {
    expect(looksLikeBot(null)).toBe(false);
    expect(looksLikeBot('a string')).toBe(false);
    expect(looksLikeBot(42)).toBe(false);
  });
});
