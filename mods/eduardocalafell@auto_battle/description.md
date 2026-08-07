# Auto Battle

Let the game fight for you. When **Auto Battle** is on, your move is chosen each
turn instead of the FIGHT menu opening — and a small on-screen badge shows it's
active.

## Features

- **Smart move picking.** Scores every usable move by
  `power × type-effectiveness × STAB` against the current foe and uses the best
  one. When nothing lands effectively (only status moves, or the foe is immune),
  it falls back to the game's own NPC move picker.
- **Skip dialogs (optional).** Fast-forwards battle text so turns fly by — while
  never auto-confirming YES/NO prompts, move-learning, evolution, or the
  party/bag menus.
- **Stay in control.** A short takeover window lets you nudge the D-pad to open
  the menu yourself that turn: switch, use an item, run, or catch.
- **Clear UI.** `AUTO` / `SKIP` tags in the corner show what's on, plus the name
  of the move it just used.

## Options

- **AUTO BATTLE** — ON / OFF (default OFF)
- **TAKEOVER WINDOW** — INSTANT / FAST / RELAXED
- **SKIP DIALOGS** — ON / OFF (default OFF)

For the fastest battles, pair both toggles with battle animations turned off in
the game options.

MIT licensed. You supply your own ROM; nothing ROM-derived is included.
