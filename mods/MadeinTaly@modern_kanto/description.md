# Four fixes Gen 1 never got

**Beta.** Every piece switches on its own, and the ones that move the
balance are off until you turn them on.

## SPLIT — the Gen 4 move split

Gen 1 takes the category from the TYPE: every Water move is special, every
Normal move physical. So Gyarados — 125 Attack, 60 Special — throws Hydro
Pump off the wrong stat, and Hitmonchan cannot meaningfully use its
elemental punches.

The engine already supports the per-move answer; Gen 1 just never fills the
field. `Damage.categoryOf` reads "the move's own category field wins, then
the merged type record's". So this is 17 registry patches — pure data, no
damage hook — and it composes with anything else that touches a battle.

## GHOST FIX — on by default, on its own switch

Ghost does **0x** to Psychic in Gen 1, where 2x was intended. Gen 1's only
Ghost moves sit on Poison-typed Pokemon, which Psychic resists, so Psychic
ends the generation with no counterplay at all.

That is a bug, so it is separate from the other three chart rows, which are
Gen 2 rebalancing a working table and live behind TYPE CHART. All four were
read out of the decoded chart, and a test asserts the ROM still says what
the mod claims.

## SMART AI — a fix, not an addition

Registering a new AI layer does nothing: TrainerAI walks the trainer class's
own list of layers, so an id nobody references never runs. This patches
LAYER_3, the vanilla type pass, whose own comment admits it "only reads the
FIRST matching row -- no dual-type product". That is why a trainer throws
Earthquake at a Pidgey: it sees the 2x against Rock and never reaches the
Flying immunity. This multiplies them out.

It still only nudges scores; vanilla's other passes run untouched.

## ATLAS — what lives where

Gen 1 holds a complete encounter table and shows none of it. The Atlas reads
the merged dataset — so a mod that edits encounters appears here too — folds
slots into one row per species with its real level range, and marks each
against your dex.

Lua source only: no ROM, no ROM-derived data, no game assets.
