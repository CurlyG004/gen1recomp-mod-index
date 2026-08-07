# Dramatic Sky Ride

Dramatic Sky Ride adds controllable Pokémon mounts to Gen1Recomp, with dedicated systems for flying, terrestrial riding and visible Surf mounts. It is designed to integrate with Dramatic Shape Voxel Mod while preserving the game's native map interactions, encounters and field logic.

## Features

- Flying mounts including Charizard, Pidgeot, Fearow, Golbat, Aerodactyl, Articuno, Zapdos, Moltres, Dragonair and Dragonite.
- Ground Ride mounts including Arcanine, Rapidash, Dodrio, Rhyhorn, Rhydon, Kangaskhan, Tauros and Snorlax.
- Visible Surf mounts for Blastoise, Tentacruel, Gyarados and Lapras.
- Species-aware acceleration, speed, gallop strength, stamina and rider positioning.
- Pokédex-proportional mount sizing with per-species size controls.
- Safe battle and connected-map restoration for mounted states.
- Native NPC, sign, collision, encounter and field-action behavior retained wherever possible.
- Keyboard and controller shortcuts for ground riding and flight.

## Requirements

- Gen1Recomp with Mod API 2 support, compatible with `>=0.1.69 <2.0.0`.
- Dramatic Shape Voxel Mod `>=1.7.0 <2.0.0`.
- A compatible PokePC follower-sprite provider is recommended for the mount visuals expected by the mod.

## Controls

- Ground Ride: `G` or `SELECT + L1`.
- Flight / takeoff: `F` or `SELECT + R1`.
- Boost / gallop: the configured in-game `B` action.
- Ascend / descend in flight: `Page Up` / `Page Down` or `R2` / `L2`.

This is currently a prerelease build. The Mod Index entry is intentionally pinned to its direct release ZIP instead of using automatic GitHub version checks because the current Gen1Recomp updater reduces prerelease tags to their three-part base version.
