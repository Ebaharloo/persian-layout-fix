/**
 * Persian <-> English keyboard layout mapping.
 *
 * Source of truth: XKB `ir(winkeys)` — the Windows fa-IR layout that Iranian
 * users actually have installed. Keys below are the ASCII characters typed on
 * an English layout; values are what the same physical key gives in Persian.
 *
 * ASCII punctuation is NOT swapped on purpose: shift+9 / shift+0 / '-' / '=' /
 * ';' ... produce the same glyph in both layouts. Only non-ASCII output is
 * reversible, which keeps numbers, URLs, emails and code intact.
 */
var FA_LAYOUT = {
  // letters, unshifted
  q: 'ض', w: 'ص', e: 'ث', r: 'ق', t: 'ف', y: 'غ', u: 'ع', i: 'ه', o: 'خ', p: 'ح',
  '[': 'ج', ']': 'چ', '\\': 'پ',
  a: 'ش', s: 'س', d: 'ی', f: 'ب', g: 'ل', h: 'ا', j: 'ت', k: 'ن', l: 'م',
  ';': 'ک', "'": 'گ',
  z: 'ظ', x: 'ط', c: 'ز', v: 'ر', b: 'ذ', n: 'د', m: 'ئ', ',': 'و',

  // letters + signs, shifted
  Q: 'ً', W: 'ٌ', E: 'ٍ', R: '﷼', T: '،', Y: '؛', A: 'َ', S: 'ُ', D: 'ِ',
  F: 'ّ', G: 'ۀ', H: 'آ', J: 'ـ', K: '«', L: '»',
  Z: 'ة', X: 'ي', C: 'ژ', V: 'ؤ', B: 'إ', N: 'أ', M: 'ء',
  U: ',', O: '[', I: ']', P: '\\', '{': '}', '}': '{', '?': '؟',

  // symbols
  '`': '÷', '~': '×'
};

// Persian -> ASCII. Only non-ASCII values are candidates: an ASCII character
// can be produced by two different keys ("," = shift+u and "," = unshifted
// comma key) so it is ambiguous and stays untouched.
var FA_TO_EN = {};
(function () {
  for (var key in FA_LAYOUT) {
    var glyph = FA_LAYOUT[key];
    if (glyph.charCodeAt(0) > 0x7f && !(glyph in FA_TO_EN)) FA_TO_EN[glyph] = key;
  }

  // Arabic-script spellings a Persian key can not produce, but that arrive by
  // paste / Arabic keyboards / old data. Map them onto the nearest key.
  var aliases = { 'ك': ';', 'ى': 'd', '٪': '%', '٫': '.', '٬': ',' };
  for (var alias in aliases) {
    if (!(alias in FA_TO_EN)) FA_TO_EN[alias] = aliases[alias];
  }

  // Persian (۰-۹) and Arabic-Indic (٠-٩) digits
  for (var d = 0; d < 10; d++) {
    FA_TO_EN[String.fromCharCode(0x06f0 + d)] = String(d);
    FA_TO_EN[String.fromCharCode(0x0660 + d)] = String(d);
  }
})();

function mapChars(text, map) {
  var out = '';
  for (var ch of text) out += map[ch] !== undefined ? map[ch] : ch;
  return out;
}

function enToFa(text) {
  return mapChars(text, FA_LAYOUT);
}

function faToEn(text) {
  return mapChars(text, FA_TO_EN);
}

/**
 * Direction is decided by which script dominates. Persian digits count as
 * Persian because they can only be typed/pasted with a Persian layout.
 */
function detectDirection(text) {
  var fa = 0, en = 0;
  for (var ch of text) {
    var c = ch.codePointAt(0);
    if (c >= 0x0600 && c <= 0x06ff) fa++;
    else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) en++;
  }
  if (fa > en) return 'fa2en';
  if (en > 0) return 'en2fa';
  return null;
}
