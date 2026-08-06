# Damage Numbers

Floating, RPG-style damage numbers in battle. When a move connects, the amount
of HP it removed pops up over the target and drifts upward as it fades.

## What it changes

- Draws the damage dealt over the Pokémon that got hit — enemy hits appear over
  the enemy sprite, your hits over your own.
- Critical hits are shown in gold.
- Multi-hit moves (Double Kick, Fury Attack, …) spread their numbers out so each
  hit stays readable.
- Adds nothing to the save and touches no battle logic — it only reads the
  engine's `battle.damage_dealt` event and draws through the `battle.overlay`
  hook.

## Install

1. Download `damage_numbers-0.1.0.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it and jump into any battle.

With `github` set in the manifest, the launcher's **Update** and **Versions**
buttons take over from here.

## Options

- **DAMAGE NUMBERS**: ON / OFF
- **CRIT COLOR**: GOLD / WHITE

## Compatibility

- Mod API 2, engine `>=0.1.37`.
- Pure `content` profile: link play is unaffected.
- No known conflicts.

## Known limitations (v0.1.0)

- Shows move damage only; passive damage (poison, burn, recoil, confusion
  self-hit) isn't shown yet.
- Positions are tuned for the standard battle layout.

## Credits

Made by eduardocalafell. MIT licensed.
