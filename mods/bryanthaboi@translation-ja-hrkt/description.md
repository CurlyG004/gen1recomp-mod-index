# JP GREEN - Poketto Monsutā Midori (ポケットモンスター 緑)

Japanese translation of Pokémon Red and Blue. Text comes from PokeCorpus and
renders through the engine's bundled Plain Pixel TTF, which already covers
kana and CJK — so the mod ships as text and nothing else. No glyph sheet, no
charmap extension, no ROM-derived content. Bring your own imported ROM.

Coverage for this build:

- ROM catalogs (species, moves, items, trainers, dialogue, dex): **3107/3107 (100%)**
- Engine strings: **432/592 (73%)**
- Total strings loaded: **3619**

Untranslated entries fall back to English, so the game stays playable
everywhere the translation has not reached yet.

## Font handling

The font registers at `size = 10` with `tiles = "0123456789/:"`. At that size
a kana advances exactly 8px, filling one engine cell the way the Japanese
ROM's own 8x8 kana tiles did; larger sizes clip against the 8px menu grid.
Keeping digits, `/` and `:` on the vanilla ROM tiles holds the numeric
columns (HP, levels) in line with the English build. `tiles` is an engine
option added for this mod, so an older engine build ignores the field and
misaligns numbers.

## Install

1. Download `translation-ja-hrkt-0.4.4.zip` from the
   [releases page](https://github.com/bryanthaboi/JP-GREEN-Poketto-Monsuta-Midori/releases).
2. In the launcher: MODS → **Import mod .zip** (or drop the zip on the
   launcher window).

With `"github": "bryanthaboi/JP-GREEN-Poketto-Monsuta-Midori"` set, the
launcher's **Update** and **Versions** buttons pick up new releases from
there.
