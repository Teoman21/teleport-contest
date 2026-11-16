# Teleport contest: NetHack 5.0 → JavaScript port

Fork of `davidbau/teleport-contest` (category: **transpiled**). The judge
scores the latest commit on `main` every two hours. Phase 1 deadline:
**Nov 29, 2026, 00:00 UTC**; the code at that moment is also the baseline
for Phase 2's diff penalty.

## How this port works
The game is the recorder's own C, compiled to plain JavaScript
(`docs/METHOD.md` has the full story):

- `wasm/build.sh`: upstream NetHack 5.0 + Lua 5.4.8, plus the recorder
  patches (`nethack-c/patches/`) and our port patch
  (`wasm/patches/009-javascript-port.patch`), compiled by emcc → wasm2js
  into `js/nethack-c.js` (replay) and `js/nethack-c-play.js` (Asyncify,
  for interactive play). No WebAssembly at run time.
- `wasm/jsglue.c`: key input and screen frames to/from JS, the
  xterm-256color termcap table, America/New_York `localtime`/`mktime`,
  stubs for macOS-only calls.
- `js/jsmain.js`: `runSegment()`, the stand-in for the recorder harness
  (`scripts/record-session.mjs`). `js/play.js` + `js/allmain.js`: browser
  play and the playability check.

## What counts
- A point is one step whose 24×80 screen matches C: every cell **and the
  cursor position** (`frozen/ps_test_runner.mjs` requires both).
- PRNG calls must match C call for call.
- Only `js/`, `package.json` and `index.html` are judged, so the built
  `js/nethack-c*.js` files are committed.

## Hard rules
- Never edit `js/isaac64.js`, `js/terminal.js`, `js/storage.js` (the judge
  overwrites them from `frozen/`), or anything in `frozen/`.
- Plain ES modules, must run in Node 22 and Chrome; no WebAssembly.
- The judge sandbox forbids file writes, network, child processes and
  workers. Cross-segment files go through the storage handle.
- No session-specific code: nothing keyed on seeds, session names, or
  recorded output. 56 held-out sessions punish it.
- Under 5 ms per key (`bash frozen/play.sh`), under 900 s per session.

## Build
- Needs emsdk in `.cache/emsdk` (gitignored): download
  `https://codeload.github.com/emscripten-core/emsdk/tar.gz/refs/heads/main`,
  then `./emsdk install latest`.
- Needs the C source and Lua under `nethack-c/upstream/` and the native
  recorder's data files (`nethack-c/recorder/install/games/lib/nethackdir`,
  made by `bash nethack-c/build-recorder.sh`). In a worktree, point at the
  main checkout with `NETHACK_UPSTREAM=` and `NETHACK_DATADIR=`.
- `bash wasm/build.sh` (≈30 s) rebuilds both `js/nethack-c*.js`;
  `bash wasm/build.sh link` relinks only (after `wasm/jsglue.c` or
  link-flag changes).
- To change C: `bash wasm/build.sh prepare`, edit files under
  `.cache/jsbuild/tree/`, then `bash wasm/regen-port-patch.sh <paths>` to
  fold the edits into the port patch. Mark JS-build changes with
  `#ifdef __EMSCRIPTEN__` and a comment saying why.

## The work loop
1. `node frozen/ps_test_runner.mjs sessions` (all 44 pass today).
2. `node scripts/first-divergence.mjs sessions/<name>.session.json` shows
   the first wrong PRNG call (with the C `file:line`) and the first wrong
   screen.
3. A mismatch now means the environment differs from the recorder's, not
   that game logic is missing: look at clock, terminal, files, data model,
   capture timing.
4. `node scripts/score-gate.mjs` must say `OK: no regressions` before you
   commit. Then `node scripts/score-gate.mjs --update` and commit the
   baseline too.

## Parity notes (each one was a real mismatch)
- ISAAC64 key: the recorder is LP64, so `init_isaac64` widens the seed to 8
  bytes; `#version` reports `I32LP64`.
- Clock: the patched `time_from_yyyymmddhhmmss()` copies `tm_isdst` from
  the real clock; the recordings were made under daylight time, so `time()`
  is pinned to 2026-05-02 and winter datetimes land an hour early. Shop
  names (`ubirthday / 257`) show it.
- Save files are not compressed (no fork); `compress(1)` was silent anyway.
- The public sessions predate upstream's 2026-11-14 `nomux_reset_raw_mode()`
  call, so the port leaves it out (the final "Be seeing you..." cursor).
- Each segment's PRNG log ends at its last kept frame, as the recorder
  reads it; lock files of a killed game are not carried to the next
  segment (the next game erases them because their process is gone).
- Recording environment strings (HOME path, `TERM`, `TZ`) are in
  `docs/recording-environment.md`.

## C reference and recorder
- C source: `nethack-c/upstream/` (gitignored; NetHack-5.0.0_Release,
  commit 16ff59115). Populate with `git submodule update --init` or the
  GitHub tarball of that commit.
- Recorder: `bash nethack-c/build-recorder.sh`, then
  `bash scripts/install-recorder-sysconf.sh` (sysconf is not installed by
  the macOS hints). `wasm/sysconf` is that same file.
- Record a session from a recipe: `node scripts/record-session.mjs
  in.session.json out.session.json`; check the recorder with
  `node scripts/verify-rerecord.mjs <name-substring>`.
