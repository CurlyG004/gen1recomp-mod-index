# Critical Capture

Gen 5's critical capture for the Gen 1 recomp: a thrown ball can go
critical — a rising whistle, a mid-air pause and shudder, then a single
decisive shake with far better odds than the vanilla three-wobble check.
The chance scales with your Pokedex completion, rescaled from the modern
600+ species to Gen 1's 151.

## How it works

1. Install the mod and enable it in the mod manager (MODS row in OPTIONS).
2. Throw balls at wild Pokemon. Early on, almost nothing goes critical; the
   more species you have registered as owned, the more often it happens.
3. A critical capture whistles, the ball pauses and shudders at the top of
   its arc, and it shakes exactly once before the Pokemon is caught — or
   breaks free.
4. OPTIONS > CRIT CAPTURE cycles **OFF / GEN 5 / GEN 6**. GEN 5 uses the
   cube root of the catch chance for the decisive shake; GEN 6 uses the
   fourth root (critical captures are more effective, exactly as in the
   modern games). **OFF** restores vanilla catching exactly.

The chance is Bulbapedia's Gen 5 model: `c = floor(a * multiplier / 6)`,
rolled as `rng(0,255) < c`, where `a` is the modified catch rate on a
0-255 scale. Since Gen 1's two-roll algorithm never computes an `a`, the
mod uses the exact probability of the throw (the rate roll and the HP roll
combined) scaled to 0-255 — so the critical chance tracks the real odds of
the ball. The multiplier ladder is Gen 5's, rescaled to the 151-species
dex and split into quarter steps, from 2.5 at a complete dex down to 0 for
0-15 species caught.

## Install

1. Download `critical_capture-0.1.1.zip` from the
   [releases page](https://github.com/ShaneMcGovernIE/critical_capture/releases).
2. In the launcher: MODS → **Import mod .zip**.

With `"github": "ShaneMcGovernIE/critical_capture"` set, the launcher's
**Update** and **Versions** buttons handle new releases from there.
