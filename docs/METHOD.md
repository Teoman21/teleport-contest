# Method: compile the recorder's C, then chase the environment

This fork does not hand-port NetHack. It compiles the exact C program that
made the recordings (NetHack 5.0, Lua 5.4.8 and the contest's recorder
patches) to plain JavaScript, and then makes the JavaScript run in the same
environment the recorder ran in. Every remaining mismatch turned out to be
an environment difference, not a game-logic difference.

Result on the 44 public sessions: 11,405/11,405 screens (cells and cursor),
every PRNG call, 44/44 sessions. Startup ≈250 ms per segment, ≈0.5 ms per
key; interactive play 0.7 ms per key.

## Why compile instead of port

With 13 days left and the entry at 0%, a hand port of 250,000 lines of C
plus 17,000 lines of Lua could not reach the top ten. The recordings are
produced by a deterministic C program whose source is in the repo, so the
fastest faithful JavaScript is that program, compiled. The contest's rules
allow transpilers (the category is "transpiled"); what they forbid is
WebAssembly at run time, so the wasm is translated to JavaScript with
wasm2js.

## Pipeline

```
nethack-c/upstream (NetHack 5.0 + lib/lua-5.4.8)
  + nethack-c/patches/001..006   recorder patches: fixed clock and seed,
                                 PRNG log, nomux screen capture
  + wasm/patches/009             port patch (below)
  + wasm/jsglue.c                keys, frames, termcap, clock, stubs
        │ emcc (clang → wasm32), same flags as the recorder's Makefile
        ▼
  wasm2js  ──►  js/nethack-c.js        replay build: keys answered at once
           └─►  js/nethack-c-play.js   play build: Asyncify, key read awaits
```

`wasm/build.sh` does all of it in about 30 seconds. The data files the game
reads (Lua levels, rumors, help text) are embedded in the module's virtual
file system.

`js/jsmain.js` replaces the recorder harness (`scripts/record-session.mjs`).
It sets the recorder's environment variables, writes the session's
`.nethackrc` into the recorded `HOME`, and runs `nethack -u <name>`. The
recorder's own capture code (the nomux shadow buffer) serializes the screen
in C, exactly as in the sessions; at every input boundary it hands that
frame to JavaScript instead of writing an OSC marker to stdout. The key
callback answers with the next recorded key, and when the keys run out it
throws, which unwinds the C stack the way the harness kills the recorder.

## The mismatches, and what caused them

The first full run passed 33 of 44 sessions (75.7% of screens). Each step
after that came from reading one first divergence
(`scripts/first-divergence.mjs`) and asking what differed between the
recorder's machine and the JavaScript runtime.

| Symptom | Cause | Fix |
|---|---|---|
| Every random number different (caught before the first run) | `init_isaac64()` keys ISAAC64 with `sizeof(unsigned long)` bytes: 8 on the LP64 Mac, 4 on wasm32 | widen the seed to 8 bytes in the JS build |
| Game exits at once: `Cannot chdir to /usr/games/lib/nethackdir` | Emscripten copies the environment into C before `main`; variables set later are invisible | set them from `preRun` |
| A shopkeeper named Kadirli instead of Ermenak, with every PRNG call right | The patched `time_from_yyyymmddhhmmss()` copies `tm_isdst` from the *real* clock before `mktime()`. The recordings were made during daylight time, so a winter datetime lands an hour earlier; shop names use `ubirthday / 257` | `localtime`/`mktime` for America/New_York with each era's DST rules, `time()` pinned to a date in daylight time. Also removes any dependence on the judge's time zone |
| `Fork to compress save/0Sneaky failed.` | NetHack compresses save files with `compress(1)` | no compression in the JS build (the recorder's was silent) |
| Restore segment throws `EEXIST` | Restored files collided with the embedded data files | write files after the runtime starts |
| `#version`: `ILP32LL64 data model` | wasm32 data model | report the recorder's `I32LP64` |
| `nhl_loadlua: Error opening (wizard1.lua)` | My stale-file filter (copied from the harness) dropped `*wizard*`, which the harness applies only to non-Lua files | keep every `.lua` file |
| Final "Be seeing you..." cursor one row off | Upstream's 2026-11-14 capture fix resets raw mode at window teardown; the public sessions were recorded before it | leave that call out; keep the same fix's larger capture buffer (the old one could overflow on colorful screens) |

Two more changes match the harness rather than the game. The recorder reads
the PRNG log at each frame and kills the game after the last one, so each
segment's log ends at its last kept frame (the judge concatenates segment
logs, so extra calls would shift every later segment). Lock files of a game
the harness killed are not carried to the next segment, because the next
game sees their process is gone and erases them silently (`veryold()` in
`unixunix.c`).

## Testing beyond the public sessions

The held-out sessions can only be scored by the judge, so
`scripts/local-sessions.mjs` records 30 more with the local C recorder
(`tests/sessions/`): every role and race, dates on both sides of each DST
rule change, midnight and night hours, seeds above 2^32, plain ASCII and
no-color option sets, menu colors and status highlights, meta keys,
wizard-mode level teleports, and save → restore → quit chains. The first
run passed 16 of 30 and found two problems the public set never shows:

| Symptom | Cause | Fix |
|---|---|---|
| 11 sessions wrong from the first call | seeds above 2^32−1: wasm32's `strtoul` saturates at 32 bits | parse `NETHACK_SEED` with `strtoull` (ISAAC64 key and Lua's `math.randomseed`) |
| Every screen after a `#quit` off by one | the game ends on a blank frame; the judge skips recorded steps with an empty screen but kept ours | leave blank frames out, as the judge does |

Now 28 of 30 pass; the two left end on a save, where the local recorder
shows a `--More--` that the official recordings do not (a known local
recorder difference; the JS matches the official seed0013).

The terminal is the other environment piece. The tty code branches on
termcap capabilities (256 colors, alternate character set, clear to end of
screen), so `wasm/jsglue.c` serves the xterm-256color values dumped from
macOS ncurses.

## Interactive play

Replay knows all the keys in advance; a player does not. The play build is
the same objects linked with Asyncify, where the key read is an
`EM_ASYNC_JS` function: the game runs until it wants a key and its C stack
is saved; `moveloop_core()` hands it the next key and waits for the next
pause. Frames are drawn into the page's `Terminal`. The judge's playability
check measures 0.7 ms per key.

## Reproducing

See `CLAUDE.md` (Build). In short: emsdk in `.cache/emsdk`, NetHack and Lua
sources in `nethack-c/upstream`, the native recorder's data files, then
`bash wasm/build.sh` and `node frozen/ps_test_runner.mjs sessions`.
