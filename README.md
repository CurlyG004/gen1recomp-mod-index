# gen1recomp mod index

A community index of mods and custom carts for the
[Gen 1 recomp engine](https://github.com/bryanthaboi/gen1recomp).
One folder per entry, holding metadata only — no mod code, no assets, and
certainly no ROM-derived content. The mods themselves live in their authors'
own repositories; this index just says where they are and what they need.

A **custom cart** is a version-pinned mod setup that plays as its own game: an
identity, a base game, a list of mods pinned to exact builds with their options
frozen, a load order, and a seal. Carts sit in `carts/` and ride the same CI and
the same feed as mods.

- **Submit a mod:** the [submission helper](https://bryanthaboi.github.io/gen1recomp-mod-index/)
  fills in the form for you and opens the pull request.
- **Submit a cart:** by hand for now. Copy
  [`examples/YourName@example_cart/`](examples/YourName@example_cart) into
  `carts/`. The helper only knows the mod form.
- **Consume the index:** `data/index.json`, published on every push and
  refreshed nightly (see [The feed](#the-feed)).
- **See one done:** [#1, adding Nuzlocke](https://github.com/bryanthaboi/gen1recomp-mod-index/pull/1)
  — three files, no build output, green CI. Copy its shape.

## Layout

```
mods/
  <Author>@<mod id>/
    meta.json          required — the entry itself
    description.md     required — long form, markdown
    thumbnail.png      optional — or thumbnail.jpg, 2 MB max

carts/
  <Author>@<cart id>/
    meta.json          required, same three files, same rules
    description.md     required
    thumbnail.png      optional, doubles as the label art preview
```

The folder's id half is the mod's `manifest.json` `id` (for a cart, the cart
bundle's `id`), so an index folder and an installed thing always name the same
thing. Nothing else may live in the folder: no subdirectories, no extra files.

## meta.json

Validated against [`schema/mod.schema.json`](schema/mod.schema.json). Most
fields mirror the engine's manifest (see the wiki's
[Manifest reference](https://github.com/bryanthaboi/gen1recomp/wiki/Reference-Manifest)),
so an entry is mostly a copy of what the mod already declares.

| Field | | Meaning |
|---|---|---|
| `id` | required | matches `manifest.json`'s `id` |
| `title` | required | display name |
| `author` | required | creator or maintainer |
| `version` | required | semver of the release this entry describes |
| `categories` | required | 1–4 of GAMEPLAY, CONTENT, BALANCE, ART, AUDIO, UI, QOL, TRANSLATION, TOTAL_CONVERSION, LIBRARY, TOOL, OTHER |
| `repo` | required | where the source lives |
| `github` | recommended | `owner/repo` — turns on version tracking, here and in the launcher |
| `downloadURL` | | direct link to an installable `.zip`; required when there is no `github` |
| `summary`, `tags`, `license` | | listing polish |
| `api`, `game_version`, `profile`, `affects_link`, `experimental`, `permissions`, `dependencies`, `conflicts` | | copied from the manifest so the index can warn before an install |
| `automatic_version_check`, `fixed_release_tag` | | follow the newest release, or pin one |

## carts/meta.json

Validated against [`schema/cart.schema.json`](schema/cart.schema.json). Same
draft, same id and repo shapes, same distribution and update rules as a mod
entry. A cart is a sibling of a mod listing, not a second feed.

`base`, `seal`, `mods` and `load_order` are the bundle's own `cart.json` names
and shapes, so a cart author pastes that file in and adds only the index fields
below it.

| Field | | Meaning |
|---|---|---|
| `id` | required | matches the cart bundle's `id` |
| `title` | required | display name on the shelf |
| `author` | required | who assembled the cart |
| `version` | required | semver of the bundle this entry describes |
| `base` | required | one of red, blue, yellow, gold, silver |
| `seal` | required | `sealed` (this list and nothing else) or `open` (the player may add more) |
| `repo` | required | where the cart bundle lives |
| `mods` | required | every mod the cart loads, each pinned to one exact build |
| `github` | recommended | `owner/repo`, same as a mod: turns on version tracking |
| `downloadURL` | | direct link to the cart `.zip`; required when there is no `github` |
| `shell` | | cart shell colour, `#RRGGBB` |
| `load_order` | | pinned ids, first loaded first; omit to load in the order `mods` lists |
| `summary`, `tags`, `license`, `game_version` | | listing polish, and the engine range the cart needs |
| `automatic_version_check`, `fixed_release_tag` | | follow the newest release, or pin one |

A row of `mods` is flat: `id`, `source`, that source's own fields, and optional
`options` holding the author's frozen option values. `source` is required and
names where that exact build is published. There is no third kind:

| `source` | The rest of the row |
|---|---|
| `"github"` | `repo` (`owner/repo`), `version` (semver of the release), `sha256` of the zip |
| `"gamebanana"` | `mod` (mod page id), `file` (the upload id), `md5` GameBanana reports for it |

A cart ships no code. CI reads the bundle and fails it on any `.lua` at all,
resolves every pin's release tag or GameBanana file, and compares a
GameBanana pin against the digest the cart froze.

## How updates are detected

The engine already knows how to update a mod from GitHub: set
`"github": "owner/repo"` in `manifest.json` and the launcher's MODS panel reads
that repo's Releases, picks `<id>-<version>.zip` (falling back to any `.zip`),
and offers **Update** and **Versions**. `modkit.py add-release-workflow`
publishes releases in exactly that shape.

This index follows the same rule from the other side. Nightly,
`scripts/build-index.mjs --releases` re-reads Releases for every entry with
`github` and `automatic_version_check`, using the same asset-picking order as
`src/mods/ModUpdate.lua`, and records the newest installable release in
`data/index.json`.

**So you do not open a pull request per version bump.** Tag a release in your
own repo and the index catches up within a day. Open a PR here only when the
listing itself changes — description, categories, thumbnail, a moved repo.

An entry without `github` is a fixed listing: the recorded `version` and
`downloadURL` are whatever the last pull request said.

## The feed

Read it over HTTP:

```
https://bryanthaboi.github.io/gen1recomp-mod-index/data/index.json
```

**Not out of a checkout or a raw.githubusercontent link.** `thumbnail` and
`description_url` are paths under `data/` that only exist in the published
site, and the copy in the repo is a build output that a scheduled job refreshes
rather than the live one.

`data/index.json` is the machine-readable index — one file, everything in it:

```jsonc
{
  "schema_version": 1,
  "generated_at": "2026-07-31T05:17:00.000Z",
  "count": 12,
  "cart_count": 2,
  "categories": ["GAMEPLAY", "..."],
  "base_games": ["red", "blue", "yellow", "gold", "silver"],
  "mods": [
    {
      "folder": "YourName@example_mod",
      "id": "example_mod",
      "title": "Example Mod",
      // ...every meta.json field...
      "thumbnail": "data/mods/YourName@example_mod/thumbnail.png",
      "description_url": "data/mods/YourName@example_mod/description.md",
      "latest": {
        "version": "1.2.0",
        "tag": "v1.2.0",
        "prerelease": false,
        "published_at": "2026-07-30T11:02:14Z",
        "zip": { "name": "example_mod-1.2.0.zip", "url": "https://…", "size": 48213 }
      },
      "update_check": "ok",
      "downloads": { "total": 1578, "recent": 388, "window_days": 30, "as_of": "2026-08-18T05:17:00.000Z" }
    }
  ],
  "carts": [
    {
      "folder": "YourName@example_cart",
      "id": "example_cart",
      "base": "red",
      "seal": "sealed",
      // ...every meta.json field, including the pinned mods array...
      "thumbnail": "data/carts/YourName@example_cart/thumbnail.png",
      "description_url": "data/carts/YourName@example_cart/description.md",
      "latest": { "version": "1.0.0", "zip": { "name": "example_cart-1.0.0.zip", "url": "https://…" } },
      "update_check": "ok",
      "downloads": null
    }
  ]
}
```

`latest.zip.url` is exactly what the launcher's **Import mod .zip** path
installs, which is what lets a future in-game browser list this index and
install straight from it. `update_check` is `ok`, `off`, `no installable
release`, or `error: …` — an entry whose upstream went away says so rather than
disappearing.

**`carts` arrived without a `schema_version` bump, and that was deliberate.**
The engine's reader (`src/mods/ModIndex.lua`) compares `schema_version` for
equality and refuses the whole file on a mismatch, and it reads only
`schema_version` and `mods`. A bump would not degrade old builds, it would
black out their Find Mods tab entirely, including for players who never update.
So `carts`, `cart_count` and `base_games` are additive keys an old reader
ignores: it sees the same `mods` it always did and never learns carts exist.

That is the rule for anything added here. Add keys, never reuse or repurpose an
existing one, and save the bump for a change that genuinely breaks `mods`.

## Download counts

`downloads` is generated, never submitted. GitHub returns each asset's
`download_count` in the same Releases response `--releases` already reads, so
totals cost no extra request and land on the same schedule as everything else.
A consumer sorts on the field it already has instead of calling the API once
per listing.

| | |
|---|---|
| `total` | every `.zip` asset across every release the index has seen, summed |
| `recent` | downloads gained since the newest history sample at least 30 days old |
| `window_days` | how long that window actually was — the history only goes back so far |
| `as_of` | when the counts were last read |

`downloads` is `null`, not `0`, when there is nothing to count: fixed
`downloadURL` listings, `/archive/refs/` links, and GitHub's auto-generated
source zipballs report no count at all. Sort those last rather than treating
them as unpopular. `recent` and `window_days` are `null` until there is more
than one day of history.

Counts accumulate in `.health/downloads.json`, keyed by folder and by tag
(carts under a `carts/` prefix, so the two roots never share a key). Tracking
each tag separately is what makes the total honest: `download_count` resets
when an author deletes and re-uploads an asset, and `per_page=30` means old
tags eventually fall off the response. The state keeps the highest count ever
seen per tag, so neither one makes a total go backwards.

Nothing about this lives in `mods/` or `carts/`. An entry folder is
contributor-owned and rule MI103 / CI103 refuses any file but the four allowed
ones — that is the check that stops a submission from declaring its own
popularity, so it stays intact.

## Working on it

```sh
node scripts/validate.mjs                   # every entry (offline, instant)
node scripts/validate.mjs mods/You@my_mod   # one entry
node scripts/validate.mjs carts/You@my_cart # one cart entry
node scripts/validate.mjs --examples        # include examples/
node scripts/check-links.mjs                # network: do the downloads and pins resolve
node scripts/build-index.mjs                # write site/data/index.json
node scripts/build-index.mjs --releases     # …and re-read GitHub Releases
node scripts/health.mjs                     # network: probe every entry, report only
node scripts/health.mjs --record --prune    # …strike it, and retire what stayed dead
node scripts/scan-lua.mjs                   # network: read the shipped Lua against the sandbox
node scripts/check-blocklist.mjs            # names CI refuses to list
node scripts/gate-releases.mjs              # after a --releases build: scan what it just adopted
```

`health.mjs` is what the six-hourly cleanup job runs. `--record` and `--prune`
write to `.health/state.json` and delete folders, so leave them off unless you
mean it.

No dependencies — a plain `node` is the whole toolchain. CI runs the same
commands on every pull request.

To preview the submission page locally, serve the folder (module scripts need
a real origin):

```sh
node scripts/build-index.mjs && python3 -m http.server -d site 8080
```

## What is in here

| | |
|---|---|
| `mods/` | the index itself |
| `carts/` | custom carts, same three files per folder |
| `examples/` | a template mod entry and a template cart entry to copy |
| `schema/` | the meta.json JSON Schemas — the source of truth for both CI and the site |
| `scripts/` | validate, link check, index build, health probe, sandbox scan |
| `blocklist.json` | names CI refuses to list, with a reason and a date |
| `.health/` | strike counts, cumulative download totals, and which release version last passed the scan |
| `site/` | the GitHub Pages submission helper |
| `oauth-worker/` | optional: the code→token exchange behind "Sign in with GitHub" |

## Credit and licensing

The submission page is styled with
[css-pokemon-gameboy](https://github.com/luttje/css-pokemon-gameboy) (Unlicense).

Index content — the metadata in `mods/` — is contributed by mod authors.
Listing is not vetting: read a mod's source before you enable it.
