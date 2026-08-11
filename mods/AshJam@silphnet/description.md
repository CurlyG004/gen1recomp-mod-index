# SilphNet

A multiplayer presence mod for Pokémon Gen 1 Recomp. Log in with a name
and password, get a unique 5-digit Trainer ID, and add friends entirely
in-game by entering their Trainer ID on a D-pad digit spinner - no typing,
no web page.

## What it does

Every ~30 seconds while you're in the overworld, SilphNet reports your
current map and tile to a small web API and fetches your friends' last-
known positions back. A friend on your current map shows up as a static,
non-animated marker at their last-known tile; the friends list shows
everyone's last-known map, tile, how long ago, and whether they're likely
still online.

There's no live, real-time movement by design - this is a "last seen"
snapshot, closer to a messaging app than a live multiplayer overworld.
That trade-off means no persistent server process, no VPS, and no need to
leave a home PC running 24/7 - just a lightweight PHP + MySQL backend
that's already running.

## Data usage

Negligible - each 30-second cycle is under 2KB, roughly 200-250KB an hour
of continuous play. Safe to leave running on mobile data.

## Installing

Import `silphnet-<version>.zip` from the in-game Mod Manager (MODS >
Import mod .zip), enable it, and grant the network permission when asked.
Full setup and controls: see the [README](https://github.com/AshJamB/SilphNet#readme).
