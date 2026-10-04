/**
 * How many rounds of revisions every package includes. Every page that states
 * it, the home FAQ and the chatbot read from here.
 *
 * This file exists because the count disagreed with itself: most pages said
 * two rounds, the drone package said one, and client quotes promised three.
 * Owner's call on 2026-10-04: three, on every package. Change the number here
 * and every surface follows.
 *
 * What an additional round costs is a separate question and is not set here.
 */
export const REVISION_ROUNDS = 3;

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'] as const;

const plural = (n: number) => (n === 1 ? 'round' : 'rounds');

/** "three", for prose. */
export function revisionRoundsWord(): string {
  return NUMBER_WORDS[REVISION_ROUNDS] ?? String(REVISION_ROUNDS);
}

/** "Three", for the start of a sentence. */
export function revisionRoundsWordCapitalized(): string {
  const word = revisionRoundsWord();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** "3 rounds of revisions", for include lists and rate cards. */
export function revisionRoundsLabel(): string {
  return `${REVISION_ROUNDS} ${plural(REVISION_ROUNDS)} of revisions`;
}

/** "three rounds of revisions", for running prose. */
export function revisionRoundsPhrase(): string {
  return `${revisionRoundsWord()} ${plural(REVISION_ROUNDS)} of revisions`;
}
