# Traducción Española

Plays Gen 1 in Spanish using the translation Nintendo already wrote. The mod
decodes the official EUR script and art out of **your own** Spanish Red/Blue
cartridge dump at load time — it ships addresses and hand-written engine text,
never a byte of Nintendo's content.

**El juego en español desde tu propio cartucho.** Diálogos, nombres de
movimientos, objetos y clases de entrenador salen directamente de tu copia de
*Pokémon Edición Roja/Azul* (2.585 líneas de guion oficial). Los textos propios
del motor (mensajes de combate, menús, opciones, cajas del PC, juego por cable,
gestor de mods) están traducidos a mano — 557 líneas.

## What it changes

- All dialogue, move/item/species/trainer names: decoded from your EUR cartridge.
- Engine-authored UI text: fully hand-translated (`lang/strings.lua`).
- Accented characters, the ":N" level tag, the "PS" HP label and the
  "Edición Roja" title ribbon are decoded from the cartridge at load time —
  pixel-identical to Spanish hardware, with no art shipped in the mod.
- Pure content/LANGUAGE mod: no gameplay, balance or link-play changes.

## How to install

1. Install the mod: **MODS > Import mod .zip** (or the Update button once it is
   in the index).
2. Import your US Red or Blue ROM as usual (the base game data).
3. Copy your Spanish EUR dump (`Pokemon - Edicion Roja` or `Edicion Azul`,
   `.gb`/`.gbc`) into the `imports/` folder in the save directory — the same
   folder ROM imports already use.
4. Enable **Traducción Española** in the mod manager and restart.

Without an EUR dump the hand-translated engine text still applies; the
cartridge layer simply stays off.

## Credits

- Mod by jherediagu.
- Script addresses and charmap derived from the
  [einstein95/pokered-es](https://github.com/einstein95/pokered-es)
  shift-matching disassembly (addresses only — no text or art redistributed).
- Original Spanish translation © Nintendo, read from the player's own cartridge.
