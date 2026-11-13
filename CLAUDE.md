# Teleport contest: NetHack 5.0 → JavaScript port

Fork of `davidbau/teleport-contest` (category: agentic). The judge scores the
latest commit on `main` every two hours. Phase 1 deadline: **Nov 29, 2026,
00:00 UTC**; the code at that moment is also the baseline for Phase 2's
diff penalty, so keep it readable.

## What counts
- A point is one step whose 24×80 screen matches C: every cell **and the
  cursor position** (`frozen/ps_test_runner.mjs` requires both).
- PRNG calls must match C call for call; they earn nothing directly but
  every later screen depends on them.
- Only `js/`, `package.json` and `index.html` are judged.

## Hard rules
- Never edit `js/isaac64.js`, `js/terminal.js`, `js/storage.js` (the judge
  overwrites them from `frozen/`), or anything in `frozen/`.
- Plain ES modules, no build step; must run in Node 22 and Chrome.
- The judge sandbox forbids file writes, network, child processes and
  workers. Persistent state goes through `js/storage.js`.
- No session-specific code: nothing keyed on seeds, session names, or
  recorded output. 44 held-out sessions punish it. `js/fastforward.js` is
  the one existing hack and should shrink to nothing.
- Under 5 ms per key (`bash frozen/play.sh`), under 900 s per session.

## The work loop
1. `node scripts/first-divergence.mjs sessions/<name>.session.json`
   shows the first wrong PRNG call (with the C `file:line`) and the first
   wrong screen.
2. Read that function in `nethack-c/upstream/src/` (or `dat/*.lua`).
3. Port it faithfully, quirks included, into the JS file named after the C
   file (`mon.c` → `js/mon.js`), keeping the C function name and noting
   `// C ref: mon.c` above it.
4. `node scripts/score-gate.mjs` must say `OK: no regressions` before you
   commit. Then `node scripts/score-gate.mjs --update` to raise the baseline
   in `scripts/score-baseline.json`, and commit that file too.

## Porting notes
- C argument evaluation is left-to-right here (recorder built with clang),
  same as JS: `d(rn2(5), rn2(3))` draws `rn2(5)` first.
- Three PRNG streams: core, Lua special levels (logged with `src=…lua`),
  display/hallucination. Each must line up separately.
- Recording environment strings (HOME path, `TERM=xterm-256color`,
  `TZ=America/New_York`) are in `docs/recording-environment.md`.
- `docs/phase1-inventory.md` lists every C function that draws PRNG in the
  public sessions, with call counts.

## C reference and recorder
- C source: `nethack-c/upstream/` (gitignored; NetHack-5.0.0_Release,
  commit 16ff59115). Populate with `git submodule update --init` or the
  GitHub tarball of that commit.
- Recorder: `bash nethack-c/build-recorder.sh` builds
  `nethack-c/recorder/install/games/lib/nethackdir/nethack`. The macOS
  hints don't install `sysconf` (the game refuses to start without it),
  so after every rebuild run `bash scripts/install-recorder-sysconf.sh`.
  It enables `playmode:debug` (`WIZARDS=*`) and drops the gdb/grep paths
  that would otherwise print an error screen at startup.
- Record a session from a recipe (seed, datetime, nethackrc, moves):
  `node scripts/record-session.mjs in.session.json out.session.json`.
  Check the recorder with `node scripts/verify-rerecord.mjs <name-substring>`.
  Verified byte-exact on seed8000, seed0077, seed0398 and seed0383. Known
  gap: the last frame when a game exits can differ (seed0013 shows
  `--More--` where the official recording has `Be seeing you...`; seed0030
  records one step fewer in its first game). Trust the official sessions
  for end-of-game frames.
