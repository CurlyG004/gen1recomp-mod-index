# Kanto Battle Royale

Last trainer standing, played across the whole of Kanto. Up to eight players
share a lobby, and the rest of the field is filled with bots so a match always
starts.

## How a match runs

Everyone begins in the **SAFARI ZONE** with 30 SAFARI BALLs and two minutes.
There is no starter — whatever you catch is your team, and if the buzzer goes
with an empty party you are out before the match proper begins.

When the PA calls time you walk to the gate and pick the town you drop into.
From there it is Kanto as you know it: gyms, shops, the Pokémon Center, wild
grass. Walk into another trainer's line of sight and the battle starts on its
own — no menu, no consent. A whiteout puts you out for good, and your bag
spills onto the ground where you fell for whoever gets there first.

Then the fog closes. It sweeps in on the Town Map toward a shrinking ring,
taking maps out of play as it goes, until the survivors are pushed into the
same few routes and one trainer is left.

## Playing it

**SOLO VS BOTS** needs nothing but the mod. Multiplayer runs over a small relay
server; the default points at a hosted one, so a room code is all you and your
friends need. You can point it at your own relay instead — the server is in
`relay/`, it is about 500 lines of Node, and it stores nothing.

Everyone in a match needs the same engine release and the same mod version. The
link handshake compares them exactly and refuses a mismatch, which is a real
constraint rather than a suggestion — [COMPATIBILITY.md](https://github.com/campavao/kanto-battle-royale/blob/main/COMPATIBILITY.md)
explains what has to line up and why.

## Installing

Import `battle_royale-<version>.zip` from the in-game Mod Manager
(MODS > Import mod .zip), enable it, and grant the network permission when
asked. Updates are offered in-game from then on.

Full details, options and the changelog:
[README](https://github.com/campavao/kanto-battle-royale#readme) and
[releases](https://github.com/campavao/kanto-battle-royale/releases).
