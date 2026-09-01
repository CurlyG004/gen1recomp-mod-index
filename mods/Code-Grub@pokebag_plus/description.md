# PokéBag+

Splits the bag into four pockets -- ITEMS, BALLS, KEY ITEMS and TM/HM --
paged with Left and Right from anywhere in the list. The bag reopens on
whichever pocket you used last, in battle as well as in the field.

It is the faithful one. There are already pocket mods that modernise the
bag with more slots, invented categories and automatic sorting; this takes
the opposite position on every one of those. Four pockets, because that is
what Gen 2 shipped. The vanilla 20 slot limit by default. Acquisition order
untouched, and SELECT still picks an item up and puts it down, now confined
to the pocket you are in. Nothing sorts itself.

## What changes

- Four pockets instead of one flat list, paged with Left and Right.
- SELECT reorders within the current pocket, the way vanilla's bag does.
- The battle bag is the same four pockets, so there is one thing to learn
  rather than two.
- The pocket header is drawn as a window sharing its borders with the bag
  window below it, in the game's own frame style.

## What does not change

The save. Pockets are a view over the item list the game already keeps, so
this adds no save field and changes no format. Uninstalling leaves the flat
vanilla bag exactly as it was. Pocket and cursor position live in memory
only and reset when the game restarts.

## Options

`BAG SLOTS` is 20 by default, the vanilla limit. Setting it to 999 lifts the
cap on how many distinct items the bag holds.

## Limits

- Raising the slot limit above 20 makes `.sav` export lossy. The Game Boy
  bag format holds 20 entries, so converting a save keeps the first 20 in
  acquisition order and drops the rest. At the default setting this cannot
  happen.
- The 99 per-stack cap is the engine's and is unchanged. The option controls
  how many distinct items fit, not how many of each.
- 999 is effectively unlimited rather than literal: vanilla has 144 non-badge
  items, so that is the real ceiling until a content mod adds more.
- It claims the `BagMenu` screen, so it conflicts with other mods that
  replace the bag.

MIT licensed.
