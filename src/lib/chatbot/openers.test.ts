import { describe, it, expect } from 'vitest';
import { getChatStrings } from './openers';

describe('getChatStrings', () => {
  it('most-specific path wins', () => {
    expect(getChatStrings('/corporate/music-videos').opener).toMatch(/\$3,000/);
    expect(getChatStrings('/corporate').opener).toMatch(/brand film or commercial/i);
  });

  it('prefix match covers child routes', () => {
    expect(getChatStrings('/work/some-slug').opener).toMatch(/portfolio/i);
    expect(getChatStrings('/work/some-slug/cinematic').opener).toMatch(/portfolio/i);
  });

  it('home gets the home opener, not a prefix match of everything', () => {
    expect(getChatStrings('/').opener).toMatch(/what brought you in/i);
    expect(getChatStrings('/privacy').opener).not.toMatch(/what brought you in/i);
  });

  it('unmapped English path falls back to the default greeting', () => {
    const s = getChatStrings('/privacy');
    expect(s.opener).toBe(s.defaultGreeting);
    expect(s.defaultGreeting).toMatch(/concierge/i);
  });

  it('new sales pages have tailored openers', () => {
    expect(getChatStrings('/film-production').opener).toMatch(/\$1,500/);
    expect(getChatStrings('/film-production').opener).toMatch(/\$5,500/);
    expect(getChatStrings('/refer').opener).toMatch(/\$200/);
    expect(getChatStrings('/shoots').opener).toMatch(/recent/i);
    expect(getChatStrings('/about').opener).toMatch(/marine/i);
    expect(getChatStrings('/contact').opener).toMatch(/TJ/);
  });

  it('/es paths get Spanish strings across the board', () => {
    const s = getChatStrings('/es/weddings');
    expect(s.opener).toMatch(/\$3,500/);
    expect(s.opener).toMatch(/boda/i);
    expect(s.exitIntent).toMatch(/antes de que te vayas/i);
    expect(s.afterHoursNote).toMatch(/fuera de horario/i);
    expect(s.teaser).toMatch(/precios/i);
    expect(s.dismissLabel).toBe('Cerrar');
  });

  it('/es home gets the tailored Spanish home opener, not the default', () => {
    const s = getChatStrings('/es');
    expect(s.opener).toMatch(/veterano/i);
    expect(s.opener).not.toBe(s.defaultGreeting);
  });

  it('unmapped /es path falls back to the Spanish default greeting', () => {
    const s = getChatStrings('/es/unmapped-page');
    expect(s.opener).toBe(s.defaultGreeting);
    expect(s.defaultGreeting).toMatch(/conserje/i);
  });

  it('English paths get English exit/after-hours/teaser strings', () => {
    const s = getChatStrings('/weddings');
    expect(s.exitIntent).toMatch(/before you head out/i);
    expect(s.afterHoursNote).toMatch(/after hours/i);
    expect(s.teaser).toMatch(/before you go/i);
  });

  it('paths that merely start with "es" are not Spanish', () => {
    expect(getChatStrings('/espanol').defaultGreeting).toMatch(/concierge/i);
  });
});
