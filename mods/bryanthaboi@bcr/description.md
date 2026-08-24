# Bois Club Randomizer

BCR rerolls Red and Blue from a single seed taken from your player name and the
clock at the moment you start a new game. The seed is written into the save the
first time it is minted and never recomputed, so the world you are given on day
one is the world you get back every time you load.

## What it changes

- **Wild encounters.** Every grass and water slot gets a new species. Levels are
  never touched, so Route 1 is still level 3 to 5 and Victory Road is still
  Victory Road.
- **Ground items.** The Poke Balls lying around the world are shuffled among
  themselves. Key items stay where they are, so nothing needed to finish the
  game can vanish into a shop-only pool.
- **Shop stock.** Every mart is restocked from the vanilla mart catalogue at its
  usual size, always with a ball in the first slot and a heal in the second.
- **Wild movesets.** Wild Pokemon draw a fresh legal moveset, with as many moves
  as that species would have had at that level. Trainers, gift Pokemon and the
  legendaries keep their vanilla moves.
- **Starters.** All three of Oak's choices become something else, and always
  three different species.
- **Warps.** Every door outside Pallet Town is repaired to a new partner. Links
  are preserved in both directions: if a house now leads to the Diglett Cave
  entrance, walking back out of that entrance returns you to the house.
- **Map music.** Every map outside Pallet Town gets another track from the set
  the game already uses for maps.

## Warps, and what they guarantee

Doors are matched into pairs rather than having their destinations shuffled
independently, which is what keeps every trip two-way. The pairing is also grown
outward from Pallet Town's own region, so a seed never seals a group of rooms
off from the rest of the world: sampled seeds reach the same 220 maps vanilla
does.

The Safari Zone, the lifts in Celadon Mart, Rocket Hideout and Silph Co., the
Elite Four rooms and the Vermilion dock are left alone. Those doors carry
scripts that assume you arrived through them, and randomizing them produces
broken states rather than interesting ones.

## Take notes

Nothing labels where a door now goes. That is the game.

## The honest caveat

Paired doors mean you can never be sealed into a room, but there is no item
logic. A seed can put Surf, Strength or the Card Key behind a door that needs
the thing itself. That is an unfinishable seed, not a bug: start a new one.

Fully random wild movesets are not filtered by level either, so a level 3 Weedle
can open with Hyper Beam. That is the single biggest difficulty swing here.
