# Hold B, walk faster

Gen 3 handed you running shoes in the first five minutes. Gen 1 made you
walk to Cerulean, beat a gym, and buy a bicycle voucher off a man in a
skyscraper.

`RUN SPEED` picks the multiplier: x1.5, x2, x3 or x4. `BOOST BIKE` and
`BOOST SURF` are off by default.

## The numbers

A step is a frame count and lower is faster. The engine walks you at 16
frames a tile and rides the bicycle at 8, which is where "the bicycle
doubles walking speed" comes from — it is exact.

| Setting | Frames | Tiles/sec |
| --- | ---: | ---: |
| walking | 16 | 3.75 |
| x1.5 | 11 | 5.45 |
| x2 | 8 | 7.5 |
| x3 | 5 | 12 |
| x4 | 4 | 15 |

At x2 your shoes *are* the bicycle — the same integer, not "about as fast
as". You have matched a vehicle that costs a gym badge and an errand for a
man on the eleventh floor, and the bicycle's remaining advantage is that it
does not ask you to hold a button.

The ladder stops at x4 because steps are whole frames. One rung further is
3, then 2, then 1 — and at 1 frame a tile passes in a sixtieth of a second,
which is 60 tiles a second, which is not running.

## What it does not do

There is no sprint animation: Gen 1 has no running frames, because in 1996
nobody had thought of it. The legs keep the walking cadence and simply spend
less time per tile.

Nothing but the duration of a step changes. Collision, encounters, triggers,
ledges and warps are untouched, so grass is no safer for having been crossed
quickly. It rides the engine's own `movement.speed` hook — whose comment
names running shoes as the reason it exists — calls the next handler first
and multiplies its answer, so a mod that slows you in a swamp keeps its say.
It declares no permissions at all.

**On Gold.** RUN SPEED, BOOST BIKE, BOOST SURF and SAFE GRASS all work: Gold raises the same movement.speed hook with the same keys, and it rebuilds the step duration every step, so a scripted cutscene can never inherit a running step the way it can on Gen 1. CUT GRASS and RUN FX are Gen 1 only and switch themselves off on Gold -- the cut needs a table with no Gen 2 home, and the trail is measured from the Gen 1 world canvas.
