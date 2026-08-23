<!-- The submission helper fills this in for you: https://bryanthaboi.github.io/gen1recomp-mod-index/ -->

**Mod or cart:** <!-- title, version, author -->
**Folder:** `mods/Author@mod_id/` <!-- or carts/Author@cart_id/ -->
**Source:** <!-- repo URL -->

- [ ] `modkit.py validate <id> --strict` and `modkit.py lint <id>` pass
- [ ] the distributed `.zip` has the mod's files at the archive root
- [ ] nothing distributed is ROM-derived (no extracted art, chip banks, ROMs or patches)
- [ ] `meta.json` matches the mod's `manifest.json` (id, api, profile, permissions, dependencies, conflicts)
- [ ] this PR only touches `mods/<Author>@<id>/`

Carts only:

- [ ] `meta.json` matches the bundle's `cart.json` (base, seal, mods, load_order)
- [ ] the bundle contains no `.lua`
- [ ] every pinned build is public and every mod author is credited

<!-- Version bumps do not need a PR: entries with "github" and
     automatic_version_check are re-read from your Releases nightly. -->
