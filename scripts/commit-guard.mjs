#!/usr/bin/env node
// Last check before an automated commit touches site/data/index.json.
//
//   node scripts/commit-guard.mjs
//
// Restores the committed generated_at when a rebuild changed nothing else, so
// a job that runs four times a day does not produce four empty commits, and
// refuses the commit outright when the rebuilt index lost more entries than
// INDEX_MAX_SHRINK — a build that silently drops listings is a bug, not news.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const relPath = 'site/data/index.json';
const indexPath = join(repoRoot, relPath);
const MAX_SHRINK = num(process.env.INDEX_MAX_SHRINK, 6);

let committedText;
try {
  committedText = execFileSync('git', ['show', `HEAD:${relPath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
} catch {
  console.log(`${relPath} is not in HEAD — leaving the rebuild alone`);
  process.exit(0);
}

const rebuiltText = readFileSync(indexPath, 'utf8');
if (rebuiltText === committedText) {
  console.log(`${relPath} is unchanged`);
  process.exit(0);
}

const before = count(committedText);
const after = count(rebuiltText);
const lost = before - after;
if (lost > MAX_SHRINK) {
  console.log(`::error::${relPath} would drop from ${before} to ${after} entries (${lost} lost, ceiling ${MAX_SHRINK}). Refusing to commit.`);
  process.exit(1);
}

if (sansTimestamp(committedText) === sansTimestamp(rebuiltText)) {
  writeFileSync(indexPath, committedText);
  console.log(`${relPath} changed only its generated_at — restored the committed copy`);
} else {
  console.log(`${relPath}: ${before} -> ${after} entries, keeping the rebuild`);
}

function count(text) {
  try {
    return JSON.parse(text).mods?.length ?? 0;
  } catch {
    return 0;
  }
}

function sansTimestamp(text) {
  try {
    const { generated_at: _drop, ...rest } = JSON.parse(text);
    return JSON.stringify(rest);
  } catch {
    return text;
  }
}

function num(raw, fallback) {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
