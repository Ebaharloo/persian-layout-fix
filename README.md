# Persian Layout Fix - Smart Text Converter / مبدل هوشمند صفحه‌کلید فارسی

**English Version:**
Tired of typing Persian with English keyboard layout? This intelligent extension automatically detects and converts text between Persian and English layouts in both directions!

**نسخه فارسی:**
خسته از تایپ فارسی با صفحه‌کلید انگلیسی؟ این افزونه هوشمند به طور خودکار متن را بین صفحه‌کلید فارسی و انگلیسی در هر دو جهت تبدیل می‌کند!

## 🔥 Key Features / ویژگی‌های کلیدی:

### 🤖 Smart Auto-Detection / تشخیص هوشمند
- Automatically detects whether text is Persian or English layout
- Converts in the correct direction without manual switching
- Works with both RTL and LTR text

- تشخیص خودکار متن فارسی یا انگلیسی
- تبدیل در جهت صحیح بدون نیاز به تغییر دستی
- کارکرد با متن‌های راست‌چین و چپ‌چین

### ⚡ Instant Conversion / تبدیل فوری
- Select text and press `Ctrl+Alt+P`
- Or right-click the selection → **Convert Persian ⇄ English layout**
- Or click the extension icon
- Text is replaced instantly in any input field or webpage

- متن را انتخاب کرده و `Ctrl+Alt+P` بزنید
- یا روی آیکون افزونه کلیک کنید
- متن بلافاصله در هر فیلد یا صفحه‌ای جایگزین می‌شود

### 🔄 Bidirectional Support / پشتیبانی دوطرفه
- **English → Persian**: `sghl` becomes `سلام`
- **Persian → English**: `سلام` becomes `sghl`
- Supports all Persian characters including: أ, إ, ء, آ

- **انگلیسی → فارسی**: `sghl` تبدیل به `سلام` می‌شود
- **فارسی → انگلیسی**: `سلام` تبدیل به `sghl` می‌شود
- پشتیبانی از تمام کاراکترهای فارسی شامل: أ, إ, ء, آ

### 🎯 Universal Compatibility / سازگاری جهانی
- Works in Google Search, Facebook, Twitter, Gmail, WhatsApp Web
- Supports text inputs, textareas, and content-editable fields
- Compatible with all modern websites

- کارکرد در گوگل، فیسبوک، توییتر، جیمیل، واتس‌اپ وب
- پشتیبانی از فیلدهای متنی، textarea و محتوای قابل ویرایش
- سازگار با تمام وبسایت‌های مدرن

## 📦 Install / نصب

| browser | how | shortcut |
|---|---|---|
| Firefox | [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/persian-layout-fix/) or `about:debugging` → Load Temporary Add-on → `manifest.json` | `Ctrl+Alt+P` |
| Chrome / Edge / Brave / Opera | load the unpacked `dist/chrome` folder at `chrome://extensions` (Developer mode → Load unpacked) or install from the store | `Ctrl+Shift+Q` |

Chrome does not accept `Ctrl+Alt+P` as a suggested shortcut, so the Chrome build ships
`Ctrl+Shift+Q`. Rebind either one at `chrome://extensions/shortcuts` (Chrome) or
`about:addons` → gear → Manage Extension Shortcuts (Firefox).

## 🖥️ KDE / whole desktop (not just the browser) / کل میزکار

Same conversion, same `mapping.js`, usable in **any** app — Telegram, Kate, LibreOffice, terminal-free fields:

```bash
./scripts/build-kde.sh --install     # installs the applet + packs dist/persian-layout-fix-1.0.0.plasmoid
```

Then: right-click panel → **Add Widgets** → *Persian Layout Fix*, and bind a shortcut:
System Settings → Keyboard → Shortcuts → **Add → Command or Script** → `/home/abraham/bin/plf-fix` → e.g. `Ctrl+Alt+P`.

One press, in place — same feel as the add-on: select the words, click the panel icon (or press the
shortcut), the selection is replaced with the right layout. Nothing for you to copy or paste.

How: the extension reads `window.getSelection()` / `input.selectionStart` and writes with
`execCommand('insertText')`. **The OS has no such API** — the only way to see a selection is `Ctrl+C`
(the script does that itself, in ~30 ms) and the only way to write is sending keystrokes. So:
1. `Ctrl+C` grabs the selection (automatic, not your clipboard afterwards)
2. `scripts/cli.js` converts with the same tables as the extension
3. it switches the input layout to the one that produces the wanted characters, `ydotool type`s the
   equivalent keys over the still-selected text, then switches your layout back
4. your previous clipboard is restored

`wtype` is not used: KWin 6.6 does not implement `zwp_virtual_keyboard_manager_v1`
(`Compositor does not support the virtual keyboard protocol`), so Unicode cannot be typed directly —
keys can. `plf-fix --clip` converts the clipboard only. Every run is logged to
`~/.local/state/plf-fix.log` (`ok`/`fail` + text in/out) so a silent failure is visible.

Requires: `node`, `wl-clipboard`, `ydotool` + running `ydotoold`, `fcitx5-remote`.
Limits: terminals need `Ctrl+Shift+C` (the script sends `Ctrl+C` = SIGINT); typing over a selection
fails where the app ignores synthetic keys — then the converted text stays in your clipboard.

## 🛠 Build / ساخت

```bash
./scripts/build.sh
# dist/persian-layout-fix-firefox-<version>.zip  (MV2, manifest.json)
# dist/persian-layout-fix-chrome-<version>.zip   (MV3, manifest.chrome.json)
```

Both packages are built from the same `mapping.js` / `content.js` / `background.js`;
only the manifest differs. `background.js` picks `browser` or `chrome`, and
`action` or `browserAction`, so one file serves MV2 and MV3.

## 🚀 How to Use / روش استفاده:

**English:**
1. **Select text** anywhere (search bars, forms, web pages)
2. **Press Ctrl+Alt+P** or click the extension icon
3. **Watch magic happen** - text converts automatically!

**فارسی:**
1. **متن را انتخاب کنید** در هر جایی (نوار جستجو، فرم‌ها، صفحات وب)
2. **Ctrl+Alt+P** بزنید یا روی آیکون افزونه کلیک کنید
3. **معجزه را ببینید** - متن به طور خودکار تبدیل می‌شود!

## 💡 Perfect For / مناسب برای:

- Persian/Farsi speakers living abroad
- Bilingual users who switch between languages
- Fixing accidentally mistyped text
- Students and professionals working in both languages

- فارسی‌زبانان ساکن خارج از کشور
- کاربران دو زبانه که بین زبان‌ها جابجا می‌شوند
- اصلاح متن‌های تایپ شده اشتباه
- دانشجویان و حرفه‌ای‌هایی که با هر دو زبان کار می‌کنند

## ⌨️ Keyboard coverage / پوشش صفحه‌کلید

Mapping follows the **Windows `fa-IR` layout (XKB `ir(winkeys)`)** — the layout
almost every Iranian machine has, not the theoretical ISIRI order:

| row | unshifted | shifted |
|---|---|---|
| Q | ض ص ث ق ف غ ع ه خ ح ج چ \ | ً ٌ ٍ ﷼ ، ؛ , ] [ \ } { |
| A | ش س ی ب ل ا ت ن م ک گ | َ ُ ِ ّ ۀ آ ـ « » |
| Z | ظ ط ز ر ذ د ئ و | ة ي ژ ؤ إ أ ء ؟ |
| digits | 0-9 | ! @ # $ % ^ & * ( ) |
| symbols | \` ÷ ~ × | |

Reverse conversion also accepts Arabic spellings Persian keys can't produce
(`ك` `ي` `ى` `ة` `أ` `إ` `ؤ` `ء`) and both Persian (`۰-۹`) and Arabic-Indic
(`٠-٩`) digits.

## 🧪 Tests / تست

```bash
node test.js   # 40 assertions over mapping.js
```

## 📝 Changelog

### 1.3.0 (KDE)
- `scripts/plf-fix` + `scripts/cli.js`: OS-wide conversion for any app on Wayland (clipboard + key injection), reusing `mapping.js`
- `kde/package`: Plasma 6 applet — panel button that converts the current selection; `scripts/build-kde.sh [--install]` packs and installs the `.plasmoid`
- extension, CLI and widget share one mapping table

### 1.2.0
- Right-click context menu **Convert Persian ⇄ English layout** (`contexts: ["selection", "editable"]`) — works on page text, inputs, textareas and contenteditable fields without knowing the shortcut
- Error toasts only from the top frame: the message reaches every frame (`all_frames`), sub-frames no longer draw duplicate notifications
- Both stores built from the same sources by `scripts/build.sh`; feature changes are written once

### 1.1.0
- Fixed crash: `fontStyle` was undefined inside the message listener (ReferenceError on every conversion)
- Rebuilt both mapping tables from the real Windows fa-IR layout; added missing `پ ژ چ گ ۀ آ ة أ إ ؤ ئ ء ، ؛ ؟ « » ÷ ×` and all shift-level letters
- Fixed wrong shift-level pairs (`Shift+Q` was fatha, now fathatan; `Shift+F` was `[`, now shadda; `Shift+K/L` now `«»`)
- Reverse conversion handles Arabic spellings and Persian/Arabic-Indic digits
- Digits no longer converted to `۱۲۳` (the Windows layout types ASCII digits) — numbers, phones, URLs stay intact
- Detection rewritten: dominant script decides direction, dead `commonPatterns` branch removed
- Replacement uses `execCommand('insertText')` so React/Vue/ProseMirror inputs update and undo works; `setRangeText` fallback for inputs
- Font/notification CSS injected once at load instead of on every message
- Notifications: truncated preview, page-independent `z-index`, RTL
- `background.js`: handles missing tabs / missing content script, works with `browser` or `chrome`
- Content script runs in all frames; shortcut documented per browser (`Ctrl+Alt+P` Firefox, `Ctrl+Shift+Q` Chrome)
- Layout tables split into `mapping.js` with `test.js` assertions
- Chrome / Edge build: MV3 manifest, service-worker background, `web_accessible_resources` for the notification font, one `scripts/build.sh` for both stores

## 🔧 Technical Details / جزئیات فنی:

- No data collection or tracking
- Works entirely locally in your browser
- Open source and transparent
- Lightweight and fast

- بدون جمع‌آوری یا ردیابی داده
- کاملاً به صورت محلی در مرورگر شما کار می‌کند
- متن‌باز و شفاف
- سبک و سریع

## 📝 Examples / مثال‌ها:

**English to Persian / انگلیسی به فارسی:**
- `sghl` → `سلام`
- `o,f` → `خوب`
- `hdvhk` → `ایران`
- `ld\u200co,hil` → `می‌خواهم`
- `sghl o,f hk;?` → `سلام خوب انک؟`

**Persian to English / فارسی به انگلیسی:**
- `سلام` → `sghl`
- `خوب` → `o,f`
- `ایران` → `hdvhk`
- `می‌خواهم` → `ld\u200co,hil`
- `۱۲۳` → `123`

ASCII digits, `-`, `=`, `;`, `:`, `/`, `.`, `()`, `[]`, `{}` are shared by both layouts, so numbers, URLs, emails and code survive conversion untouched.

خداحافظ سردردهای تغییر صفحه‌کلید! 🎉
Say goodbye to layout switching headaches! 🎉
