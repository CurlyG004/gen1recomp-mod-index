# Mods Hotkeys

Detects the hotkeys other installed mods listen for — and the engine's own
built-in ones — and lets you rebind them from OPTIONS -> MODS HOTKEYS,
multi-button combos included (SELECT + A, TAB + LB).

## What it does

- Scans every enabled mod's Lua sources for the input idioms mods actually
  use: wrapped `keypressed` key checks (`key == "q"`), wrapped
  `gamepadpressed` button checks (`button == "leftshoulder"`), held
  pad-button combos (`held.back and held.leftshoulder`), GB-button combos
  (`wasPressed("select") and wasPressed("a")`), configurable GB-button
  triggers, and direct keyboard polls — each with an edge latch.
- Includes the engine's built-in hotkeys when the running build has them:
  game speed via the `1` key and the L2/R2 bumpers (SPEED UP / SPEED DOWN
  rows, rebound like any mod hotkey).
- Each distinct trigger becomes a row on one of two pages — OPTIONS -> PC
  HOTKEYS (keyboard triggers) and OPTIONS -> PAD HOTKEYS (controller
  triggers) — showing the current trigger (e.g. `Q`, `LB+BACK`, `R2`,
  `SELECT+A`).
- A rebinds a row: press your new combo (any mix of keyboard keys and pad
  buttons), release to set. Escape cancels. SELECT resets one row, START
  resets everything.
- Rebinds persist in options.lua, so they survive NEW GAME, CONTINUE and
  quitting.
- Mod names longer than the row's label window scroll as a ticker, so long
  names stay readable instead of bleeding over the box border.

## Install

1. Download `mods_hotkeys-0.1.10.zip` from the
   [releases page](https://github.com/ShaneMcGovernIE/mods_hotkeys/releases).
2. In the launcher: MODS → **Import mod .zip**.

With `"github": "ShaneMcGovernIE/mods_hotkeys"` set, the launcher's
**Update** and **Versions** buttons handle new releases from there.
