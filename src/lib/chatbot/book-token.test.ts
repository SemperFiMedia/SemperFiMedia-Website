import { describe, it, expect } from 'vitest';
import { parseBookToken } from './book-token';

const TOKEN = '[[BOOK]]';

describe('parseBookToken', () => {
  it('no token → text unchanged, book false', () => {
    expect(parseBookToken('hello there', TOKEN)).toEqual({
      text: 'hello there',
      book: false,
      prefill: {},
    });
  });

  it('bare token → book true, empty prefill, token stripped', () => {
    const r = parseBookToken(`Let's get you scheduled.\n${TOKEN}`, TOKEN);
    expect(r.book).toBe(true);
    expect(r.prefill).toEqual({});
    expect(r.text).toBe("Let's get you scheduled.");
  });

  it('token with payload → prefill parsed and stripped from text', () => {
    const r = parseBookToken(
      `Here you go.\n${TOKEN}{"name":"Jane Doe","email":"jane@x.com","phone":"210-555-1234"}`,
      TOKEN,
    );
    expect(r.prefill).toEqual({ name: 'Jane Doe', email: 'jane@x.com', phone: '210-555-1234' });
    expect(r.text).toBe('Here you go.');
  });

  it('malformed payload → book true, empty prefill, JSON fragment left out of prefill', () => {
    const r = parseBookToken(`Pick a time.\n${TOKEN}{"name": broken`, TOKEN);
    expect(r.book).toBe(true);
    expect(r.prefill).toEqual({});
  });

  it('non-string payload values are ignored', () => {
    const r = parseBookToken(`${TOKEN}{"name":42,"email":"a@b.co"}`, TOKEN);
    expect(r.prefill).toEqual({ email: 'a@b.co' });
  });

  it('repeated tokens are all stripped from the text', () => {
    const r = parseBookToken(`a ${TOKEN} b ${TOKEN}`, TOKEN);
    expect(r.text).toBe('a  b');
    expect(r.book).toBe(true);
  });
});
