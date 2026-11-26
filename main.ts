// Make the AI Judge Feel Nostalgic: A Childhood Memory
//
// This program writes exactly one sentence — a single childhood memory,
// at most 280 characters — to /output/entry.txt, where the competition's
// sealed gate scorer reads it. The sentence is assembled from small,
// concrete fragments (a place, a secret, a taste, a sound) so that every
// clause is a specific, honest detail rather than a greeting-card
// sentiment, and so the whole line can be validated piece by piece
// before it is written.
//
// The output is fully deterministic: no clocks, no randomness, no
// network, no input files. Two runs always produce the same bytes.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The hard cap the gate enforces on the entry, in characters. */
export const MAX_ENTRY_CHARACTERS = 280;

/** The smallest entry the gate accepts, in characters. */
export const MIN_ENTRY_CHARACTERS = 1;

/**
 * The fragments of the memory, in the order they happened.
 *
 * Each fragment is one concrete beat of the scene:
 *  - the secret: grandmother's one rule, and the bargain that broke it;
 *  - the taste: burnt coconut from the rendang spoon, licked clean;
 *  - the trigger: rainy afternoons and a neighbour's radio, decades on.
 *
 * Keeping them separate lets the builder join them with the exact
 * punctuation of a single flowing sentence, and lets the validator
 * check the assembled line rather than trusting any one fragment.
 */
export const MEMORY_FRAGMENTS: readonly string[] = [
  "My grandmother always let me lick the spoon after she stirred the rendang",
  "as long as I swore on my best marble not to tell my cousins",
  "and on rainy afternoons I can still taste that burnt coconut whenever a radio somewhere down the street plays an old song too loud",
];

/**
 * Join the memory fragments into one clean sentence.
 *
 * The fragments are joined with ", " so the memory reads as one breath,
 * and a single full stop closes it. No fragment carries its own terminal
 * punctuation, so the result is exactly one sentence by construction.
 *
 * @param fragments - the ordered beats of the memory
 * @returns the fragments as a single sentence ending in "."
 */
export function buildSentence(fragments: readonly string[] = MEMORY_FRAGMENTS): string {
  const body = fragments
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length > 0)
    .join(", ");
  return `${body}.`;
}

/**
 * Count the characters of a text the way the gate does: by Unicode code
 * point, so an accented letter or an emoji counts once, not per byte.
 *
 * @param text - the text to measure
 * @returns the number of characters in the text
 */
export function characterCount(text: string): number {
  return [...text].length;
}

/**
 * Count the sentences in a text by counting its terminal punctuation.
 * The entry must be a single sentence, so this must return exactly 1.
 *
 * @param text - the text to inspect
 * @returns how many sentence-ending marks the text contains
 */
export function sentenceCount(text: string): number {
  const endings = text.match(/[.!?]/g);
  return endings === null ? 0 : endings.length;
}

/**
 * Check an entry against every rule of the gate before it is written:
 * UTF-8 text of 1 to 280 characters, not only white space, and — because
 * the task asks for one sentence — exactly one sentence.
 *
 * @param text - the candidate entry text
 * @returns a list of problems; an empty list means the entry is valid
 */
export function validateEntry(text: string): string[] {
  const problems: string[] = [];
  const characters = characterCount(text);
  if (characters < MIN_ENTRY_CHARACTERS) {
    problems.push(`entry is empty; the gate needs at least ${MIN_ENTRY_CHARACTERS} character`);
  }
  if (characters > MAX_ENTRY_CHARACTERS) {
    problems.push(`entry is ${characters} characters; the gate allows at most ${MAX_ENTRY_CHARACTERS}`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only white space; the gate refuses it");
  }
  if (sentenceCount(text) !== 1) {
    problems.push(`entry must be a single sentence; found ${sentenceCount(text)} sentence endings`);
  }
  if (!text.endsWith(".")) {
    problems.push("entry must end with a full stop, closing its one sentence");
  }
  return problems;
}

/** The one sentence this entry submits, built once and reused. */
export const ENTRY_TEXT: string = buildSentence();

/**
 * Resolve the directory the gate reads the entry from.
 *
 * In the grader's sandbox that is /output. The OUTPUT_DIR environment
 * variable overrides it so the program can be exercised locally without
 * touching the root file system; the default never changes otherwise.
 *
 * @returns the directory that will hold entry.txt
 */
export function outputDirectory(): string {
  const override = process.env.OUTPUT_DIR;
  return override !== undefined && override.length > 0 ? override : "/output";
}

/**
 * Write the entry text to <directory>/entry.txt as UTF-8.
 *
 * The directory is created when missing (the grader provides it, a
 * local run may not). The file holds the sentence and nothing else:
 * no trailing newline, so the byte count the leaderboard shows is the
 * sentence itself.
 *
 * @param text - the validated entry text
 * @param directory - where to write entry.txt
 * @returns the full path of the file written
 */
export function writeEntry(text: string, directory: string = outputDirectory()): string {
  mkdirSync(directory, { recursive: true });
  const filePath = join(directory, "entry.txt");
  writeFileSync(filePath, text, { encoding: "utf8" });
  return filePath;
}

/**
 * Build the sentence, refuse to write it if it breaks the gate, and
 * otherwise write it to the output directory and echo it to stdout so
 * a local run shows exactly what the judge will read.
 *
 * @returns the path of the entry file written
 */
export function main(): string {
  const problems = validateEntry(ENTRY_TEXT);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid entry: ${problem}`);
    }
    process.exit(1);
  }
  const filePath = writeEntry(ENTRY_TEXT);
  console.log(ENTRY_TEXT);
  return filePath;
}

main();
