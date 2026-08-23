#!/usr/bin/env node
// Stands between a newly published release and the index adopting it.
//
//   node scripts/gate-releases.mjs        # after build-index.mjs --releases
//
// A pull request is reviewed once; the release feed is not. Without this, an
// entry merged clean can tag a hostile version an hour later and the six-hourly
// refresh would publish it unattended. Every version is scanned once, on the
// way in, and a version that reaches past the sandbox is held: the index keeps
// serving the last cleared release instead. A cart bundle is a manifest and
// label art, so for a cart the bar is any Lua at all.
//
// Env: GITHUB_TOKEN, GATE_STATE (default .health/scanned.json)

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { luaFilesIn, scanFiles } from './lib/lua-scan.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(repoRoot, 'site', 'data', 'index.json');
const statePath = resolve(repoRoot, process.env.GATE_STATE || '.health/scanned.json');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const previous = loadPrevious();
const state = loadState();

const held = [];
const cleared = [];
const skipped = [];

const entries = [
  ...index.mods.map((mod) => ({ mod, key: mod.folder })),
  ...(index.carts ?? []).map((mod) => ({ mod, key: `carts/${mod.folder}`, cart: true })),
];

for (const { mod, key, cart } of entries) {
  const version = mod.latest?.version;
  const url = mod.latest?.zip?.url;
  if (!version || !url) continue;
  if (state.cleared[key] === version) continue;

  if (state.held[key]?.version === version) {
    holdBack(mod, key, state.held[key].reason);
    continue;
  }

  let result;
  try {
    const files = await luaFilesIn(url);
    result = cart
      ? { errors: files.map((f) => ({ name: f.name, line: 1, message: 'a cart bundle ships no code' })), warnings: [] }
      : scanFiles(files, mod.permissions || []);
  } catch (err) {
    skipped.push({ folder: key, version, message: err.message });
    continue;
  }

  if (result.errors.length) {
    const reason = result.errors.map((e) => `${e.name}:${e.line} ${e.message}`).join('; ');
    state.held[key] = { version, reason, at: new Date().toISOString() };
    delete state.cleared[key];
    holdBack(mod, key, reason);
    held.push({ folder: key, version, errors: result.errors });
  } else {
    state.cleared[key] = version;
    delete state.held[key];
    cleared.push({ folder: key, version, warnings: result.warnings });
  }
}

const listed = new Set(entries.map((e) => e.key));
for (const key of Object.keys(state.cleared)) {
  if (!listed.has(key)) delete state.cleared[key];
}
for (const key of Object.keys(state.held)) {
  if (!listed.has(key)) delete state.held[key];
}

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
writeState();

for (const s of skipped) console.log(`skip     ${s.folder} ${s.version}: ${s.message}`);
for (const c of cleared) {
  console.log(`cleared  ${c.folder} ${c.version}${c.warnings.length ? ` (${c.warnings.length} to review)` : ''}`);
  for (const w of c.warnings) console.log(`         ${w.name}:${w.line}  ${w.message}`);
}
for (const h of held) {
  console.log(`HELD     ${h.folder} ${h.version}`);
  for (const e of h.errors) console.log(`         ${e.name}:${e.line}  ${e.message}`);
}
console.log(`\n${cleared.length} cleared, ${held.length} held, ${skipped.length} skipped`);

writeSummary();
emit('held_count', String(held.length));
emit('cleared_count', String(cleared.length));
emit('skipped_count', String(skipped.length));
for (const h of held) {
  console.log(`::warning::${h.folder} ${h.version} was held: it reaches past the mod sandbox`);
}

// ---------------------------------------------------------------- helpers

// Publish the last release this gate cleared rather than the new one. With no
// cleared release to fall back to, the entry stays listed but uninstallable --
// a listing nobody can install beats one that installs something hostile.
function holdBack(mod, key, reason) {
  const before = previous.get(key);
  const fallback = before?.latest && before.latest.version === state.cleared[key]
    ? before.latest
    : null;
  mod.latest = fallback;
  mod.update_check = `held: a newer release did not pass the sandbox scan (${trunc(reason)})`;
}

function loadPrevious() {
  const map = new Map();
  try {
    const text = execFileSync('git', ['show', 'HEAD:site/data/index.json'], {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const doc = JSON.parse(text);
    for (const mod of doc.mods || []) map.set(mod.folder, mod);
    for (const cart of doc.carts || []) map.set(`carts/${cart.folder}`, cart);
  } catch {
    // no committed index yet
  }
  return map;
}

function loadState() {
  if (!existsSync(statePath)) return { version: 1, cleared: {}, held: {} };
  try {
    const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
    return { version: 1, cleared: parsed.cleared ?? {}, held: parsed.held ?? {} };
  } catch {
    return { version: 1, cleared: {}, held: {} };
  }
}

function writeState() {
  const sortKeys = (obj) => Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify({
    version: 1,
    cleared: sortKeys(state.cleared),
    held: sortKeys(state.held),
  }, null, 2)}\n`);
}

function writeSummary() {
  const out = process.env.GITHUB_STEP_SUMMARY;
  if (!out) return;
  const lines = [`### Release gate — ${cleared.length} cleared, ${held.length} held`, ''];
  for (const h of held) {
    lines.push(`> [!CAUTION]`, `> \`${h.folder}\` **${h.version}** was held; the index still serves the last cleared release.`, '');
    for (const e of h.errors) lines.push(`- \`${e.name}:${e.line}\` — ${e.message}`);
    lines.push('');
  }
  if (skipped.length) {
    lines.push(`#### Not scanned (${skipped.length})`, '');
    for (const s of skipped) lines.push(`- \`${s.folder}\` ${s.version} — ${s.message}`);
    lines.push('');
  }
  const review = cleared.filter((c) => c.warnings.length);
  if (review.length) {
    lines.push('#### Cleared, but worth reading', '');
    for (const c of review) {
      for (const w of c.warnings) lines.push(`- \`${c.folder}\` ${c.version} \`${w.name}:${w.line}\` — ${w.message}`);
    }
    lines.push('');
  }
  appendFileSync(out, `${lines.join('\n')}\n`);
}

function emit(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (out) appendFileSync(out, `${key}=${value}\n`);
}

function trunc(s) {
  return s.length > 120 ? `${s.slice(0, 120)}…` : s;
}
