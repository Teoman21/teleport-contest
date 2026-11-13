#!/usr/bin/env node
// first-divergence.mjs — Show where the JS port first stops matching C.
//
// Replays one session through js/jsmain.js runSegment() exactly the way
// frozen/ps_test_runner.mjs does (same inputs, one shared storage per
// session), then prints:
//
//   1. the first PRNG call that differs, with the C caller (file:line),
//      the step and key it belongs to, and the calls leading up to it;
//   2. the first screen that differs (cells or cursor), with the rows
//      that differ shown side by side.
//
// Usage:
//   node scripts/first-divergence.mjs <session.json> [options]
//
// Options:
//   --context=N   PRNG calls to show before the first mismatch (default 12)
//   --step=K      show the screen diff for step K instead of the first one
//   --json        print one JSON object instead of the text report
//
// Matching rules mirror frozen/ps_test_runner.mjs: PRNG entries are
// compared after stripping the "@ caller" annotation; a screen counts
// only when every cell (after frozen/screen-decode.mjs decoding) AND
// the cursor agree.

import { readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { decodeScreen, diffCell, renderCell, ROWS_24, COLS_80 } from '../frozen/screen-decode.mjs';
import { normalizeSession } from '../frozen/session_loader.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const args = process.argv.slice(2);
const opt = (name, dflt) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : dflt;
};
const asJson = args.includes('--json');
const context = Number(opt('context', 12));
const forcedStep = opt('step', null);
const target = args.find(a => !a.startsWith('--'));
if (!target) {
    console.error('usage: node scripts/first-divergence.mjs <session.json> [--context=N] [--step=K] [--json]');
    process.exit(2);
}

// The judge overlays the frozen fixture files before scoring; warn when the
// local copies differ so a mismatch isn't blamed on the port.
for (const f of ['isaac64.js', 'terminal.js', 'storage.js']) {
    try {
        if (readFileSync(join(ROOT, 'frozen', f), 'utf8') !== readFileSync(join(ROOT, 'js', f), 'utf8')) {
            console.error(`warning: js/${f} differs from frozen/${f}; the judge uses the frozen copy (run bash frozen/score.sh once to sync)`);
        }
    } catch { /* missing file: runSegment import will say so */ }
}

const isRngCall = e => typeof e === 'string' && /^(?:rn2|rnd|rn1|rnl|rne|rnz|d)\(/.test(e);
const normRng = e => String(e ?? '').replace(/\s*@\s.*$/, '').replace(/^\d+\s+/, '').trim();

// Same pre-decode normalization as the runner (build banner, wall clock).
function preDecode(s) {
    return String(s ?? '')
        .replace(/Version\s+\d+\.\d+\.\d+[^\n]*/, '<<VERSION_BANNER>>')
        .replace(/^\d{2}:\d{2}:\d{2}\.$/gm, '<time>.');
}

function keyName(k) {
    if (k == null) return '(start)';
    return [...String(k)].map(ch => {
        const c = ch.charCodeAt(0);
        if (c === 27) return 'ESC';
        if (c === 10) return '^J';
        if (c === 13) return '^M';
        if (c === 127) return 'DEL';
        if (c < 32) return '^' + String.fromCharCode(c + 64);
        if (ch === ' ') return 'SPACE';
        return ch;
    }).join('');
}

const sessionPath = resolve(process.cwd(), target);
const session = normalizeSession(JSON.parse(readFileSync(sessionPath, 'utf8')));
const { runSegment } = await import(pathToFileURL(join(ROOT, 'js/jsmain.js')).href);

// C side, flattened across segments, with step bookkeeping.
const cRng = [], cRngStep = [], stepKeys = [];
const cScreens = [];   // { screen, cursor, seg, step, key, rngStart }
let stepCounter = 0;
session.segments.forEach((seg, si) => {
    (seg.steps || []).forEach((st, ti) => {
        const rngStart = cRng.length;
        stepKeys.push(st.key);
        for (const e of (st.rng || [])) {
            if (isRngCall(e)) { cRng.push(e); cRngStep.push(stepCounter); }
        }
        if (st.screen) {
            cScreens.push({
                screen: st.screen,
                cursor: Array.isArray(st.cursor) ? st.cursor : null,
                seg: si, step: ti, key: st.key, rngStart,
            });
        }
        stepCounter++;
    });
});

// JS side, run the way the judge runs it.
const store = new Map();
const storage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: k => { store.delete(k); },
    get length() { return store.size; },
    key: i => [...store.keys()][i] ?? null,
};
const jsRng = [], jsScreens = [], jsCursors = [];
let jsError = null;
const t0 = performance.now();
for (const seg of session.segments) {
    try {
        const g = await runSegment({
            seed: seg.seed, datetime: seg.datetime, nethackrc: seg.nethackrc,
            moves: seg.moves, storage,
        });
        for (const e of (g.getRngLog?.() || [])) {
            const s = typeof e === 'string' ? e.replace(/^\d+\s+/, '') : String(e);
            if (isRngCall(s)) jsRng.push(s);
        }
        jsScreens.push(...(g.getScreens?.() || []));
        jsCursors.push(...(g.getCursors?.() || []));
    } catch (e) {
        jsError = e?.stack || String(e);
        break;
    }
}
const elapsedMs = performance.now() - t0;

// ── PRNG ──
let rngMatched = 0, firstRng = -1;
for (let i = 0; i < cRng.length; i++) {
    if (normRng(cRng[i]) === normRng(jsRng[i])) rngMatched++;
    else if (firstRng < 0) firstRng = i;
}
if (firstRng < 0 && jsRng.length > cRng.length) firstRng = cRng.length; // JS made extra calls

// ── Screens ──
function screenDiff(i) {
    const c = cScreens[i];
    const ga = decodeScreen(preDecode(c.screen));
    const gb = decodeScreen(preDecode(jsScreens[i] ?? ''));
    const rows = [];
    for (let r = 0; r < ROWS_24; r++) {
        const cols = [];
        for (let col = 0; col < COLS_80; col++) {
            const d = diffCell(ga[r][col], gb[r][col]);
            if (d) cols.push({ col, kind: d });
        }
        if (cols.length) {
            const text = g => g[r].map(renderCell).join('').replace(/\s+$/, '');
            rows.push({ row: r, c: text(ga), js: text(gb), cols });
        }
    }
    const jc = jsCursors[i];
    const cursorOk = !Array.isArray(c.cursor)
        || (Array.isArray(jc) && c.cursor[0] === jc[0] && c.cursor[1] === jc[1] && c.cursor[2] === jc[2]);
    return { rows, cursorOk, cCursor: c.cursor, jsCursor: jc ?? null };
}
let screensMatched = 0, firstScreen = -1;
for (let i = 0; i < cScreens.length; i++) {
    const d = screenDiff(i);
    if (!d.rows.length && d.cursorOk) screensMatched++;
    else if (firstScreen < 0) firstScreen = i;
}
const shownScreen = forcedStep != null ? Number(forcedStep) : firstScreen;

// ── Report ──
const report = {
    session: basename(sessionPath),
    segments: session.segments.length,
    ms: Math.round(elapsedMs),
    error: jsError,
    rng: { matched: rngMatched, total: cRng.length, jsTotal: jsRng.length, firstMismatch: null },
    screens: { matched: screensMatched, total: cScreens.length, jsTotal: jsScreens.length, shown: null },
};
if (firstRng >= 0) {
    // A step's PRNG calls are the ones made after its key was read and
    // before the next key was requested, so the key is that step's own.
    const step = cRngStep[firstRng] ?? cRngStep[cRngStep.length - 1];
    report.rng.firstMismatch = {
        index: firstRng,
        step,
        key: keyName(stepKeys[step]),
        c: cRng[firstRng] ?? '(none: C made no more calls)',
        js: jsRng[firstRng] ?? '(none: JS made no more calls)',
        before: Array.from({ length: Math.min(context, firstRng) }, (_, k) => {
            const i = firstRng - Math.min(context, firstRng) + k;
            return { index: i, c: cRng[i], js: jsRng[i] ?? null };
        }),
    };
}
if (shownScreen >= 0 && shownScreen < cScreens.length) {
    const c = cScreens[shownScreen];
    report.screens.shown = {
        step: shownScreen, segment: c.seg, key: keyName(c.key),
        jsMissing: shownScreen >= jsScreens.length,
        ...screenDiff(shownScreen),
    };
}

if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
}

const pct = (a, b) => (b ? (100 * a / b).toFixed(1) : '0.0');
console.log(`${report.session}  (${report.segments} segment${report.segments > 1 ? 's' : ''}, ${report.ms} ms)`);
console.log(`  RNG     ${rngMatched}/${cRng.length} (${pct(rngMatched, cRng.length)}%)   JS made ${jsRng.length} calls`);
console.log(`  Screens ${screensMatched}/${cScreens.length} (${pct(screensMatched, cScreens.length)}%)   JS captured ${jsScreens.length}`);
if (jsError) console.log(`\n  JS threw:\n    ${jsError.split('\n').slice(0, 8).join('\n    ')}`);

const m = report.rng.firstMismatch;
if (m) {
    console.log(`\nFirst PRNG mismatch: call #${m.index}, step ${m.step}, key ${m.key}`);
    for (const b of m.before) {
        const same = normRng(b.c) === normRng(b.js);
        console.log(`  ${same ? ' ' : '!'} #${b.index}  C ${b.c}`);
    }
    console.log(`  > #${m.index}  C  ${m.c}`);
    console.log(`  > #${m.index}  JS ${m.js}`);
} else {
    console.log('\nPRNG: every call matches.');
}

const s = report.screens.shown;
if (s) {
    console.log(`\n${forcedStep != null ? 'Screen' : 'First screen mismatch'}: step ${s.step} (segment ${s.segment}), key ${s.key}${s.jsMissing ? '  [JS produced no screen for this step]' : ''}`);
    if (!s.cursorOk) console.log(`  cursor  C ${JSON.stringify(s.cCursor)}  JS ${JSON.stringify(s.jsCursor)}`);
    for (const r of s.rows) {
        const marks = Array(COLS_80).fill(' ');
        for (const { col, kind } of r.cols) marks[col] = kind === 'ch' ? '^' : '~';
        console.log(`  row ${String(r.row).padStart(2)}  C  |${r.c}`);
        console.log(`          JS |${r.js}`);
        console.log(`             |${marks.join('').replace(/\s+$/, '')}`);
    }
    if (!s.rows.length && s.cursorOk) console.log('  (this screen matches)');
    console.log('  legend: ^ wrong character, ~ right character but wrong color/attribute');
} else if (firstScreen < 0) {
    console.log('\nScreens: every screen matches.');
}
