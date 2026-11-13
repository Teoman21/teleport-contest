#!/usr/bin/env node
// score-gate.mjs — Score all public sessions and refuse regressions.
//
// Runs bash frozen/score.sh (which overlays the frozen files exactly as
// the judge does), compares the result with scripts/score-baseline.json,
// and prints what changed per session.
//
// Exit status:
//   0  no session lost screens (and the total did not drop)
//   1  a regression: some session matched fewer screens than the baseline
//   2  scoring itself failed
//
// Usage:
//   node scripts/score-gate.mjs            # check against the baseline
//   node scripts/score-gate.mjs --update   # check, then save as the new
//                                          #   baseline if nothing regressed
//   node scripts/score-gate.mjs --update --force
//                                          # save even with regressions
//                                          #   (accept a known trade-off)
//
// Env:
//   SESSION_REPLAY_TIMEOUT_MS  per-session limit for the runner (this
//                              script defaults it to 300000; the judge
//                              allows 900000)

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASELINE = join(ROOT, 'scripts', 'score-baseline.json');
const update = process.argv.includes('--update');
const force = process.argv.includes('--force');

const run = spawnSync('bash', [join(ROOT, 'frozen', 'score.sh')], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    env: { SESSION_REPLAY_TIMEOUT_MS: '300000', ...process.env },
});
const marker = '__RESULTS_JSON__';
const idx = (run.stdout || '').lastIndexOf(marker);
if (run.status !== 0 || idx < 0) {
    process.stderr.write(run.stderr || '');
    console.error(`score.sh failed (exit ${run.status}); no results to compare.`);
    process.exit(2);
}
const bundle = JSON.parse(run.stdout.slice(idx + marker.length).trim());

const now = {};
for (const r of bundle.results) {
    now[r.session] = {
        screens: r.metrics?.screens?.matched ?? 0,
        screensTotal: r.metrics?.screens?.total ?? 0,
        rng: r.metrics?.rngCalls?.matched ?? 0,
        rngTotal: r.metrics?.rngCalls?.total ?? 0,
        passed: !!r.passed,
        error: r.error || null,
    };
}
const sum = (o, k) => Object.values(o).reduce((s, v) => s + (v[k] || 0), 0);
const totals = o => ({
    screens: sum(o, 'screens'), screensTotal: sum(o, 'screensTotal'),
    rng: sum(o, 'rng'), rngTotal: sum(o, 'rngTotal'),
    passed: Object.values(o).filter(v => v.passed).length, sessions: Object.keys(o).length,
});

const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;
const t = totals(now);
const pct = (a, b) => (b ? (100 * a / b).toFixed(2) : '0.00');
console.log(`commit ${bundle.commit}: screens ${t.screens}/${t.screensTotal} (${pct(t.screens, t.screensTotal)}%), ` +
    `RNG ${t.rng}/${t.rngTotal} (${pct(t.rng, t.rngTotal)}%), passing ${t.passed}/${t.sessions}, speed ${bundle.speed?.label}`);

let regressions = 0;
if (base) {
    const bt = totals(base.sessions);
    const d = (a, b) => (a - b >= 0 ? '+' : '') + (a - b);
    console.log(`baseline ${base.commit}: screens ${bt.screens}, RNG ${bt.rng}, passing ${bt.passed}`);
    console.log(`change: screens ${d(t.screens, bt.screens)}, RNG ${d(t.rng, bt.rng)}, passing ${d(t.passed, bt.passed)}`);
    for (const name of Object.keys(now).sort()) {
        const a = now[name], b = base.sessions[name];
        if (!b) { console.log(`  new      ${name}: screens ${a.screens}`); continue; }
        const ds = a.screens - b.screens, dr = a.rng - b.rng;
        if (ds < 0) regressions++;
        if (ds || dr || a.passed !== b.passed || a.error !== b.error) {
            const tag = ds < 0 ? 'WORSE ' : (ds > 0 ? 'better' : 'same  ');
            console.log(`  ${tag}   ${name}: screens ${b.screens}→${a.screens} (${d(a.screens, b.screens)}), ` +
                `RNG ${b.rng}→${a.rng} (${d(a.rng, b.rng)})${a.passed !== b.passed ? (a.passed ? ', now PASSES' : ', no longer passes') : ''}` +
                `${a.error && a.error !== b.error ? `, error: ${a.error.split('\n')[0]}` : ''}`);
        }
    }
    if (t.screens < bt.screens) regressions++;
} else {
    console.log('no baseline yet (scripts/score-baseline.json); run with --update to create one');
}

if (update) {
    if (regressions && !force) {
        console.log('not updating the baseline: there are regressions (add --force to accept them)');
    } else {
        writeFileSync(BASELINE, JSON.stringify({
            commit: bundle.commit, timestamp: bundle.timestamp, totals: t, sessions: now,
        }, null, 2) + '\n');
        console.log('baseline updated: scripts/score-baseline.json');
    }
}

if (regressions) {
    console.log(`FAIL: ${regressions} regression(s)`);
    process.exit(1);
}
console.log('OK: no regressions');
