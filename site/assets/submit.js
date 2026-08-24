// The submission helper: build a meta.json from the form, validate it against
// the same schema CI runs, then push the folder to a fork and open the PR.

import { CONFIG } from './config.js';
import { auth, gh, toBase64 } from './github.js';
import { renderMarkdown } from './markdown.js';
import { validate } from './jsonschema.js';

const $ = (id) => document.getElementById(id);
const MAX_THUMB_BYTES = 2 * 1024 * 1024;
const MAX_DESCRIPTION_BYTES = 64 * 1024;

const schemas = { mod: null, cart: null };
let kind = 'mod';
let user = null;
let thumb = null; // { name, bytes, type }
let pins = [];
// An empty form is invalid by definition; saying so before anyone has typed
// is just noise. Problems appear once the form has been touched.
const touched = { mod: false, cart: false };

const KINDS = {
  mod: {
    root: 'mods',
    noun: 'mod',
    tab: 'tab-mods',
    form: 'mod-form',
    note: 'mod-note',
    footnote: 'mod-footnote',
    author: 'author',
    folder: 'folder',
    resolved: 'folder-resolved',
    placeholder: 'What the mod does, what it changes, how to install it, credits. Markdown.',
    build: buildModMeta,
    extras: () => [],
    prTitle: (verb, meta) => `${verb} ${meta.title} ${meta.version}`,
    prBody: modPrBody,
  },
  cart: {
    root: 'carts',
    noun: 'cart',
    tab: 'tab-carts',
    form: 'cart-form',
    note: 'cart-note',
    footnote: 'cart-footnote',
    author: 'cart-author',
    folder: 'cart-folder',
    resolved: 'cart-folder-resolved',
    placeholder: 'What the cart plays like, which mods it pins and why, credits for every one of them. Markdown.',
    build: buildCartMeta,
    extras: cartProblems,
    prTitle: (verb, meta) => `${verb} cart ${meta.title} ${meta.version}`,
    prBody: cartPrBody,
  },
};

const active = () => KINDS[kind];

// ------------------------------------------------------------------ startup

$('nav-repo').href = `https://github.com/${CONFIG.owner}/${CONFIG.repo}`;
$('nav-wiki').href = CONFIG.wiki;

boot();

async function boot() {
  const [mod, cart] = await Promise.all([
    fetch('data/mod.schema.json').then((r) => r.json()),
    fetch('data/cart.schema.json').then((r) => r.json()),
  ]);
  schemas.mod = mod;
  schemas.cart = cart;
  renderCategories();
  renderCartChoices();
  wirePins();
  wireKind();
  wireForm();
  wireThumbnail();
  wireDescription();
  wireManual();
  await wireAuth();
  refresh();
}

// --------------------------------------------------------------------- auth

async function wireAuth() {
  $('oauth-btn').hidden = !auth.canOAuth;
  $('oauth-btn').addEventListener('click', () => auth.beginOAuth());
  $('token-toggle').addEventListener('click', () => {
    $('token-field').hidden = !$('token-field').hidden;
  });
  $('token-save').addEventListener('click', async () => {
    const value = $('token').value.trim();
    if (!value) return;
    auth.token = value;
    $('token').value = '';
    $('token-field').hidden = true;
    await identify();
  });
  $('signout-btn').addEventListener('click', () => {
    auth.signOut();
    user = null;
    setAuthStatus('Signed out.', 'A submission is a pull request, so it needs your account.');
    $('signout-btn').hidden = true;
  });

  try {
    if (await auth.completeOAuth()) log('signed in with GitHub', 'ok');
  } catch (err) {
    log(`sign-in failed: ${err.message}`, 'err');
  }
  if (auth.token) await identify();
}

async function identify() {
  try {
    user = await gh.whoami();
    setAuthStatus(`Signed in as ${user.login}.`, 'Submissions open from your fork of the index.');
    $('signout-btn').hidden = false;
    // A blank Author is almost always the signed-in user.
    let filled = false;
    for (const k of Object.values(KINDS)) {
      if ($(k.author).value) continue;
      $(k.author).value = user.name || user.login;
      filled = true;
    }
    if (filled) refresh();
  } catch (err) {
    user = null;
    auth.signOut();
    setAuthStatus('Token rejected.', err.message);
  }
}

function setAuthStatus(strong, rest) {
  $('auth-status').innerHTML = '';
  const label = document.createElement('span');
  label.textContent = strong;
  $('auth-status').append(label, ` ${rest}`);
}

// --------------------------------------------------------------------- tabs

function wireKind() {
  for (const [name, k] of Object.entries(KINDS)) {
    $(k.tab).addEventListener('click', () => showKind(name));
  }
}

function showKind(next) {
  kind = next;
  for (const [name, k] of Object.entries(KINDS)) {
    const on = name === next;
    $(k.tab).setAttribute('aria-pressed', String(on));
    $(k.form).hidden = !on;
    $(k.note).hidden = !on;
    $(k.footnote).hidden = !on;
  }
  $('description').placeholder = active().placeholder;
  refresh();
}

// --------------------------------------------------------------------- form

function renderCategories() {
  const values = schemas.mod.properties.categories.items.enum;
  $('categories').innerHTML = '';
  for (const value of values) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'cat';
    box.value = value;
    label.append(box, ` ${value.toLowerCase().replace(/_/g, ' ')}`);
    $('categories').append(label);
  }
}

function renderCartChoices() {
  const props = schemas.cart.properties;
  fillSelect('cart-base', props.base.enum);
  fillSelect('cart-seal', props.seal.enum);
  fillSelect('cart-finish', props.finish.enum, 'none');
  $('cart-seal-hint').textContent = props.seal.description;
  $('cart-finish-hint').textContent = props.finish.description.replace(/^Optional cartridge finish: /, '');

  $('cart-speeds').innerHTML = '';
  for (const value of props.speeds.items.enum) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'speed';
    box.value = String(value);
    label.append(box, ` ${value}x`);
    $('cart-speeds').append(label);
  }
}

function fillSelect(id, values, blank) {
  const select = $(id);
  select.innerHTML = '';
  if (blank) select.append(new Option(blank, ''));
  for (const value of values) select.append(new Option(value, value));
}

function formEdited() {
  touched[kind] = true;
  refresh();
}

function wireForm() {
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.id === 'token' || el.closest('#cart-pins')) return;
    el.addEventListener('input', formEdited);
    el.addEventListener('change', formEdited);
  });

  // profile drives the affects_link default, exactly like the manifest does.
  $('profile').addEventListener('change', () => {
    $('affects_link').checked = $('profile').value !== 'content';
    refresh();
  });

  // Paste a repo URL, get owner/repo — the field shows what will be written.
  for (const id of ['github', 'cart-github']) {
    $(id).addEventListener('change', () => {
      $(id).value = normalizeGithub($(id).value.trim());
      refresh();
    });
  }

  $('submit-btn').addEventListener('click', submit);
  $('copy-btn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(JSON.stringify(active().build(), null, 2));
    log('meta.json copied to the clipboard', 'ok');
  });
}

const list = (value) =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function buildModMeta() {
  const meta = {
    id: $('id').value.trim(),
    title: $('title').value.trim(),
    author: $('author').value.trim(),
    version: $('version').value.trim(),
    categories: [...document.querySelectorAll('.cat:checked')].map((b) => b.value),
    repo: $('repo').value.trim(),
  };

  const optional = {
    summary: $('summary').value.trim(),
    tags: list($('tags').value.toLowerCase()),
    github: normalizeGithub($('github').value.trim()),
    downloadURL: $('downloadURL').value.trim(),
    fixed_release_tag: $('fixed_release_tag').value.trim(),
    game_version: $('game_version').value.trim(),
    license: $('license').value.trim(),
    dependencies: list($('dependencies').value),
    conflicts: list($('conflicts').value),
    permissions: [...document.querySelectorAll('.perm:checked')].map((b) => b.value),
    api: Number($('api').value),
    profile: $('profile').value,
    affects_link: $('affects_link').checked,
    experimental: $('experimental').checked,
    automatic_version_check: $('automatic_version_check').checked,
  };

  for (const [key, value] of Object.entries(optional)) {
    const empty = value === '' || (Array.isArray(value) && value.length === 0);
    if (empty) continue;
    // Defaults stay out of the file so a diff shows only what the author meant.
    if (key === 'experimental' && value === false) continue;
    if (key === 'automatic_version_check' && value === true) continue;
    if (key === 'affects_link' && value === ($('profile').value !== 'content')) continue;
    meta[key] = value;
  }

  return meta;
}

function buildCartMeta() {
  const meta = {
    id: $('cart-id').value.trim(),
    title: $('cart-title').value.trim(),
    author: $('cart-author').value.trim(),
    version: $('cart-version').value.trim(),
    base: $('cart-base').value,
    seal: $('cart-seal').value,
    repo: $('cart-repo').value.trim(),
  };

  const optional = {
    summary: $('cart-summary').value.trim(),
    shell: $('cart-shell').value.trim(),
    finish: $('cart-finish').value,
    speeds: [...document.querySelectorAll('.speed:checked')].map((b) => Number(b.value)),
    tags: list($('cart-tags').value.toLowerCase()),
    github: normalizeGithub($('cart-github').value.trim()),
    downloadURL: $('cart-downloadURL').value.trim(),
    fixed_release_tag: $('cart-fixed_release_tag').value.trim(),
    game_version: $('cart-game_version').value.trim(),
    license: $('cart-license').value.trim(),
    automatic_version_check: $('cart-automatic_version_check').checked,
  };

  for (const [key, value] of Object.entries(optional)) {
    const empty = value === '' || (Array.isArray(value) && value.length === 0);
    if (empty) continue;
    if (key === 'automatic_version_check' && value === true) continue;
    meta[key] = value;
  }

  meta.mods = buildPins();
  const order = meta.mods.map((pin) => pin.id).filter(Boolean);
  if ($('cart-load-order').checked && order.length) meta.load_order = order;

  return meta;
}

function normalizeGithub(value) {
  if (!value) return '';
  const match = /github\.com\/([^/]+)\/([^/#?]+)/i.exec(value);
  const pair = match ? `${match[1]}/${match[2]}` : value;
  return pair.replace(/\.git$/, '').replace(/\/$/, '');
}

// Folder names live in paths, branch names and URLs; keep them boring.
const sanitize = (s) => s.replace(/[^A-Za-z0-9._-]/g, '');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const defaultFolder = (meta) => `${sanitize(meta.author) || 'Author'}@${meta.id || `${active().noun}id`}`;

function currentFolder(meta) {
  const override = $(active().folder).value.trim();
  return override || defaultFolder(meta);
}

// --------------------------------------------------------------------- pins

// scripts/lib/index-rules.mjs: PIN_FIELDS
const PIN_FIELDS = { github: ['repo', 'version', 'sha256'], gamebanana: ['mod', 'file', 'md5'] };
const PIN_LABELS = {
  id: 'Mod id',
  repo: 'Release repo',
  version: 'Version',
  sha256: 'Zip sha256',
  mod: 'Mod page id',
  file: 'File id',
  md5: 'File md5',
  options: 'Frozen options',
};
const PIN_PLACEHOLDERS = {
  id: 'some_mod',
  repo: 'owner/repo',
  version: '1.0.0',
  sha256: '64 hex characters',
  mod: '512345',
  file: '987654',
  md5: '32 hex characters',
  options: '{ "difficulty": "hard" }',
};

const newPin = (source = 'github') => ({
  source,
  id: '',
  repo: '',
  version: '',
  sha256: '',
  mod: '',
  file: '',
  md5: '',
  options: '',
});

function wirePins() {
  $('cart-pin-add').addEventListener('click', () => {
    pins.push(newPin());
    renderPins();
    formEdited();
  });
  $('cart-pins-load').addEventListener('click', loadPinsJson);
  pins = [newPin()];
  renderPins();
}

function renderPins() {
  $('cart-pins').innerHTML = '';
  pins.forEach((pin, index) => $('cart-pins').append(pinRow(pin, index)));
}

function pinRow(pin, index) {
  const props = schemas.cart.properties.mods.items.properties;
  const row = document.createElement('div');
  row.className = 'pin';

  const head = document.createElement('div');
  head.className = 'pin-head';
  const name = document.createElement('span');
  name.className = 'label';
  name.textContent = `Pin ${index + 1}`;

  const source = document.createElement('select');
  source.id = `pin-${index}-source`;
  source.setAttribute('aria-label', `Pin ${index + 1} source`);
  for (const value of props.source.enum) source.append(new Option(value, value));
  source.value = pin.source;
  source.addEventListener('change', () => {
    pin.source = source.value;
    renderPins();
    formEdited();
  });

  const spacer = document.createElement('span');
  spacer.className = 'spacer';
  head.append(name, source, spacer);
  head.append(
    pinButton('Up', index > 0, () => movePin(index, -1)),
    pinButton('Down', index < pins.length - 1, () => movePin(index, 1)),
    pinButton('Remove', true, () => {
      pins.splice(index, 1);
      renderPins();
      formEdited();
    }),
  );
  row.append(head);

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.append(pinField(pin, index, 'id', props.id, true));
  for (const key of PIN_FIELDS[pin.source]) grid.append(pinField(pin, index, key, props[key], true));
  row.append(grid);
  row.append(pinField(pin, index, 'options', props.options, false, true));

  return row;
}

function pinButton(text, enabled, onClick) {
  const button = document.createElement('button');
  button.className = 'chip';
  button.textContent = text;
  button.disabled = !enabled;
  button.addEventListener('click', onClick);
  return button;
}

function pinField(pin, index, key, prop, required, area) {
  const field = document.createElement('label');
  field.className = 'field';

  const caption = document.createElement('span');
  caption.className = 'label';
  const badge = document.createElement('span');
  badge.className = required ? 'required' : 'optional';
  badge.textContent = required ? 'required' : 'optional';
  caption.append(PIN_LABELS[key], badge);

  const input = document.createElement(area ? 'textarea' : 'input');
  input.id = `pin-${index}-${key}`;
  if (!area) input.type = 'text';
  else input.style.minHeight = '4em';
  input.spellcheck = false;
  input.value = pin[key];
  input.placeholder = PIN_PLACEHOLDERS[key];
  input.addEventListener('input', () => {
    pin[key] = input.value;
    formEdited();
  });

  field.append(caption, input);
  if (prop?.description) {
    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = prop.description.replace(/^(github|gamebanana): /, '');
    field.append(hint);
  }
  return field;
}

function movePin(index, delta) {
  const [pin] = pins.splice(index, 1);
  pins.splice(index + delta, 0, pin);
  renderPins();
  formEdited();
}

function buildPins() {
  return pins.map((pin) => {
    const row = {};
    if (pin.id.trim()) row.id = pin.id.trim();
    row.source = pin.source;
    for (const key of PIN_FIELDS[pin.source]) {
      const value = pin[key].trim();
      if (!value) continue;
      if (key === 'repo') row.repo = normalizeGithub(value);
      else if (key === 'sha256' || key === 'md5') row[key] = value.toLowerCase();
      else if (key === 'mod' || key === 'file') row[key] = /^\d+$/.test(value) ? Number(value) : value;
      else row[key] = value;
    }
    const options = parseOptions(pin.options);
    if (options) row.options = options;
    return row;
  });
}

function parseOptions(text) {
  if (!text.trim()) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function loadPinsJson() {
  const raw = $('cart-pins-json').value.trim();
  if (!raw) return;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    log(`pin list is not valid JSON: ${err.message}`, 'err');
    return;
  }
  const rows = Array.isArray(parsed) ? parsed : parsed?.mods;
  if (!Array.isArray(rows) || rows.length === 0) {
    log('paste the "mods" array, or a whole cart.json that has one', 'err');
    return;
  }

  let unknown = 0;
  pins = rows.map((row) => {
    if (!PIN_FIELDS[row?.source]) unknown += 1;
    const pin = newPin(PIN_FIELDS[row?.source] ? row.source : 'github');
    if (row?.id !== undefined) pin.id = String(row.id);
    for (const key of [...PIN_FIELDS.github, ...PIN_FIELDS.gamebanana]) {
      if (row?.[key] !== undefined) pin[key] = String(row[key]);
    }
    if (row?.options && typeof row.options === 'object') pin.options = JSON.stringify(row.options, null, 2);
    return pin;
  });
  renderPins();
  formEdited();
  log(`loaded ${pins.length} pin(s) from JSON`, 'ok');
  if (unknown) log(`${unknown} pin(s) had no usable "source" and were set to github`, 'err');
}

// scripts/lib/index-rules.mjs: checkCartFolder, CI4xx
function cartProblems(meta) {
  const problems = [];
  const seen = new Set();

  meta.mods.forEach((pin, index) => {
    const at = `mods[${index}]`;
    const need = PIN_FIELDS[pin.source];
    if (need) {
      for (const key of need) {
        if (pin[key] === undefined) problems.push(`${at} is source ${pin.source} but has no "${key}"`);
      }
    }
    if (pins[index] && pins[index].options.trim() && pin.options === undefined) {
      problems.push(`${at} options must be a JSON object, such as { "difficulty": "hard" }`);
    }
    if (!pin.id) return;
    const key = pin.id.toLowerCase();
    if (seen.has(key)) problems.push(`${at} pins "${pin.id}" twice; one build per mod`);
    seen.add(key);
  });

  if (meta.load_order) {
    const pinned = new Set(meta.mods.map((pin) => pin.id).filter(Boolean));
    const missing = [...pinned].filter((id) => !meta.load_order.includes(id));
    if (missing.length) problems.push(`load_order leaves out pinned mod(s) "${missing.join('", "')}"`);
  }

  return problems;
}

// ------------------------------------------------------------- live refresh

function refresh() {
  const k = active();
  const meta = k.build();
  const folder = currentFolder(meta);
  $(k.resolved).textContent = `${k.root}/${folder}/`;
  $('meta-preview').textContent = JSON.stringify(meta, null, 2);

  const problems = check(meta, folder);
  $('problems').hidden = problems.length === 0 || !touched[kind];
  $('problem-list').innerHTML = '';
  for (const problem of problems) {
    const li = document.createElement('li');
    li.className = 'err';
    li.textContent = problem;
    $('problem-list').append(li);
  }
  $('submit-btn').disabled = problems.length > 0;
  return problems;
}

// The browser half of scripts/lib/index-rules.mjs: same schema, same shape
// rules, so CI does not reject something this page called fine.
function check(meta, folder) {
  const k = active();
  const problems = validate(meta, schemas[kind]);

  const parts = /^([A-Za-z0-9._-]{1,64})@([A-Za-z0-9_-]{1,64})$/.exec(folder);
  if (!parts) {
    problems.push(`folder "${folder}" must look like Author@${k.noun}id`);
  } else {
    // The override exists to tidy the author half, not to rename the mod.
    if (meta.id && parts[2] !== meta.id) {
      problems.push(`folder id "${parts[2]}" must match the ${k.noun} id "${meta.id}"`);
    }
    if (meta.author && slug(parts[1]) !== slug(meta.author)) {
      problems.push(`folder author "${parts[1]}" must match the author "${meta.author}"`);
    }
  }
  const description = $('description').value;
  if (!description.trim()) problems.push('description is required');
  if (new TextEncoder().encode(description).length > MAX_DESCRIPTION_BYTES) {
    problems.push('description is over 64 KB');
  }
  if (!meta.github && !meta.downloadURL) {
    problems.push('needs either a GitHub owner/repo or a direct download URL');
  }
  if (meta.downloadURL && !/\.zip($|[?#])/i.test(meta.downloadURL)) {
    problems.push('download URL must point straight at a .zip, not a release page');
  }
  if (thumb && thumb.bytes.byteLength > MAX_THUMB_BYTES) {
    problems.push('thumbnail is over 2 MB');
  }
  problems.push(...k.extras(meta));
  return problems;
}

// --------------------------------------------------------------- thumbnail

function wireThumbnail() {
  const zone = $('dropzone');
  const input = $('thumb-input');

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.dataset.over = 'true';
  });
  zone.addEventListener('dragleave', () => delete zone.dataset.over);
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    delete zone.dataset.over;
    if (e.dataTransfer.files[0]) acceptThumb(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => {
    if (input.files[0]) acceptThumb(input.files[0]);
  });
  $('thumb-clear').addEventListener('click', () => {
    thumb = null;
    input.value = '';
    $('thumb-preview').hidden = true;
    $('thumb-preview').removeAttribute('src');
    $('dropzone-text').hidden = false;
    $('thumb-clear').hidden = true;
    refresh();
  });
}

async function acceptThumb(file) {
  const png = file.type === 'image/png';
  const jpg = file.type === 'image/jpeg';
  if (!png && !jpg) {
    log(`${file.name} is ${file.type || 'an unknown type'} — PNG or JPEG only`, 'err');
    return;
  }
  if (file.size > MAX_THUMB_BYTES) {
    log(`${file.name} is ${(file.size / 1048576).toFixed(2)} MB — the cap is 2 MB`, 'err');
    return;
  }
  thumb = {
    name: png ? 'thumbnail.png' : 'thumbnail.jpg',
    bytes: new Uint8Array(await file.arrayBuffer()),
    type: file.type,
  };
  const preview = $('thumb-preview');
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  $('dropzone-text').hidden = true;
  $('thumb-clear').hidden = false;
  log(`thumbnail ready — will commit as ${thumb.name}`, 'ok');
  refresh();
}

// -------------------------------------------------------------- description

function wireDescription() {
  const edit = $('tab-edit');
  const preview = $('tab-preview');
  const show = (previewing) => {
    edit.setAttribute('aria-pressed', String(!previewing));
    preview.setAttribute('aria-pressed', String(previewing));
    $('description-field').hidden = previewing;
    $('preview').hidden = !previewing;
    if (previewing) $('preview').innerHTML = renderMarkdown($('description').value);
  };
  edit.addEventListener('click', () => show(false));
  preview.addEventListener('click', () => show(true));
}

// ------------------------------------------------------------------ submit

function log(message, kind = '') {
  const li = document.createElement('li');
  li.className = kind;
  li.textContent = message;
  $('log').append(li);
  li.scrollIntoView({ block: 'nearest' });
}

async function submit() {
  const k = active();
  touched[kind] = true;
  if (refresh().length) return;
  if (!auth.token) {
    log('sign in first, or use "Submit by hand"', 'err');
    return;
  }

  const button = $('submit-btn');
  button.disabled = true;
  try {
    if (!user) await identify();
    if (!user) throw new Error('could not identify the signed-in account');

    const meta = k.build();
    const folder = currentFolder(meta);
    const exists = await gh.folderExists(k.root, folder);
    log(exists ? `${k.root}/${folder}/ exists — this will be an update` : `${k.root}/${folder}/ is new`);

    log('preparing your fork…');
    await gh.ensureFork(user.login);
    await gh.syncFork(user.login);

    const branch = `submit/${folder.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${meta.version}-${shortId()}`;
    const files = [
      { path: `${k.root}/${folder}/meta.json`, content: toBase64(`${JSON.stringify(meta, null, 2)}\n`) },
      { path: `${k.root}/${folder}/description.md`, content: toBase64(ensureTrailingNewline($('description').value)) },
    ];
    if (thumb) files.push({ path: `${k.root}/${folder}/${thumb.name}`, content: toBase64(thumb.bytes) });

    log(`committing ${files.length} file(s) to ${branch}…`);
    const title = k.prTitle(exists ? 'Update' : 'Add', meta);
    await gh.commitFiles(user.login, branch, files, title);

    log('opening the pull request…');
    const pr = await gh.openPullRequest({
      login: user.login,
      branch,
      title,
      body: k.prBody(meta, folder, exists),
    });

    log(`done — ${pr.html_url}`, 'ok');
    const link = document.createElement('a');
    link.className = 'button';
    link.href = pr.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `View pull request #${pr.number}`;
    $('log').append(link);
  } catch (err) {
    log(err.message, 'err');
    if (err.status === 403) log('a fine-grained token needs Contents and Pull requests write on your fork', 'err');
  } finally {
    button.disabled = false;
  }
}

function modPrBody(meta, folder, exists) {
  return [
    `${exists ? 'Updates' : 'Adds'} \`mods/${folder}/\` — **${meta.title}** ${meta.version} by ${meta.author}.`,
    '',
    `- Source: ${meta.repo}`,
    meta.github ? `- Releases tracked from: \`${meta.github}\`` : `- Download: ${meta.downloadURL}`,
    `- Categories: ${meta.categories.join(', ')}`,
    `- Profile: \`${meta.profile ?? 'content'}\`, mod API ${meta.api ?? 2}`,
    '',
    'Author checklist:',
    '',
    '- [ ] `modkit.py validate --strict` and `modkit.py lint` pass',
    '- [ ] the distributed archive contains no ROM-derived content',
    '- [ ] the download URL resolves to a .zip with the mod files at the archive root',
    '',
    '<sub>Opened from the submission helper.</sub>',
  ].join('\n');
}

function cartPrBody(meta, folder, exists) {
  return [
    `${exists ? 'Updates' : 'Adds'} \`carts/${folder}/\` -- **${meta.title}** ${meta.version} by ${meta.author}.`,
    '',
    `- Source: ${meta.repo}`,
    meta.github ? `- Releases tracked from: \`${meta.github}\`` : `- Download: ${meta.downloadURL}`,
    `- Base game: \`${meta.base}\`, seal \`${meta.seal}\``,
    `- Pins ${meta.mods.length} mod(s): ${meta.mods.map((pin) => `\`${pin.id}\``).join(', ')}`,
    '',
    'Author checklist:',
    '',
    '- [ ] every pinned build is already published, at exactly the version and digest listed',
    '- [ ] `description.md` credits every mod the cart pins',
    '- [ ] the cart bundle contains no `.lua` and no ROM-derived content',
    '',
    '<sub>Opened from the submission helper.</sub>',
  ].join('\n');
}

const ensureTrailingNewline = (s) => (s.endsWith('\n') ? s : `${s}\n`);
const shortId = () => Math.random().toString(36).slice(2, 7);

// ------------------------------------------------------- manual fallback

function wireManual() {
  const dialog = $('manual-dialog');
  $('manual-close').addEventListener('click', () => dialog.close());
  $('manual-btn').addEventListener('click', () => {
    const k = active();
    touched[kind] = true;
    if (refresh().length) return;
    const meta = k.build();
    const folder = currentFolder(meta);
    const base = `https://github.com/${CONFIG.owner}/${CONFIG.repo}/new/${CONFIG.branch}`;
    const rows = [
      ['meta.json', `${JSON.stringify(meta, null, 2)}\n`],
      ['description.md', ensureTrailingNewline($('description').value)],
    ];
    $('manual-links').innerHTML = '';
    for (const [name, content] of rows) {
      const path = `${k.root}/${folder}/${name}`;
      const url = `${base}?filename=${encodeURIComponent(path)}&value=${encodeURIComponent(content)}`;
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'button';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `Create ${path}`;
      li.append(link);
      if (url.length > 8000) {
        const warn = document.createElement('span');
        warn.className = 'hint';
        warn.textContent = ' (long — if GitHub truncates it, paste the file instead)';
        li.append(warn);
      }
      $('manual-links').append(li);
    }
    dialog.showModal();
  });
}
