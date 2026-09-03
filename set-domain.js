#!/usr/bin/env node
/**
 * set-domain.js — the single place the site's domain lives.
 *
 * Canonical URLs, Open Graph tags, JSON-LD and the sitemap all need absolute
 * URLs, so the domain has to appear literally in the HTML. Rather than hunting
 * for it in every file, change it once here:
 *
 *     node set-domain.js www.yourdomain.com
 *
 * It is a one-time dev utility — nothing on the live site depends on it, and it
 * can be deleted after the real domain is in place.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// The site's absolute URLs currently point at the Vercel deploy, because
// miamiaisolutions.com has not been purchased yet. This constant has to match
// what is actually in the files, or the script silently finds nothing.
// TODO: revert to miamiaisolutions.com once domain is purchased
const CURRENT_ORIGIN = 'https://miami-ai-solutions-two.vercel.app';

const FILES = [
  'index.html',
  'services.html',
  'work.html',
  'about.html',
  'contact.html',
  'sitemap.xml',
  'robots.txt'
];

const input = process.argv[2];

if (!input) {
  console.error('Usage: node set-domain.js www.yourdomain.com');
  console.error('Current origin: ' + CURRENT_ORIGIN);
  process.exit(1);
}

const host = input.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
  console.error('That does not look like a hostname: ' + input);
  process.exit(1);
}

const nextOrigin = 'https://' + host.toLowerCase();

if (nextOrigin === CURRENT_ORIGIN) {
  console.log('Nothing to do — the site already uses ' + CURRENT_ORIGIN);
  process.exit(0);
}

let changed = 0;

FILES.forEach(function (name) {
  const file = path.join(__dirname, name);
  if (!fs.existsSync(file)) {
    console.warn('skipped (not found): ' + name);
    return;
  }
  const before = fs.readFileSync(file, 'utf8');
  const after = before.split(CURRENT_ORIGIN).join(nextOrigin);
  if (before === after) {
    console.log('unchanged: ' + name);
    return;
  }
  fs.writeFileSync(file, after);
  changed += 1;
  console.log('updated:   ' + name);
});

// Keep this script's own constant in step, so it stays runnable.
const self = path.join(__dirname, path.basename(__filename));
fs.writeFileSync(
  self,
  fs.readFileSync(self, 'utf8').replace(
    "const CURRENT_ORIGIN = '" + CURRENT_ORIGIN + "';",
    "const CURRENT_ORIGIN = '" + nextOrigin + "';"
  )
);

console.log('\nDone — ' + changed + ' file(s) now point at ' + nextOrigin);
