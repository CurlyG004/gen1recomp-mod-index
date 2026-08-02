# Exp Share (Gen 1 / Gen 5+ styles)

Turn party-wide EXP on from the OPTIONS menu, and pick how it splits:
the Gen 1 Exp. All way or the modern Gen 5+ way. Shared exp prints one
"Exp is shared amongst the party" line instead of a gain message per
Pokemon.

## How it works

1. Open OPTIONS and cycle the new **EXP SHARE** row with LEFT/RIGHT:
   **OFF / GEN 1 / GEN 5+**.
2. **GEN 1** (Exp. All): the Pokemon that fought split half the exp; the
   whole party splits the other half — the vanilla Gen 1 split, including
   its participant-division quirk.
3. **GEN 5+**: the fighters keep the full exp split between them; every
   alive bench Pokemon gets half a fighter's share.
4. The fighters' own gains still print per Pokemon, then one
   "Exp is shared amongst the party" line announces the shared exp, and
   every level-up, stat box and move learning still shows for each
   Pokemon that gained exp.
5. **OFF** restores vanilla behavior exactly, including the vanilla
   Exp. All item's per-Pokemon messages.

Fainted Pokemon get no exp (matching Gen 5+ rules). The setting is saved
per save file, like every other OPTIONS row.

## Install

1. Download `exp_share-0.1.1.zip` from the
   [releases page](https://github.com/ShaneMcGovernIE/exp_share/releases).
2. In the launcher: MODS → **Import mod .zip**.

With `"github": "ShaneMcGovernIE/exp_share"` set, the launcher's
**Update** and **Versions** buttons handle new releases from there.
