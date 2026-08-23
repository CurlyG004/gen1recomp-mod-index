#!/usr/bin/env node
// Refuses to list an entry blocklist.json names, so a resubmission fails CI
// rather than waiting for someone to recognise the name.
//
//   node scripts/check-blocklist.mjs [mods/Author@id ...]   # default: all

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listEntryFolders } from './lib/index-rules.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const listPath = join(repoRoot, 'blocklist.json');

if (!existsSync(listPath)) {
  console.log('no blocklist.json — nothing to check');
  process.exit(0);
}
const blocklist = JSON.parse(readFileSync(listPath, 'utf8'));
const authors = new Map(Object.entries(blocklist.authors || {}).map(([k, v]) => [slug(k), v]));
const repos = new Map(Object.entries(blocklist.repos || {}).map(([k, v]) => [k.toLowerCase(), v]));

const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const folders = targets.length
  ? targets.map((t) => t.replace(/\/+$/, '')).filter((f) => existsSync(join(repoRoot, f)))
  : ['mods', 'carts'].flatMap((root) => listEntryFolders(join(repoRoot, root)).map((f) => `${root}/${f}`));

let blocked = 0;
for (const path of folders) {
  const folder = path.split('/').pop();
  const metaPath = join(repoRoot, path, 'meta.json');
  let meta = {};
  if (existsSync(metaPath)) {
    try {
      meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    } catch {
      meta = {};
    }
  }

  const repoHit = meta.github && repos.get(meta.github.toLowerCase());
  if (repoHit) {
    fail(path, `repo "${meta.github}" is blocklisted since ${repoHit.since}: ${repoHit.reason}`);
    continue;
  }
  for (const name of [folder.split('@')[0], meta.author, (meta.github || '').split('/')[0]]) {
    const hit = name && authors.get(slug(name));
    if (hit) {
      fail(path, `author "${name}" is blocklisted since ${hit.since}: ${hit.reason}`);
      break;
    }
  }
}

console.log(blocked ? `\n${blocked} blocklisted entr${blocked === 1 ? 'y' : 'ies'}.` : `\nNo blocklisted entries (${folders.length} checked).`);
process.exit(blocked ? 1 : 0);

function fail(path, message) {
  blocked += 1;
  console.log(`BLOCKED  ${path}: ${message}`);
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}
