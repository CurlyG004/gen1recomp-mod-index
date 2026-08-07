# Player Sprite Flip

Horizontally flips your **active Pokemon's sprite** in the Dramatic Shape Voxel
Mod's overworld battles, so it faces the other way.

## What it changes

- Flips **only your active Pokemon's** battle sprite in the voxel overworld
  battle — never the foe, never the intro trainer sprite.
- Only while your Pokemon is standing on the map. Dramatic Shape's **BACK
  SPRITES** mode (mon flat on the menu) and every non-voxel battle are left
  untouched.
- One option, **FLIP MY POKEMON** (ON / OFF); OFF is Dramatic Shape's default.

It borrows Dramatic Shape's exported `OverworldBattle` module and wraps the
function that hands each Pokemon's pic to the billboard, returning a mirrored
copy of the player-side texture. Nothing distributed is ROM-derived — it mirrors
the pic the engine already drew.

## Requires

The [Dramatic Shape Voxel Mod](https://github.com/DramaticShape/DramaticShapeVoxelMod).
This is an independent companion mod; with Dramatic Shape absent it loads and
quietly does nothing. Not affiliated with Dramatic Shape.

## Install

1. Download `player_sprite_flip-0.1.0.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it (with Dramatic Shape enabled) and enter a voxel battle.

## Compatibility

- Mod API 2, engine `>=0.1.37 <2.0.0`.
- Pure `content` profile: link play is unaffected.
- No known conflicts.

## Credits

By eduardocalafell. MIT licensed.
