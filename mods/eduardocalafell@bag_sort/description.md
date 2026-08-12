# Bag Sort

Sort your bag with one button. Open the bag and press **START** to cycle through
sort orders; the current order shows at the top-right.

## Sort orders

- **NAME** — alphabetical
- **QTY** — most of an item first
- **TYPE** — grouped: Poké Balls → HP medicine → stones → other → TMs → HMs →
  key items (alphabetical within each group)
- **RECENT** — most recently obtained first
- **OLDEST** — original acquisition order (the game's default)

The sort is **persistent** — it reorders the real bag order (`save.bagOrder`),
exactly like the game's own SELECT swap, so it sticks across sessions. Newly
obtained items land at the end until you sort again. Works both in the field and
in battle.

## Install

1. Download `bag_sort-0.1.0.zip` from the releases page.
2. In the launcher, MODS → **Import mod .zip**.
3. Enable it, open the bag, and press START.

## How it works

- The bag list is built from `Bag.order(save)` — an array of item ids. Sorting
  reorders that array in place.
- The mod wraps `BagMenu.new` read-only to attach a START handler + indicator to
  the `ListMenu` it returns (`ListMenu:update` leaves START unused).
- RECENT/OLDEST use an acquisition index recorded per item id in the mod's save.

## Compatibility

- Mod API 2, engine `>=0.1.37`, `content` profile (link play unaffected).
- Touches only the bag UI; no conflicts expected.

## Credits

Made by eduardocalafell. MIT licensed.
