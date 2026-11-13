#!/usr/bin/env node
// stdin -> stdout layout conversion, same tables as the extension.
// usage: cli.js [--to fa|en] < text     (default: auto-detect direction)
const fs = require('fs');
const path = require('path');

const ctx = {};
require('vm').createContext(ctx);
const mapPath = path.join(__dirname, 'mapping.js');
require('vm').runInContext(fs.readFileSync(fs.existsSync(mapPath) ? mapPath : path.join(__dirname, '..', 'mapping.js'), 'utf8'), ctx);
const { enToFa, faToEn, detectDirection } = ctx;

let text = fs.readFileSync(0, 'utf8');
const keysMode = process.argv.includes('--keys');
const to = process.argv[2] === '--to' ? process.argv[3] : null;
const direction = to === 'fa' ? 'en2fa' : to === 'en' ? 'fa2en' : detectDirection(text);

if (!direction) process.exit(2); // nothing to do; caller shows the error

if (keysMode) {
  // KWin has no virtual-keyboard protocol, so retype by keys instead of Unicode:
  // en2fa -> type the latin text with the Persian layout active;
  // fa2en -> type the mapped latin keys with the US layout active.
  const im = direction === 'en2fa' ? 'fa' : 'en';
  const keys = direction === 'en2fa' ? text : faToEn(text);
  process.stdout.write(im + '\t' + keys);
} else {
  process.stdout.write(direction === 'fa2en' ? faToEn(text) : enToFa(text));
}
