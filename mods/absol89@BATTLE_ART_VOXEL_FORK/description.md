# Battle Art Voxel Fork

A fork of [TeJota1337's Dramatic Shape Voxel Mod](https://github.com/TeJota1337/DramaticShapeVoxelMod),
maintained by absol89 under its own mod id (`BATTLE_ART_VOXEL_FORK`) so the two
can be installed and updated independently. Everything the upstream mod does —
the extruded voxel overworld, depth-buffered occlusion, cast shadows, the
tilt-shift miniature pass, and battles drawn over the map itself instead of a
white field — is still here. What the fork adds is aimed at the battle screen.

## What the fork adds

- **Animated back sprites and trainer sprites.** Selectable sprite generation
  for both the front and back slots, in animated or static modes, including
  Gen 1 Yellow front and back sprites.
- **Sprite fallback.** Two options that hand the sprite slots back to whatever
  other sprite-modifying mod you have installed — e.g.
  [crystal_animated_sprites_with_shiny_visuals](https://github.com/TheRhysWyrill/crystal_animated_sprites_with_shiny_visuals)
  — instead of overriding them. With no such mod installed you get ROM sprites,
  which still lets you run animated player intros and a static back sprite on
  Red and Blue.
- **Battle UI consistency.** A `HUD SCALING` option (`OG` / `SCALED`, where `OG`
  is the one to use alongside UI mods like an experience bar), battle text boxes
  drawn on an opaque white backplate with black text like the original games,
  and `BATTLE BG` forced to white so the arena has no black bars.
- **iOS compatibility patch** for the transparent player and opponent HUDs.

Declares `affects_link: false`: presentational only, link play is unaffected.

## Install

1. Download `BATTLE_ART_VOXEL_FORK-1.7.6.zip` from the
   [releases page](https://github.com/absol89/DramaticShapeVoxelMod/releases).
2. In the launcher: MODS → **Import mod .zip**.

With `"github": "absol89/DramaticShapeVoxelMod"` set, the launcher's **Update**
and **Versions** buttons handle new releases from there.

## Notes

- The mod id and install folder changed to `BATTLE_ART_VOXEL_FORK` as of 1.7.2.
  Compatibility patches written against the old `DRAMATIC_SHAPE` id — Kanto in
  First Person, for one — may need updating before they line up again.
- Tested by the author on Windows against gen1recomp v0.1.75.
