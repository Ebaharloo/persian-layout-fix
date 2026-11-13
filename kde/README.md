# Persian Layout Fix — KDE / whole desktop

Same conversion as the [browser extension](..), but for **any app on KDE Plasma 6 (Wayland)**: Telegram,
Kate, LibreOffice, Thunderbird, Dolphin's rename field — anything that publishes a text selection.

Type with the wrong layout, select the words, press the key (or click the panel widget) → the selection
is replaced with the same text in the correct layout. Nothing to copy, nothing to paste afterwards.

```
sghl o,f          →  سلام خوب
سلام خوب          →  sghl o,f
اشرث مخل خب هف مشسف صخقنس؟!  →  have log of it last works?!
```

## Why there is a keyboard trick but no clipboard

The extension reads `window.getSelection()` / `input.selectionStart` and writes with
`execCommand('insertText')` — a web page hands the extension everything. **The OS has no such API.**

What it uses instead:

| step | mechanism | why |
|---|---|---|
| read the selection | `wl-paste --primary` (Wayland primary selection, the one middle-click pastes) | the app publishes it when you select — no `Ctrl+C`, clipboard untouched |
| convert | `mapping.js` via `cli.js` | same tables as the extension, same tests |
| write it back | switch fcitx5 to the layout that produces the wanted characters, `ydotool type` the equivalent keys over the selection, switch back | KWin 6 has no `zwp_virtual_keyboard_manager_v1`, so `wtype` fails (`Compositor does not support the virtual keyboard protocol`) and Unicode cannot be typed — keycodes can |

Your previous clipboard, primary selection and input layout are left as they were.

## Requirements

| package | used for |
|---|---|
| `node` | runs `cli.js` (the conversion) |
| `wl-clipboard` (`wl-paste`) | read the primary selection |
| `fcitx5` (`fcitx5-remote`) | switch layout around the retype |
| `ydotool` + running `ydotoold` | send the keystrokes (needs `/dev/uinput` access) |
| Plasma 6 | the widget |

## Install

```bash
./scripts/build-kde.sh --install
```

That stages the applet, packs `dist/persian-layout-fix-<version>.plasmoid` and installs it with
`kpackagetool6`. Then:

1. Right-click the panel → **Add Widgets** → *Persian Layout Fix*. One click converts the selection.
2. Optional hotkey: System Settings → Keyboard → **Shortcuts → Add → Command or Script** →
   command `/home/abraham/bin/plf-fix` → key of your choice.

`/home/abraham/bin/plf-fix` is a symlink to `scripts/plf-fix`; the widget runs its own bundled copy
(`contents/tools/plf-fix`), which `build-kde.sh` refreshes — they are byte-identical after every build.

## Usage

```bash
plf-fix           # fix the current selection (primary selection)
plf-fix --copy    # same, but grab the selection with Ctrl+C (apps that publish no primary selection)
plf-fix --clip    # convert the clipboard only, type nothing - then paste where you want
```

Repeat protection: primary selection keeps its old value, so pressing twice on the same text refuses
(`already fixed this one`) instead of retyping stale text at the cursor.

## Log

`~/.local/state/plf-fix.log` — one tab-separated line per run:

```
2026-11-13 17:16:26	ok | in=dacsdcv | out=یشزسیزر | typed=dacsdcv (fa)
2026-11-13 17:11:32	fail: nothing selected
```

`ok` lines carry input, output and the keystrokes typed. `fail:` reasons: `nothing selected`,
`already fixed this one`, `cant detect language`, `typing failed`, `no selection (app did not copy)`.
Last processed input is kept in `~/.local/state/plf-fix.last`.

## Troubleshooting

| symptom | cause | fix |
|---|---|---|
| key shows fcitx5's "Preedit / Preedit disabled" popup | fcitx5 ships `Ctrl+Alt+P` bound to Toggle Preedit (`~/.config/fcitx5/config` → `[Hotkey/TogglePreedit]`) | use another key or clear that binding, then `fcitx5-remote -r` |
| key does nothing, no log line | the shortcut was never registered — writing `[services][plf-fix.desktop]` into `kglobalshortcutsrc` plus `X-KDE-GlobalAccel-CommandShortcut=true` leaves KGlobalAccel with no component | add it once through the Shortcuts KCM |
| widget click does nothing | app publishes no primary selection (some Electron/Chromium builds) | bind the hotkey to `plf-fix --copy` for those apps |
| log says `fail: nothing selected` | you selected nothing, or the app does not publish primary selection | select the text, or use `--copy` |
| log says `ok` but text unchanged | app ignores synthetic keystrokes | `plf-fix --clip` + paste |
| terminal emulator | `plf-fix --copy` sends `Ctrl+C` = SIGINT | use `--clip` there |

## Files

```
scripts/plf-fix      the desktop tool (primary selection → convert → retype)
scripts/cli.js       stdin/stdout converter over ../mapping.js (--keys prints the keystrokes)
kde/package/         the Plasma applet (metadata.json + contents/ui/main.qml)
scripts/build-kde.sh packs and installs the applet, bundles the two scripts above
```

`mapping.js` is shared with the Firefox/Chrome builds — a table fix lands everywhere at once.

## Publishing

Upload `dist/persian-layout-fix-<version>.plasmoid` to [store.kde.org](https://store.kde.org) →
*Plasma 6 Add-Ons → Application Widgets*. Mention the requirements above: the widget shells out to
`node`, `wl-clipboard`, `fcitx5-remote` and `ydotool`, so it is not a self-contained C++ applet.

## License

MIT, same as the extension.
