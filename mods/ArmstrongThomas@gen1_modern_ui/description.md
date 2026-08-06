The original menus were drawn for a 160x144 screen, and on anything larger the
game either scales that box up or leaves the rest of the window empty. This
mod repaints the supported screens in the window space you actually have, so a
portrait phone, a landscape tablet, a desktop window and an ultrawide display
each get a layout that fits them.

It is visual-first. The game keeps input, state transitions and callbacks; the
mod only paints. Keyboard and controller navigation stay vanilla because the
overlay never replaces a state or eats its input, and the classic canvases it
hides can be brought back with **HIDE ORIGINAL UI** if a screen looks wrong.

Covered so far: the title and Start menu, dialogue, Party, Bill's PC, the
Trainer Card, the Pokedex, the Bag, the Shop and the Player PC. Rows show the
things the classic layout had no room for — stats and moves, Trainer ID, BASE
and SELL values including TMs. Battle UI is still work in progress and off by
default.

Presentation options rather than gameplay ones:

- **Themes** — classic and modern, each in an opaque and a glass variant.
- **MINIMAL UI** — a presentation-only mode that sits closer to the original
  layout for players who want the readability without the restyle.
- **Sprite packs** — active replacement packs are used, with nearest-neighbour
  scaling so pixel art stays pixel art.

Two experiments ship default-off. **TOUCH / CLICK UI** lets supported rows and
dialogue cards accept a tap or a click, which is sent through the engine's
source-safe action facade so the owning state still runs its own validation,
sounds and callbacks. **DRAG UI PANELS** lets you move panels around; offsets
are normalized to the viewport and remembered per screen family, so a layout
you set up survives a resolution change. Hosts without the pointer hooks keep
the keyboard-and-controller behaviour.

Because it is an `overhaul` profile mod it reads live rows other mods append
rather than replacing them, and **START MOD MENUS** gathers those rows under a
single Start-menu entry — highlight one and press **SELECT** to pin it back out
to the top level, or turn grouping off for a flat list.

Needs gen1recomp v0.1.51 or newer; it stays compatible with the 1.x line and
does not require a patched binary or a custom engine checkout.
