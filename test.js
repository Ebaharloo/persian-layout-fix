// Self-check for the layout tables. Run: node test.js
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/mapping.js', 'utf8'), ctx);
const { enToFa, faToEn, detectDirection } = ctx;

let n = 0;
function eq(actual, expected, label) {
  assert.strictEqual(actual, expected, `${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  n++;
}

// words both directions
const words = [
  ['sghl', 'سلام'],
  ['p,f', 'حوب'],
  ['hjl', 'اتم'],
  ['sghl p,f', 'سلام حوب'],
  [',hj', 'وات'],
  ['?', '؟'],
  ['12/3', '12/3'],
  ['a@b.com', 'ش@ذ.زخئ'],
];
for (const [latin, persian] of words) {
  eq(enToFa(latin), persian, `enToFa(${latin})`);
  eq(faToEn(persian), latin, `faToEn(${persian})`);
}

// shifted level
eq(enToFa('H'), 'آ', 'H');
eq(faToEn('آ'), 'H', 'آ');
eq(enToFa('K'), '«', 'K');
eq(faToEn('«'), 'K', '«');
eq(enToFa('F'), 'ّ', 'F');
eq(faToEn('ّ'), 'F', 'shadda');
eq(enToFa('T'), '،', 'T');
eq(faToEn('،'), 'T', 'arabic comma');
eq(enToFa('\\'), 'پ', 'backslash');
eq(faToEn('پ'), '\\', 'peh');
eq(enToFa('`'), '÷', 'backquote');

// digits: Persian/Arabic-Indic -> ASCII, ASCII stays ASCII
eq(faToEn('۱۲۳۴۵۶۷۸۹۰'), '1234567890', 'persian digits');
eq(faToEn('٠١٢٣٤٥٦٧٨٩'), '0123456789', 'arabic digits');
eq(enToFa('123'), '123', 'ascii digits untouched');

// Arabic spellings no Persian key produces
eq(faToEn('ك'), ';', 'arabic kaf');
eq(faToEn('ى'), 'd', 'alef maksura');
eq(faToEn('ي'), 'X', 'arabic yeh');

// ZWNJ survives both ways
eq(faToEn('می\u200cخواهم'), 'ld\u200co,hil', 'zwnj back');
eq(enToFa('ld\u200co,hil'), 'می\u200cخواهم', 'zwnj forward');

// direction
eq(detectDirection('sghl'), 'en2fa', 'detect latin');
eq(detectDirection('سلام'), 'fa2en', 'detect persian');
eq(detectDirection('۱۲۳'), 'fa2en', 'detect persian digits');
eq(detectDirection('...'), null, 'detect none');

// round trip over a whole sentence
const sentence = 'This is a test, 100% ok?';
eq(faToEn(enToFa(sentence)), sentence, 'round trip');

console.log(`ok — ${n} assertions`);
