# Modern Dialogue Boxes

Rounded, soft-shadowed dialogue and menu boxes with colour themes, subtle
patterns, size presets, translucency and a speaker-name header — while keeping
the game's own text and typewriter exactly as they are.

![Themes](https://raw.githubusercontent.com/eduardocalafell/gen1recomp-modern-dialog/main/preview-themes.png)

## What it changes

- A rounded panel with a soft drop shadow replaces the Game Boy tile border on
  every framed box — dialogue, the START menu, shops, YES/NO, and so on. The
  interior stays light so the black GB-font text is always readable.
- **7 themes:** SLATE, FOREST, OCEAN, SUNSET, BERRY, MONO, and **NIGHT** — a
  true dark theme (the black GB font is recoloured light through a shader so it
  reads on the dark panel).
- **6 patterns:** NONE, DOTS, GRID, CHECKER, WAVES, SCALES — faint procedural
  textures.
- **TRANSLUCENT** toggle, **SIZE** presets (CLASSIC / TALL / TOP), a
  **SPEAKER NAME** header (parsed from a leading `NAME:` in the text), and a
  **RESTYLE** scope (all menus, or just the dialogue box).

Themes and patterns are **original** — drawn procedurally, no ripped art.

## How it works

Wraps `Font.drawBox` (the shared box primitive) read-only, and only while a
`TextBox` / `Menu` / `ChoiceBox` / `ListMenu` is drawing — so sprite pic-boxes,
the overworld portrait box and battle boxes stay vanilla. Dialogue geometry
comes from `Theme.textBox`; the text re-wraps to the size preset.

## Install

1. Download `modern_dialog-0.1.0.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it and open any dialogue or menu. Options live under MODS →
   Modern Dialogue Boxes.

> This mod patches the render layer, so when you **update** it, fully restart the
> game (not just re-import) for the new version to take effect.

## Compatibility

- Mod API 2, engine `>=0.1.37`, `content` profile (link play unaffected).
- Best in the standard renderer; in the 3D voxel mode the UI is composited
  differently, so results can vary.

## Credits

Made by eduardocalafell. MIT licensed.
