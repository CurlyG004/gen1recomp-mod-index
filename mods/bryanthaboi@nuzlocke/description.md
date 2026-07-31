# Nuzlocke

An enforced Gen 1 Nuzlocke. The rules are not a promise you make to yourself —
the mod holds you to them.

## The rules it enforces

- **One catch per area.** The first encounter is the only one.
- **No duplicate evolutionary families**, optionally skipped rather than
  burning the area's encounter.
- **Mandatory nicknames** for starters, gifts and catches.
- **Permanent death.** A fainted party member says that it died and is removed
  immediately.
- **A real ending.** If the last party member dies, the game runs the credits
  to THE END and deletes the active save.

## Setup

Oak asks the questions at Slow Start: whether duplicate evolutionary families
skip or consume an area's encounter, and whether Safari maps count as separate
areas.

## Install

1. Download `nuzlocke-1.0.1.zip` from the
   [releases page](https://github.com/bryanthaboi/nuzlocke/releases).
2. In the launcher: MODS → **Import mod .zip**.
3. Enable it and start a new game — the ruleset keys off Slow Start.

The manifest sets `"github": "bryanthaboi/nuzlocke"`, so the launcher's
**Update** and **Versions** buttons handle it from there.

## Compatibility

- Mod API 2, engine `>=0.0.0-dev <1.0.0`.
- `content` profile, so link play is unaffected.
- Declares the `engine_internals` permission: it patches battle and party
  handling to make death stick.
- Loads late (`priority: 100`) so it sees other mods' party changes.
