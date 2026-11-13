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
const to = process.argv[2] === '--to' ? process.argv[3] : null;
const direction = to === 'fa' ? 'en2fa' : to === 'en' ? 'fa2en' : detectDirection(text);

if (!direction) process.exit(2); // nothing to do; caller shows the error
process.stdout.write(direction === 'fa2en' ? faToEn(text) : enToFa(text));
