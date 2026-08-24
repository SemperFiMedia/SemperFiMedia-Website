/**
 * Film production day rates were duplicated across three surfaces — the
 * /film-production page, its configurator, and the chatbot's price list. They
 * all agreed, but only by hand. These assert they now agree by construction.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { semperFiConfig } from './chatbot/client-config';
import {
  FILM_PRODUCTION_TIERS,
  FILM_PRODUCTION_CREW,
  FILM_PRODUCTION_KITS,
  FILM_PRODUCTION_ADD_ONS,
  PER_DIEM_RATE,
  MEAL_PENALTY,
  addOnById,
  filmProductionTotal,
  formatPrice,
  insuranceRangeLabel,
  perDiemHeadCount,
  tierById,
} from './film-production';

const md = semperFiConfig.servicesMarkdown;
const SRC = join(__dirname, '..');

describe('film production rates', () => {
  it('publishes the three day rates', () => {
    expect(FILM_PRODUCTION_TIERS.map((t) => t.price)).toEqual([1500, 2500, 5500]);
  });

  it('passes insurance through per tier', () => {
    expect(FILM_PRODUCTION_TIERS.map((t) => t.insurance)).toEqual([175, 225, 295]);
    expect(insuranceRangeLabel()).toBe('$175–$295');
  });

  it('quotes every crew and kit rate to the chatbot', () => {
    for (const item of [...FILM_PRODUCTION_CREW, ...FILM_PRODUCTION_KITS]) {
      expect(md, `${item.name} missing from the bot`).toContain(
        `${item.name} ${formatPrice(item.price)}`,
      );
    }
  });

  it('quotes every day rate to the chatbot', () => {
    for (const tier of FILM_PRODUCTION_TIERS) {
      expect(md).toContain(`**${tier.name} — ${formatPrice(tier.price)}.**`);
    }
  });

  it('quotes per diem and meal penalty to the chatbot', () => {
    expect(md).toContain(`${formatPrice(PER_DIEM_RATE)}/day`);
    expect(md).toContain(`${formatPrice(MEAL_PENALTY)} per crew member`);
  });

  it('keeps the DP off the configurator — TJ leads every shoot', () => {
    expect(FILM_PRODUCTION_CREW.find((r) => r.id === 'dp')?.configurable).toBe(false);
    expect(addOnById('dp')).toBeUndefined();
    expect(FILM_PRODUCTION_ADD_ONS.some((a) => a.id === 'dp')).toBe(false);
  });

  it('never offers an add-on a tier already bundles', () => {
    for (const tier of FILM_PRODUCTION_TIERS) {
      for (const id of tier.includedAddOnIds) {
        expect(addOnById(id), `${tier.name} bundles unknown add-on ${id}`).toBeDefined();
      }
    }
  });

  it('charges per diem per head, base crew included', () => {
    expect(perDiemHeadCount('solo', [])).toBe(1);
    expect(perDiemHeadCount('full-crew', [])).toBe(4);
    // Adding two crew adds two heads; a kit adds none.
    expect(perDiemHeadCount('solo', ['boom-op', 'pa', 'kit-fx3'])).toBe(3);
  });

  it('totals a configured day correctly', () => {
    const solo = tierById('solo');
    const { subtotal, insurance, perDiem, total } = filmProductionTotal('solo', ['boom-op']);
    expect(subtotal).toBe(solo.price + 550);
    expect(insurance).toBe(175);
    expect(perDiem).toBe(2 * PER_DIEM_RATE);
    expect(total).toBe(subtotal + insurance + perDiem);
  });

  it('leaves no hardcoded day rate in the page or configurator', () => {
    // Both must render from the module, not from their own copy.
    for (const file of [
      join(SRC, 'app', 'film-production', 'page.tsx'),
      join(SRC, 'components', 'film-production', 'production-configurator.tsx'),
    ]) {
      const text = readFileSync(file, 'utf8');
      expect(text).not.toMatch(/price:\s*(1500|2500|5500)\b/);
      expect(text).not.toMatch(/insurance:\s*(175|225|295)\b/);
      expect(text).toContain("@/lib/film-production");
    }
  });
});
