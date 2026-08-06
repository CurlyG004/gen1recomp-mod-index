# Damage Numbers

Floating, RPG-style damage numbers in battle — in the game's own font, and
**colour-coded by what caused the damage**. When something takes damage, the
amount pops up over that Pokémon and drifts upward as it fades, timed to when
its HP bar actually drains (so it lands after the animation, not before).

## What it changes

- Draws damage over the Pokémon that got hit — enemy hits over the enemy sprite,
  your hits over your own.
- **Colour-coded by cause:**
  - move damage — white box
  - critical hit — gold frame
  - recoil — red
  - poison — purple
  - burn — orange
  - leech seed — green
  - other self-damage (confusion, trap/crash) — grey
  - **healing — green "+N"** (Recover/Rest, Absorb-style drains, the leech-seed
    heal on the seeder)
- Poison + leech on the same Pokémon show as **two separate numbers**.
- Multi-hit moves (Double Kick, Fury Attack, …) show each hit.
- Reads the engine's `battle.damage_dealt` event and the visible HP-bar drain;
  wraps `applyDamage` read-only for recoil/confusion/trap. No battle-logic
  changes, nothing added to the save.

## Install

1. Download the newest `damage_numbers-*.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it and jump into any battle.

With `github` set in the manifest, the launcher's **Update** and **Versions**
buttons take over from here.

## Options

- **DAMAGE NUMBERS**: ON / OFF
- **NUMBER SIZE**: 1X / 2X
- **STATUS & RECOIL**: ON / OFF — the colour-coded poison/burn/leech/recoil
  numbers (move damage always shows)

## Compatibility

- Mod API 2, engine `>=0.1.37`.
- Pure `content` profile: link play is unaffected.
- No known conflicts.

## Credits

Made by eduardocalafell. MIT licensed.
