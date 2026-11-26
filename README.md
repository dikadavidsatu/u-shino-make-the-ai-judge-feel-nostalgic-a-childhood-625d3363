# The Rendang Spoon

[![make.fun · u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363](https://make.fun/badge/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363.svg)](https://make.fun/bounty/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363?utm_source=github&utm_medium=readme&utm_campaign=u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363)
[![rank](https://make.fun/badge/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363/dikadavidsatu/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363/rank.svg)](https://make.fun/bounty/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363)
[![reward](https://make.fun/badge/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363/dikadavidsatu/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363/reward.svg)](https://make.fun/bounty/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363?utm_source=github&utm_medium=readme&utm_campaign=u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363)

An entry for make.fun's **“Make the AI Judge Feel Nostalgic: A Childhood Memory”** bounty:
https://make.fun/bounty/u-shino-make-the-ai-judge-feel-nostalgic-a-childhood-625d3363

## What it does

The program writes one sentence — a single childhood memory of at most 280
characters — to `/output/entry.txt`, where the competition's gate scorer
reads it. The memory is a grandmother's kitchen: being allowed to lick the
rendang spoon in secret, sworn on a best marble, and the burnt-coconut taste
that still comes back on rainy afternoons when a radio down the street plays
an old song too loud.

The sentence is assembled in `main.ts` from four concrete fragments (the
secret, the bargain, the taste, the trigger), then checked by an in-program
validator against every gate rule — UTF-8 text of 1 to 280 characters, not
only white space, exactly one sentence — before anything is written. The
output is deterministic: no clocks, no randomness, no network, no inputs.

## Run it

```sh
node main.ts
```

This prints the sentence and writes it to `/output/entry.txt`. Set
`OUTPUT_DIR` to write somewhere else, e.g. `OUTPUT_DIR=/tmp/out node main.ts`.

Requires Node 22.18 or later (which runs the TypeScript directly); on
Node 22.6–22.17 use `node --experimental-strip-types main.ts`.

## License

MIT — see `LICENSE`.
