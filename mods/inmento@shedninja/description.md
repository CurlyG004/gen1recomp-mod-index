# Shedinja

**Shedinja** is a standalone Gen1Recomp species expansion for **Pokémon Red, Blue, Yellow, and Gold**. It adds Bug/Ghost Shedinja as **National Dex #292** with base HP 1, generation-specific Wonder Guard behavior, native wild encounters, and game-appropriate credited battle art.

| Game | Internal slot | Included art and behavior |
|---|---:|---|
| Red / Blue / Yellow | 152 standalone; 252 with Crystal 251 | Transparent Gen 1-style front/back sprites, unused Gen 1 `$43` cry, and a persistent Bag-token Wonder Guard rule. |
| Gold | 252 | Three-frame Crystal-style front animation, static back art, normal/shiny palettes, a two-page Dex entry, and held-item Wonder Guard. |

Gold’s `WONDER GUARD` is a non-usable normal Bag item so it can be equipped through the game’s ordinary **GIVE** action. It protects only the player’s active Shedinja while that Shedinja is actually holding the item. In Red/Blue/Yellow, the token stays in the Bag instead because that generation has no held-item system. In either game, the rule blocks only direct non-super-effective move damage; it never protects other Pokémon, an opposing Shedinja, status moves, or typeless self-damage such as confusion.

## Wild encounters

| Game | Locations | Chance | Level range |
|---|---|---:|---:|
| Red / Blue / Yellow | Route 1, Route 4, Victory Road | 5%, 7%, 10% | 3–5, 10–12, 36–38 |
| Gold | Route 29, Route 34, Victory Road | 5%, 7%, 10% | 3–5, 10–12, 36–38 |

> **Compatibility guidance:** The single **Shedinja Compatibility Bridge** supports both framework paths. With Crystal 251 in Red, Blue, or Yellow, it moves Shedinja to Crystal-safe index `252` and supplies Crystal runtime metadata. With Expanded Species in Gold, it preserves Shedinja’s framework-aware #292 identity and presentation. The bridge is inert without either framework. Kanto Reforged and unrelated roster/Dex/index-overhaul mods remain unsupported without their own dedicated compatibility bridge.

## Package migration

Current releases use the package and manifest ID **`shedninja`**. Retired releases used `gen1_shedinja`; remove that old package and install Shedinja 0.2.1 once so future launcher updates follow the current identity.

## Sprite artwork attribution

The Gen 1 sprites are adaptations of **“G1SP 0292 – Shedinja”** by **BouncingPiplup**, under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). The Gold front animation and back sprite are adapted from **“GSC Shedinja”** by **nuukiie** (Nuuk), used for non-commercial purposes with credit under the artist’s stated terms. See the repository’s `CREDITS.md` for complete source links and adaptation details.

[View the source repository](https://github.com/inmento/Gen1-Shedinja) or [download the current release](https://github.com/inmento/Gen1-Shedinja/releases/latest).
