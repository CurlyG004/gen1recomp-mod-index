When you open the party menu mid-battle, every living POKeMON gets a
one-letter grade against the foe standing on the field: **A** and **B** for
good picks, **D** and **E** for bad ones, and nothing at all for an average
matchup. A mon the foe's own types hit super effectively also gets a `!`, so
a glass cannon reads as `A!`.

The grade adds two halves of the type chart: the best damaging move the mon
carries against the foe, and how hard the foe's own types hit back. It reads
the foe's **current** types, so it follows a Transform or a Conversion, and
it reads the merged move registry, so a mod that re-types a move is scored
correctly rather than from a hardcoded table.

Three things it deliberately does not do:

- **It never reads the foe's move list.** The game knows those moves, you do
  not, and a marker that leaks them is a cheat rather than a convenience.
  Scoring the foe's visible types as STAB is the same guess a human makes.
- **It never grades a fainted mon.** The row already says `FNT`.
- **It never touches the party menu outside a battle.** The START menu, the
  bag's item and TM pickers and the link-battle copies all leave the battle
  reference nil, so the screen stays vanilla.

The pack also skips the "Do you want to give a nickname?" prompt on capture.
The PC's rename screen is untouched, so renaming later still works.

Letters rather than arrows because the Gen 1 font has no `<` and no `>`
glyph, and its only two triangles are already the party cursor and the swap
arrow. A letter needs no colour, survives a monochrome palette, is one glyph
wide, and ranks the six candidates, which is the decision the screen exists
for. The marker is hard-capped at two glyphs, the whole free space on a
party row, so it cannot cover a nickname, a level, a status or a bar.

Three toggles - `PARTY GRADES`, `DANGER FLAG` and `SKIP NICKNAME` - all on
by default and all read per call, so flipping one takes effect immediately
without a restart or even leaving the battle.
