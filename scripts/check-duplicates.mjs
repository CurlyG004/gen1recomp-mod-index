#!/usr/bin/env node
// Flag entries that list the same mod or cart twice.
//
//   node scripts/check-duplicates.mjs
//
// Two entries collide when they share an id (the folder's id half and
// meta.json's id are already tied together by validate.mjs) or a downloadURL.
// A shared github owner/repo is only a warning: the launcher's asset picker
// (ModUpdate.pickZipAsset) selects release zips by mod id, so a monorepo
// hosting several mods is fine as long as the ids differ — which the id
// check already guarantees. Each key is checked across the whole index,
// since a duplicate is by nature a cross-entry problem. mods/ and carts/ are
// separate namespaces: a cart is never installed as a mod. Exit code is the
// number of duplicate groups (0 = no duplicates), so CI can gate on it.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

let dupes = 0;
let checked = 0;

for (const root of ['mods', 'carts']) {
  if (!existsSync(root)) continue;
  const groups = new Map(); // "kind: value" -> [folder, ...]
  for (const dir of readdirSync(root)) {
    let meta;
    try {
      meta = JSON.parse(readFileSync(join(root, dir, 'meta.json'), 'utf8'));
    } catch {
      continue; // not an entry; validate.mjs owns that complaint
    }
    checked += 1;
    const keys = [['id', meta.id?.toLowerCase()]];
    if (meta.github) keys.push(['github', meta.github.toLowerCase()]);
    if (meta.downloadURL) keys.push(['downloadURL', meta.downloadURL]);
    for (const [kind, value] of keys) {
      if (!value) continue;
      const key = `${kind}: ${value}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(`${root}/${dir}`);
    }
  }

  for (const [key, folders] of groups) {
    if (folders.length < 2) continue;
    if (key.startsWith('github: ')) {
      console.log(`warning shared ${key} (monorepo — release zips must be named <id>-<version>.zip)\n${folders.map((f) => `  - ${f}`).join('\n')}`);
      continue;
    }
    dupes++;
    console.log(`duplicate ${key}\n${folders.map((f) => `  - ${f}`).join('\n')}`);
  }
}

console.log(
  dupes === 0
    ? `OK - ${checked} entr(y|ies) checked, no duplicates.`
    : `${dupes} duplicate group(s) found.`
);
process.exitCode = dupes;
