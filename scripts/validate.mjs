#!/usr/bin/env node
// Validate index entries.
//
//   node scripts/validate.mjs                    # every folder under mods/ and carts/
//   node scripts/validate.mjs mods/Ash@my_mod    # just these
//   node scripts/validate.mjs carts/Ash@my_cart  # a cart entry
//   node scripts/validate.mjs --examples         # also check examples/
//   node scripts/validate.mjs --json
//
// Exit 0 clean, 1 on any error. Warnings never fail the run.

import { existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkCartFolder,
  checkCollisions,
  checkModFolder,
  entryKind,
  listEntryFolders,
  loadCartSchema,
  loadSchema,
} from './lib/index-rules.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const withExamples = args.includes('--examples');
const targets = args.filter((a) => !a.startsWith('--'));

const schema = loadSchema(repoRoot);
const cartSchema = loadCartSchema(repoRoot);
const dirs = [];

if (targets.length) {
  for (const target of targets) {
    // Accept a folder or any path inside it, so `--changed` file lists work.
    let dir = resolve(repoRoot, target);
    if (!existsSync(dir)) continue;
    if (!existsSync(join(dir, 'meta.json')) && existsSync(join(dirname(dir), 'meta.json'))) {
      dir = dirname(dir);
    }
    if (!dirs.includes(dir)) dirs.push(dir);
  }
} else {
  const roots = ['mods', 'carts', ...(withExamples ? ['examples'] : [])];
  for (const root of roots) {
    const abs = join(repoRoot, root);
    for (const folder of listEntryFolders(abs)) dirs.push(join(abs, folder));
  }
}

const check = (dir, folder) =>
  entryKind(dir) === 'cart' ? checkCartFolder(dir, folder, cartSchema) : checkModFolder(dir, folder, schema);

const results = dirs.map((dir) => check(dir, basename(dir)));
const errors = results.flatMap((r) => r.errors);
const warnings = results.flatMap((r) => r.warnings);

// Collisions are only meaningful against the whole index, so always load it.
// Mod ids and cart ids live in separate namespaces: a cart is not installed
// as a mod, so the two never collide with each other.
for (const [root, prefix, noun] of [['mods', 'MI', 'mod'], ['carts', 'CI', 'cart']]) {
  const abs = join(repoRoot, root);
  const everything = listEntryFolders(abs).map((folder) => {
    const known = results.find((r) => r.folder === folder && dirs.includes(join(abs, folder)));
    return known ?? check(join(abs, folder), folder);
  });
  errors.push(...checkCollisions(everything, prefix, noun));
}

if (asJson) {
  console.log(JSON.stringify({ checked: dirs.length, errors, warnings }, null, 2));
} else {
  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`error    ${e}`);
  const label = dirs.length === 1 ? 'entry' : 'entries';
  console.log(
    errors.length
      ? `\n${errors.length} error(s), ${warnings.length} warning(s) across ${dirs.length} ${label}.`
      : `\nOK — ${dirs.length} ${label} checked, ${warnings.length} warning(s).`,
  );
}

process.exit(errors.length ? 1 : 0);
