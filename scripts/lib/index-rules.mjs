// Rules a submission has to hold beyond schema shape: folder naming, the
// files allowed to live in an entry folder, and the download paths the
// launcher can actually install from.
//
// Rule ids are stable so a PR comment can point at one. Mod entries use
// MI1xx layout, MI2xx metadata, MI3xx distribution; cart entries use the
// same numbers under CI, plus CI4xx for the pinned mod list.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { validate } from './jsonschema.mjs';

export const MAX_THUMB_BYTES = 2 * 1024 * 1024;
export const MAX_DESCRIPTION_BYTES = 64 * 1024;
export const ALLOWED_FILES = new Set(['meta.json', 'description.md', 'thumbnail.png', 'thumbnail.jpg']);

const MAGIC = {
  'thumbnail.png': [0x89, 0x50, 0x4e, 0x47],
  'thumbnail.jpg': [0xff, 0xd8, 0xff],
};

// Author@id. The author half keeps only characters that stay legible in a
// path, a branch name and a URL — spaces and punctuation get dropped by the
// submission helper rather than escaped forever after.
const FOLDER_RE = /^([A-Za-z0-9._-]{1,64})@([A-Za-z0-9_-]{1,64})$/;

// Hosts that hand back an installable archive rather than an HTML page.
const GOOD_DOWNLOAD = [
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/latest\/download\/[^/]+\.zip$/,
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.zip$/,
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/archive\/refs\/(heads|tags)\/[^/]+\.zip$/,
  /^https:\/\/codeberg\.org\/[^/]+\/[^/]+\/archive\/[^/]+\.zip$/,
  /^https:\/\/gitlab\.com\/[^/]+\/[^/]+\/-\/archive\/[^/]+\/[^/]+\.zip$/,
];

export function loadSchema(repoRoot) {
  return JSON.parse(readFileSync(join(repoRoot, 'schema', 'mod.schema.json'), 'utf8'));
}

export function loadCartSchema(repoRoot) {
  return JSON.parse(readFileSync(join(repoRoot, 'schema', 'cart.schema.json'), 'utf8'));
}

// mods/ and carts/ say which kind a folder is by where it sits; an examples/
// template says so by carrying the pinned mod list only a cart has.
export function entryKind(dir) {
  const parent = basename(dirname(dir));
  if (parent === 'carts') return 'cart';
  if (parent === 'mods') return 'mod';
  try {
    return Array.isArray(JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8')).mods) ? 'cart' : 'mod';
  } catch {
    return 'mod';
  }
}

// Layout, description, thumbnail and meta.json parse: identical for both
// entry kinds, so the rule numbers are too and only the prefix moves.
function checkEntryShape(dir, folder, kind, errors) {
  const prefix = kind === 'cart' ? 'CI' : 'MI';
  const noun = kind === 'cart' ? 'cartid' : 'modid';
  const fail = (rule, msg) => errors.push(`${prefix}${rule} ${folder}: ${msg}`);

  const folderMatch = FOLDER_RE.exec(folder);
  if (!folderMatch) {
    fail('101', `folder must be named Author@${noun} using letters, digits, . _ and - only`);
  }

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    fail('102', 'is not a readable directory');
    return { folderMatch, meta: null, stop: true };
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      fail('103', `contains a subdirectory "${entry.name}"; an index entry is metadata only`);
    } else if (!ALLOWED_FILES.has(entry.name)) {
      fail('103', `contains "${entry.name}"; only ${[...ALLOWED_FILES].join(', ')} are allowed`);
    }
  }

  // --- description.md
  const names = new Set(entries.filter((e) => e.isFile()).map((e) => e.name));
  if (!names.has('description.md')) {
    fail('104', 'is missing description.md');
  } else {
    const body = readFileSync(join(dir, 'description.md'));
    if (body.byteLength === 0) fail('104', 'description.md is empty');
    if (body.byteLength > MAX_DESCRIPTION_BYTES) {
      fail('104', `description.md is ${body.byteLength} bytes; the cap is ${MAX_DESCRIPTION_BYTES}`);
    }
    if (/<script|javascript:/i.test(body.toString('utf8'))) {
      fail('105', 'description.md contains script markup; the site renders descriptions as markdown only');
    }
  }

  // --- thumbnail
  if (names.has('thumbnail.png') && names.has('thumbnail.jpg')) {
    fail('106', 'has two thumbnails; keep one');
  }
  for (const thumb of ['thumbnail.png', 'thumbnail.jpg']) {
    if (!names.has(thumb)) continue;
    const path = join(dir, thumb);
    const size = statSync(path).size;
    if (size > MAX_THUMB_BYTES) {
      fail('106', `${thumb} is ${(size / 1048576).toFixed(2)} MB; the cap is 2 MB`);
    }
    const head = readFileSync(path).subarray(0, 4);
    const want = MAGIC[thumb];
    if (!want.every((byte, i) => head[i] === byte)) {
      fail('106', `${thumb} is not actually ${thumb.endsWith('png') ? 'PNG' : 'JPEG'} data`);
    }
  }

  // --- meta.json
  if (!names.has('meta.json')) {
    fail('107', 'is missing meta.json');
    return { folderMatch, meta: null, stop: true };
  }
  let meta;
  try {
    meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
  } catch (err) {
    fail('107', `meta.json is not valid JSON (${err.message})`);
    return { folderMatch, meta: null, stop: true };
  }
  return { folderMatch, meta, stop: false };
}

// The download paths the launcher can install from, shared by both kinds.
function checkDistribution(meta, fail, warn) {
  if (!meta.github && !meta.downloadURL) {
    fail('301', 'needs either "github": "owner/repo" or a direct "downloadURL"');
  }
  if (meta.github && meta.repo && !meta.repo.toLowerCase().includes(meta.github.toLowerCase())) {
    warn('302', `"repo" (${meta.repo}) does not point at "github" (${meta.github})`);
  }
  if (meta.downloadURL && !GOOD_DOWNLOAD.some((re) => re.test(meta.downloadURL))) {
    fail(
      '303',
      `downloadURL must resolve straight to a .zip (a /releases/latest/download/ or /archive/refs/ link), not a page: ${meta.downloadURL}`,
    );
  }
  if (!meta.github && meta.automatic_version_check) {
    warn('304', 'automatic_version_check needs "github" to have anything to check');
  }
  if (!meta.summary) {
    warn('306', 'has no "summary"; the browse card falls back to the first line of description.md');
  }
}

// Check one mods/<folder> directory. Returns { folder, meta, errors, warnings }.
export function checkModFolder(dir, folder, schema) {
  const errors = [];
  const warnings = [];
  const fail = (rule, msg) => errors.push(`MI${rule} ${folder}: ${msg}`);
  const warn = (rule, msg) => warnings.push(`MI${rule} ${folder}: ${msg}`);

  const { folderMatch, meta, stop } = checkEntryShape(dir, folder, 'mod', errors);
  if (stop) return { folder, meta: null, errors, warnings };

  for (const message of validate(meta, schema)) {
    fail('201', `meta.json ${message}`);
  }
  checkIdentity(meta, folderMatch, fail);
  checkDistribution(meta, fail, warn);

  if (meta.profile === 'total_conversion' && meta.affects_link === false) {
    warn('305', 'a total_conversion that claims affects_link:false is unusual — see the Link Compatibility guide');
  }

  return { folder, meta, errors, warnings };
}

// Check one carts/<folder> directory. Same contract as a mod entry, plus the
// pinned mod list: a cart ships no code, so the list is the whole payload and
// every pin has to name a build someone else can fetch.
export function checkCartFolder(dir, folder, schema) {
  const errors = [];
  const warnings = [];
  const fail = (rule, msg) => errors.push(`CI${rule} ${folder}: ${msg}`);
  const warn = (rule, msg) => warnings.push(`CI${rule} ${folder}: ${msg}`);

  const { folderMatch, meta, stop } = checkEntryShape(dir, folder, 'cart', errors);
  if (stop) return { folder, meta: null, errors, warnings };

  for (const message of validate(meta, schema)) {
    fail('201', `meta.json ${message}`);
  }
  checkIdentity(meta, folderMatch, fail);
  checkDistribution(meta, fail, warn);

  // --- pins
  const pins = Array.isArray(meta.mods) ? meta.mods : [];
  const seen = new Set();
  for (const [i, pin] of pins.entries()) {
    const at = `mods[${i}]`;
    if (!pin || typeof pin !== 'object') continue;
    for (const message of checkPinSource(pin, at)) fail('401', message);
    if (!pin.id) continue;
    const key = pin.id.toLowerCase();
    if (seen.has(key)) fail('402', `pins "${pin.id}" twice; one build per mod`);
    seen.add(key);
  }

  if (meta.load_order) {
    const pinned = new Set(pins.map((pin) => pin?.id).filter(Boolean));
    const extra = meta.load_order.filter((id) => !pinned.has(id));
    const missing = [...pinned].filter((id) => !meta.load_order.includes(id));
    if (extra.length) fail('403', `load_order names "${extra.join('", "')}", which the cart does not pin`);
    if (missing.length) fail('403', `load_order leaves out pinned mod(s) "${missing.join('", "')}"`);
  }

  return { folder, meta, errors, warnings };
}

// A pin has to say where its exact build is published. Nothing else in this
// index is fetchable by trust alone, and a cart is a list of other people's
// builds -- an unsourced pin is a name the engine cannot resolve.
export const PIN_FIELDS = { github: ['repo', 'version', 'sha256'], gamebanana: ['mod', 'file', 'md5'] };

function checkPinSource(pin, at) {
  const problems = [];
  const need = PIN_FIELDS[pin.source];
  if (!need) return problems; // CI201 owns an absent or invented source
  const other = PIN_FIELDS[pin.source === 'github' ? 'gamebanana' : 'github'];
  for (const key of need) {
    if (pin[key] === undefined) problems.push(`${at} is source ${pin.source} but has no "${key}"`);
  }
  for (const key of other) {
    if (pin[key] !== undefined) problems.push(`${at} is source ${pin.source}; "${key}" belongs to the other one`);
  }
  return problems;
}

function checkIdentity(meta, folderMatch, fail) {
  if (folderMatch && meta.id && meta.id !== folderMatch[2]) {
    fail('202', `folder id "${folderMatch[2]}" does not match meta.json id "${meta.id}"`);
  }
  if (folderMatch && meta.author && slug(meta.author) !== slug(folderMatch[1])) {
    fail('202', `folder author "${folderMatch[1]}" does not match meta.json author "${meta.author}"`);
  }
}

// Cross-entry rules: one id, one listing.
export function checkCollisions(results, prefix = 'MI', noun = 'mod') {
  const errors = [];
  const byId = new Map();
  for (const { folder, meta } of results) {
    if (!meta?.id) continue;
    const key = meta.id.toLowerCase();
    if (byId.has(key)) {
      errors.push(`${prefix}203 ${folder}: ${noun} id "${meta.id}" is already listed by ${byId.get(key)}`);
    } else {
      byId.set(key, folder);
    }
  }
  return errors;
}

export function listEntryFolders(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
