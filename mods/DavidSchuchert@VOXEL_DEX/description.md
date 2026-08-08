# Voxel 3D Pokedex

Opening a Pokedex entry no longer shows the flat white page. The Pokedex
itself appears as a voxel clamshell device: it rises into frame closed,
folds open over its hinge, the display inside lights up with the entry
data, and the Pokemon stands on the stage in the base as a real Pokemon
Stadium 3D model, idling and slowly turning.

## What it changes

- The `DexEntryMenu` screen (DATA on a dex entry) becomes a full 3D scene
  rendered at window resolution
- The display shows number, name, kind, height/weight and the dex text --
  with the original owned/seen gating intact
- Up/Down scroll the description, Left/Right page through the Pokemon you
  have seen, A/B fold the device shut
- Everything else (the dex list, CRY, AREA) stays untouched

## Install

1. Download `VOXEL_DEX-1.0.0.zip` from the releases page.
2. In the launcher, MODS -> **Import mod .zip**.
3. Start the game. Toggle via the `3D POKeDEX` option on the mod's row.

## Requirements

- **Dramatic Shape Voxel Mod (DRAMATIC_SHAPE) 1.7.x** -- a hard
  dependency. This mod ships none of that mod's code; it loads the voxel
  renderer and Stadium-model reader at runtime from your installed copy.
- For the 3D models, build DRAMATIC_SHAPE's Stadium pack once from your
  own Pokemon Stadium (US) 1.0 ROM (its STADIUM ROM option). Without the
  pack, entries still open in 3D with the battle pic stood up on the
  stage; without a 3D-capable driver, the classic 2D page returns.

No ROM-derived content is distributed. Original code is MIT licensed.
