# gen1recomp mod index

A community index of mods for the [Gen 1 recomp engine](https://github.com/DramaticShape/pokemon-gen1-recomp-project).
One folder per mod, holding metadata only — no mod code, no assets, and
certainly no ROM-derived content. The mods themselves live in their authors'
own repositories; this index just says where they are and what they need.

- **Submit a mod:** the [submission helper](https://bryanthaboi.github.io/gen1recomp-mod-index/)
  fills in the form for you and opens the pull request.
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
```

The folder's id half is the mod's `manifest.json` `id`, so an index folder and
an installed mod always name the same thing. Nothing else may live in the
folder.

## meta.json

Validated against [`schema/mod.schema.json`](schema/mod.schema.json). Most
fields mirror the engine's manifest (see the wiki's
[Manifest reference](https://github.com/DramaticShape/pokemon-gen1-recomp-project/wiki/Reference-Manifest)),
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

`data/index.json` is the machine-readable index — one file, everything in it:

```jsonc
{
  "schema_version": 1,
  "generated_at": "2026-07-31T05:17:00.000Z",
  "count": 12,
  "categories": ["GAMEPLAY", "..."],
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
      "update_check": "ok"
    }
  ]
}
```

`latest.zip.url` is exactly what the launcher's **Import mod .zip** path
installs, which is what lets a future in-game browser list this index and
install straight from it. `update_check` is `ok`, `off`, `no installable
release`, or `error: …` — an entry whose upstream went away says so rather than
disappearing.

## Working on it

```sh
node scripts/validate.mjs                 # every entry (offline, instant)
node scripts/validate.mjs mods/You@my_mod # one entry
node scripts/validate.mjs --examples      # include examples/
node scripts/check-links.mjs              # network: do the downloads resolve
node scripts/build-index.mjs              # write site/data/index.json
node scripts/build-index.mjs --releases   # …and re-read GitHub Releases
```

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
| `examples/` | a template entry to copy |
| `schema/` | the meta.json JSON Schema — the source of truth for both CI and the site |
| `scripts/` | validate, link check, index build |
| `site/` | the GitHub Pages submission helper |
| `oauth-worker/` | optional: the code→token exchange behind "Sign in with GitHub" |

## Credit and licensing

The submission page is styled with
[css-pokemon-gameboy](https://github.com/luttje/css-pokemon-gameboy) (Unlicense).

Index content — the metadata in `mods/` — is contributed by mod authors.
Listing is not vetting: read a mod's source before you enable it.
