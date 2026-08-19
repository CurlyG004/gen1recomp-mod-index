# Shedinja Expanded Bridge

This is a **Gold-only** compatibility add-on for players who want to enable both [Shedinja](https://github.com/inmento/Gen1-Shedinja) and [Expanded Species](https://github.com/mistermiracle3036/Expanded-Species).

> Install all three mods in Gold: **Expanded Species**, **Shedinja**, and this bridge. The bridge’s manifest requires both underlying mods, so it cannot be activated accidentally on its own.

Core Shedinja remains standalone in Red, Blue, Yellow, and Gold. The bridge is only for the specific Gold configuration where Expanded Species is also active.

## What it does

Expanded Species normally assigns custom species sequential virtual slots beginning at #252. The bridge recognizes the active Shedinja record, then reserves both its Gold runtime slot and its displayed National Dex identity at **#292** after framework setup. It also restores Shedinja’s normal/shiny palette and party icon, and supplies a sparse National Dex ordering wrapper so #292 remains visible in Gold’s OLD list.

| Behavior | Result |
|---|---|
| Expanded Species absent | Use core Shedinja alone; no bridge is needed. |
| Expanded Species and bridge active | Shedinja remains visible and virtual **#292** in Gold. |
| Another active species already uses #292 | The bridge refuses the unsafe collision rather than silently sharing an index. |

The bridge contains no art files. Core Shedinja retains responsibility for sprite attribution and included credits.
