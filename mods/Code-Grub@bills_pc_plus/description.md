# Bill's PC Plus

Bill's PC+ replaces the built-in PC box screen with a grid interface. Browse
and rearrange your boxes freely — the PC never writes your save at all, so
nothing interrupts you and nothing is decided for you.

## Features

- **Free box paging** — walk the cursor off the left or right edge of the grid
  to page between boxes. No prompt, no save, no interruption.
- **Grab-and-place, with gaps** — pick a Pokemon up with `A`, drop it on any
  cell. Swap if the slot is occupied, place if it is free, and the rest stay
  exactly where they were. Cross-box moves just work.
- **Inline art and stats panel** — the selected Pokemon's front sprite and
  condensed stats (level, HP, ATK/DEF/SPD/SPC) sit beside the grid, and keep
  describing the Pokemon in hand while you carry it. The strip also shows the
  focused mon's types, a status condition if it carries one, its DV spread, and
  a `*` mark when those DVs are the shiny spread.
- **Deposit view** — your party appears as a row under the box; pick one and
  page the destination box independently.
- **The PC never writes your save** — not when you page, not when you move a
  Pokemon, not on the way out. Whatever you did rides along with your next
  ordinary save, so saving stays where you chose to put it: the START menu.
  The flip side is real — quit without saving and the PC visit goes with
  everything else you did since.
- **Readable cursor** — blinking corner marks on the selected cell, holding
  steady over a carry's landing spot, readable on empty slots. The grid also
  remembers where you left it when you step out to the menu and come back.
- **Stays Gen 1** — everything is drawn from the game itself: the same font,
  window borders, palette and sound effects as the vanilla PC, so the grid
  reads like something the Game Boy could have shipped.

## Install

**Mod manager:** grab the release zip from
[Releases](https://github.com/Code-Grub/bills-pc-plus/releases) and import it —
FIND MODS in the launcher, or drop the zip into the save directory's
`imports/mods/` folder and rescan.

**Manual:** unzip the release into the game's `mods/bills_pc_plus/` directory.
It claims the `BoxMenu` screen id, so it replaces the built-in PC box screen
with no further configuration.

## Controls

Opening the PC shows a menu:

| Row | Action |
|---|---|
| WITHDRAW POKéMON | Opens the box grid |
| DEPOSIT POKéMON | Opens the box grid with your party shown as a row |
| SEE YA! | Leaves the PC |

`B` from either grid returns to this menu, so switching between withdrawing
and depositing is `B` then pick.

### Box view (WITHDRAW)

| Input | Action |
|---|---|
| D-pad | Move the cursor within the grid; hold a direction to repeat |
| Left/Right at a grid edge | Page to the previous/next box, cursor wrapping to the opposite column |
| A on a Pokemon | Cursor menu: MOVE / WITHDRAW / STATS / RELEASE / CANCEL |
| A while carrying | Drop: swap if the slot is occupied, place if it is free |
| B | Cancel carry; if not carrying, back to the menu |

### Deposit view (DEPOSIT)

| Input | Action |
|---|---|
| Left/Right | Move along the party row (what to deposit) |
| Up/Down | Page the destination box (where to put it) |
| A | Deposit the highlighted Pokemon into the box's first free cell |
| B | Back to the menu |

## Known limitations

- **Gaps are a display layer, not cartridge data.** The Gen 1 save format
  stores a count byte followed by that many contiguous Pokemon — no hole
  encoding — so the layout rides in the engine save beside it. Exporting a
  .sav packs each box in reading order; importing one refills that box solid.
  A box the game changed outside the PC (a catch, a trade) fills its gaps from
  the left on the next visit.
- **The PC no longer writes, so it no longer protects you.** Vanilla wrote
  SRAM on every box change, which meant a deposit could not be lost. Here a
  deposit lives in memory like the rest of your progress until you save from
  the START menu. Any save the game makes carries the boxes correctly whenever
  it happens.
- `save.currentBox` follows the box you were last looking at, and persists with
  your next save whether or not you moved anything.
- If every cell of every box is full, cancelling a carry refuses with a message
  and the Pokemon stays in hand, rather than creating an over-capacity box.
