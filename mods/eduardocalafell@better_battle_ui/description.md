# Better Battle UI

A battle-UI revamp that surfaces the information Gen 1 hides and reframes the
HUD to look right in the Dramatic Shape voxel battle — while still working in
the plain 2D battle.

## What it adds

- **Enemy HP** (numbers or %) under the enemy bar, like your own — Gen 1 hides it.
- **Enemy type(s)** as coloured pills.
- **Move effectiveness** while choosing a move: `SUPER ×2` / `RESIST ×½` /
  `NO EFFECT`, plus a `STAB` marker.
- **Stat-stage changes** on both sides (green up, red down).
- **Catch-chance** estimate for a Poké Ball in wild battles (own RNG, never
  desyncs the game).
- **XP bar** for the player's progress to the next level.
- **Framed HUD** — the GB textbox border around the HUD boxes, inset from the
  window edge, with a **HUD SIZE** option (NORMAL / COMPACT / SMALL).

Everything is per-option, all ON by default.

## How it works

The flat battle uses the engine's `battle.overlay` hook. In the voxel battle the
Dramatic Shape mod snaps the HUD to the window edges, so this mod borrows its
exported modules and takes over `OverworldBattle.snapHUDs` to re-composite both
panels (framed, inset, enemy HP under the bar), reusing Dramatic Shape's own
frosted-glass panels — with a full fallback to Dramatic Shape's HUD on any
failure. Nothing distributed is ROM-derived.

## Requires

The Dramatic Shape Voxel Mod for the voxel path (an **optional** dependency; the
flat-battle path runs without it).

## Install

1. Download `better_battle_ui-0.1.0.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it and enter a battle.

## Compatibility

- Mod API 2, engine `>=0.1.37 <2.0.0`. Pure `content` profile: link play is unaffected.
- Optional dependency on `DRAMATIC_SHAPE`; no known conflicts.

## Credits

By eduardocalafell. MIT licensed.
