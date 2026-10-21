/**
 * Which lens goes on which camera body. Every page, rate card, and the chatbot
 * reads the lens names from here.
 *
 * This file exists because the site described glass TJ doesn't shoot with:
 * "Sigma Art primes" on the rental kits and "cinema primes (35mm, 50mm, 85mm)"
 * on the wedding tiers and in the chatbot. Owner's call on 2026-10-21: the FX3
 * always runs the Sony G Master II 24-70mm, and the A7S III always runs the
 * Sigma 35-170mm. Change a lens here and every surface follows.
 */

/** Sony FX3, the A camera. */
export const FX3_LENS = 'Sony G Master II 24-70mm';
/** Sony A7S III, the B camera. */
export const A7S3_LENS = 'Sigma 35-170mm';

/** "Sony FX3 + Sony G Master II 24-70mm" */
export const FX3_WITH_LENS = `Sony FX3 + ${FX3_LENS}`;
/** "Sony A7S III + Sigma 35-170mm" */
export const A7S3_WITH_LENS = `Sony A7S III + ${A7S3_LENS}`;

/** "Sony FX3 (Sony G Master II 24-70mm) and A7S III (Sigma 35-170mm)", for prose. */
export function cameraPackageSentence(): string {
  return `Sony FX3 (${FX3_LENS}) and A7S III (${A7S3_LENS})`;
}

/** Spanish, for the /es site. */
export function cameraPackageSentenceEs(): string {
  return `Sony FX3 (${FX3_LENS}) y A7S III (${A7S3_LENS})`;
}
