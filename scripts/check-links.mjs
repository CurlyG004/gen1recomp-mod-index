#!/usr/bin/env node
// Network half of the gate, kept out of validate.mjs so that one stays
// offline and instant. Confirms an entry can actually be installed:
// the repo exists, and the thing behind downloadURL is a zip, not a web page.
// A cart is also its pinned mod list, so every pin's source is resolved too --
// a cart that names a build nobody can fetch is a cart nobody can play.
//
//   node scripts/check-links.mjs [mods/Author@id carts/Author@id ...]  # default: all
//
// Exit 1 only on a definite failure — a rate limit or a flaky host warns.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listEntryFolders } from './lib/index-rules.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.GITHUB_TOKEN || '';

const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const folders = targets.length
  ? targets.map((t) => t.replace(/\/+$/, '')).filter((f) => existsSync(join(repoRoot, f, 'meta.json')))
  : ['mods', 'carts'].flatMap((root) => listEntryFolders(join(repoRoot, root)).map((f) => `${root}/${f}`));

let failed = 0;

for (const folder of folders) {
  const meta = JSON.parse(readFileSync(join(repoRoot, folder, 'meta.json'), 'utf8'));

  if (meta.github) {
    const res = await gh(`https://api.github.com/repos/${meta.github}`);
    if (res === 'rate-limited') {
      warn(folder, 'GitHub rate limit — skipped the repo check');
    } else if (!res.ok) {
      fail(folder, `github "${meta.github}" is not reachable (HTTP ${res.status})`);
    } else {
      const releases = await gh(`https://api.github.com/repos/${meta.github}/releases?per_page=5`);
      if (releases !== 'rate-limited' && releases.ok) {
        const list = await releases.json();
        const zips = list.flatMap((r) => (r.assets || []).filter((a) => a.name?.toLowerCase().endsWith('.zip')));
        if (list.length === 0) {
          warn(folder, 'the repo has no releases yet — Update / Versions will stay empty in the launcher');
        } else if (zips.length === 0) {
          warn(folder, 'no release carries a .zip asset — see modkit.py add-release-workflow');
        }
      }
    }
  }

  if (meta.downloadURL) {
    try {
      const res = await fetch(meta.downloadURL, { method: 'HEAD', redirect: 'follow' });
      const type = res.headers.get('content-type') || '';
      if (!res.ok) {
        fail(folder, `downloadURL returned HTTP ${res.status}`);
      } else if (/text\/html/i.test(type)) {
        fail(folder, `downloadURL serves ${type} — it must resolve straight to the .zip`);
      } else {
        ok(folder, `downloadURL ${res.status} ${type || 'no content-type'}`);
      }
    } catch (err) {
      warn(folder, `could not reach downloadURL (${err.message})`);
    }
  }

  for (const pin of Array.isArray(meta.mods) ? meta.mods : []) {
    await checkPin(folder, pin);
  }
}

console.log(failed ? `\n${failed} link problem(s).` : '\nLinks look installable.');
process.exit(failed ? 1 : 0);

// A pin names one exact build, so the check is the build, not just the host:
// the release tag has to exist, and GameBanana has to still carry that file id
// under the digest the cart froze.
async function checkPin(folder, pin) {
  if (pin?.source === 'github') {
    const res = await gh(`https://api.github.com/repos/${pin.repo}`);
    if (res === 'rate-limited') {
      warn(folder, `GitHub rate limit, skipped the pin "${pin.id}"`);
      return;
    }
    if (res.status === 404) {
      fail(folder, `pins "${pin.id}" at github "${pin.repo}", which returned 404`);
      return;
    }
    if (!res.ok) {
      warn(folder, `pin "${pin.id}": github "${pin.repo}" returned HTTP ${res.status}`);
      return;
    }
    const tags = await Promise.all(
      [`v${pin.version}`, pin.version].map((tag) =>
        gh(`https://api.github.com/repos/${pin.repo}/releases/tags/${tag}`),
      ),
    );
    if (tags.some((t) => t === 'rate-limited')) {
      warn(folder, `GitHub rate limit, skipped the release check for "${pin.id}"`);
    } else if (tags.every((t) => t.status === 404)) {
      fail(folder, `pins "${pin.id}" ${pin.repo} ${pin.version}, which has no release under that tag`);
    } else {
      ok(folder, `pin "${pin.id}" ${pin.repo} ${pin.version}`);
    }
    return;
  }

  if (pin?.source === 'gamebanana') {
    let doc;
    try {
      const res = await fetch(`https://gamebanana.com/apiv11/Mod/${pin.mod}/ProfilePage`, {
        headers: { 'User-Agent': 'gen1recomp-mod-index' },
        signal: AbortSignal.timeout(30000),
      });
      if (res.status === 404) {
        fail(folder, `pins "${pin.id}" at gamebanana mod ${pin.mod}, which returned 404`);
        return;
      }
      if (!res.ok) {
        warn(folder, `pin "${pin.id}": gamebanana mod ${pin.mod} returned HTTP ${res.status}`);
        return;
      }
      doc = await res.json();
    } catch (err) {
      warn(folder, `pin "${pin.id}": could not reach gamebanana (${err.message})`);
      return;
    }
    const files = [...(doc._aFiles ?? []), ...(doc._aArchivedFiles ?? [])];
    const file = files.find((f) => Number(f?._idRow) === pin.file);
    if (!file) {
      fail(folder, `pins "${pin.id}" at gamebanana file ${pin.file}, which mod ${pin.mod} no longer carries`);
    } else if (String(file._sMd5Checksum || '').toLowerCase() !== pin.md5) {
      fail(folder, `pin "${pin.id}": gamebanana file ${pin.file} is md5 ${file._sMd5Checksum}, not ${pin.md5}`);
    } else {
      ok(folder, `pin "${pin.id}" gamebanana ${pin.mod}/${pin.file}`);
    }
  }
}

async function gh(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gen1recomp-mod-index',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') return 'rate-limited';
  return res;
}

function fail(folder, message) {
  failed += 1;
  console.log(`error    ${folder}: ${message}`);
}
function warn(folder, message) {
  console.log(`warning  ${folder}: ${message}`);
}
function ok(folder, message) {
  console.log(`ok       ${folder}: ${message}`);
}
