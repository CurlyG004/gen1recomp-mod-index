# RBY MMO

Play Kanto with friends. One player hosts from inside the game — or anyone
runs the bundled dedicated hub — and everyone connected shares the overworld:
you see each other walk and run, nicknames and chat bubbles float over heads,
and trades and battles can be requested from anywhere in the world.

![Co-op 2-on-2 battle](https://raw.githubusercontent.com/alamops/RBYMMOMod/main/docs/screenshots/coop-battle.png)

## What you get

- **Shared overworld presence.** Other players walk your map as real runtime
  NPCs — walking, running, biking, surfing, mid-step — with their nickname
  over their head.
- **Chat.** Global, nearby, party and private scopes, composed on the naming
  grid, with speech bubbles in the overworld and a scrollback log.
- **Parties of two.** Walk up, press A, invite. Your partner is marked on the
  TOWN MAP at the city they are in, the members list carries both trainer
  cards, and party chat reaches them anywhere.
- **Co-op 2-on-2 battles.** Walk into a trainer while partied and wait for
  your friend to join the fight — a real four-monster field with the engine's
  own damage, types, crits, status and move effects underneath. A PARTY
  BATTLE row puts two whole parties against each other.
- **Trade and battle from anywhere**, run by the engine's own link code over
  the hub — the link surface stays byte-identical (`affects_link: false`), so
  fingerprints don't move.
- **Ranked PVP.** Every link battle is scored by the hub on an Elo curve,
  with a top-ten RANK board and the score on every trainer card.
- **Two original characters**, NIRE and NIRE HOOD (art by
  [Mirasein](https://www.mirasein.me)), selectable alongside the ROM's cast —
  wearing one also changes your battle back pic, trainer card and Oak intro.
- **Hold-B running** on foot at bike speed, visible to other players too.

![Two parties on one map](https://raw.githubusercontent.com/alamops/RBYMMOMod/main/docs/screenshots/two-parties.png)

## Hosting

- **In-game:** MMO → HOST GAME picks a player limit (2–64) and runs the relay
  inside your copy. No NAT traversal — forward port 7788 for players outside
  your LAN.
- **Dedicated:** `server/hub.js` ships in the archive — plain Node with no
  dependencies, plus a Dockerfile and compose file — so a party can outlive
  any single player's session.

The hub relays presence, chat and sessions; it never simulates a battle.
There are no accounts or moderation — host for people you know.

## Install

1. Download `rby_mmo-<version>.zip` from the
   [releases page](https://github.com/alamops/RBYMMOMod/releases).
2. In the launcher: MODS → **Import mod .zip**.
3. Enable it (it ships flagged `experimental` on purpose), then MMO appears
   on the START menu above SAVE.

The manifest sets `"github": "alamops/RBYMMOMod"`, so the launcher's update
check and this index track new releases automatically.

More screenshots and the full list of known quirks live in the
[repository README](https://github.com/alamops/RBYMMOMod#readme).
