#!/usr/bin/env node
// local-sessions.mjs — Record our own sessions with the local C recorder,
// as stand-ins for the judge's held-out set.
//
// The public 44 sessions all pass, and the held-out 56 can only be scored
// by the judge.  These recipes vary what the public set barely touches:
// every role and race, dates and times (DST changes in both rule eras,
// midnight, night, Friday the 13th, moon phases), large seeds, options
// (plain ASCII, no color, number_pad, menu styles, message windows, menu
// colors, status highlights), meta and control keys, wizard-mode level
// teleports through the special levels, and save/restore/quit chains.
//
// Usage:
//   node scripts/local-sessions.mjs [outdir]     # default tests/sessions
// then score the JS against them (the clock switch makes the JS read the
// real clock, as the local recorder does; see time() in wasm/jsglue.c):
//   NETHACK_JS_REALTIME=1 node frozen/ps_test_runner.mjs tests/sessions
//
// Env: NETHACK_BINARY / NETHACK_INSTALL as for scripts/record-session.mjs.
//
// Known gap: the recorder writes $HOME paths from a temp dir, so avoid
// commands that print the config file path (the options help pages).

import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(process.argv[2] || join(ROOT, 'tests', 'sessions'));

// Deterministic recipe choices.
function rngFor(n) {
    let a = (n * 2654435761) >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

// Valid role / race / alignment / gender combinations.
const CHARS = [
    ['Archeologist', 'dwarf', 'lawful', 'female'], ['Archeologist', 'gnome', 'neutral', 'male'],
    ['Barbarian', 'orc', 'chaotic', 'female'], ['Barbarian', 'human', 'neutral', 'male'],
    ['Caveman', 'dwarf', 'lawful', 'male'], ['Caveman', 'gnome', 'neutral', 'female'],
    ['Healer', 'human', 'neutral', 'female'], ['Healer', 'gnome', 'neutral', 'male'],
    ['Knight', 'human', 'lawful', 'female'], ['Monk', 'human', 'chaotic', 'male'],
    ['Priest', 'elf', 'chaotic', 'female'], ['Priest', 'human', 'lawful', 'male'],
    ['Rogue', 'orc', 'chaotic', 'female'], ['Ranger', 'elf', 'chaotic', 'male'],
    ['Ranger', 'gnome', 'neutral', 'female'], ['Ranger', 'orc', 'chaotic', 'male'],
    ['Samurai', 'human', 'lawful', 'female'], ['Tourist', 'human', 'neutral', 'male'],
    ['Valkyrie', 'dwarf', 'lawful', 'female'], ['Valkyrie', 'human', 'neutral', 'female'],
    ['Wizard', 'elf', 'chaotic', 'male'], ['Wizard', 'gnome', 'neutral', 'female'],
    ['Wizard', 'orc', 'chaotic', 'female'], ['Caveman', 'human', 'neutral', 'male'],
];

// Dates that exercise the clock: both DST rule eras and their change days,
// midnight and night hours, Friday the 13th, full and new moons.
const DATES = [
    '20260308013000', '20260308033000', '20261101013000', '20261101023000',
    '20050403013000', '20050403033000', '20061029013000', '19990704000500',
    '20260313220000', '20261113003000', '20000102230000', '20260704235900',
    '20251225120000', '20300615060000', '19950101000000', '20260527213000',
    '20240229120000', '20261231235959', '20200901055959', '20261009090000',
];

const SEEDS = [1, 42, 999, 31337, 4294967295, 4294967296, 4294967297 + 1000,
    1099511627776, 123456789012, 9007199254740991];

const OPTION_SETS = [
    ['symset:DECgraphics'],
    [],                                             // plain ASCII
    ['!color', 'symset:DECgraphics'],
    ['number_pad:1', 'showexp', 'time', 'showscore'],
    ['menustyle:traditional', 'msg_window:full', 'symset:DECgraphics'],
    ['menustyle:combination', 'msg_window:reversed'],
    ['autopickup', 'pickup_types:$?!/="+', 'pile_limit:2'],
    ['lit_corridor', 'hilite_pet', 'hilite_pile', 'symset:DECgraphics'],
    ['!verbose', 'rest_on_space', 'mention_walls', 'sortloot:full'],
    ['time', 'statushilites:5', 'symset:DECgraphics'],
    ['fruit:durian', 'catname:Tibbles', 'dogname:Rex', 'pettype:cat'],
    ['menucolors', 'runmode:walk', 'paranoid_confirmation:pray quit'],
    ['boulder:0', 'scores:2 top/1 around', 'symset:DECgraphics'],
    ['implicit_uncursed:false', 'autoquiver', 'pushweapon'],
];
const EXTRA_LINES = [
    '', '', '',
    'MENUCOLOR="blessed"=green\nMENUCOLOR="cursed"=red&bold\nMENUCOLOR=" uncursed "=cyan',
    'OPTIONS=hilite_status:hitpoints/<50%/red&inverse/<75%/yellow\nOPTIONS=hilite_status:gold/always/yellow',
    'BIND=^v:inventory\nSYMBOLS=S_boulder:0',
];

const DIRS = 'hjklyubn';
const LETTERS = 'abcdefghijklmnopq';
const ESC = '\x1b';

// One command snippet; each leaves the game at its top-level prompt (or a
// --More--, which the following space or ESC clears).
function snippet(r, wizard) {
    const d = () => pick(r, DIRS);
    const l = () => pick(r, LETTERS);
    const c = r();
    const opts = [
        () => d().repeat(1 + Math.floor(r() * 4)),
        () => String(2 + Math.floor(r() * 8)) + d(),
        () => d().toUpperCase(),
        () => 's'.repeat(1 + Math.floor(r() * 3)),
        () => '10s',
        () => 'i' + ESC,
        () => ':' + ' ',
        () => ',' + ESC,
        () => 'e' + (r() < 0.5 ? ESC : l()),
        () => 'q' + (r() < 0.6 ? ESC : l()),
        () => 'r' + (r() < 0.6 ? ESC : l()),
        () => 'W' + (r() < 0.5 ? ESC : l()),
        () => 'w' + (r() < 0.5 ? ESC : l()),
        () => 'T' + ESC,
        () => 'P' + (r() < 0.6 ? ESC : l()),
        () => 'd' + (r() < 0.6 ? ESC : l()),
        () => 'D' + ESC,
        () => 't' + (r() < 0.5 ? ESC : l() + d()),
        () => 'a' + (r() < 0.5 ? ESC : l()) + ESC,
        () => 'z' + (r() < 0.5 ? ESC : l() + d()),
        () => 'Z' + ESC,
        () => 'o' + d(),
        () => 'c' + d(),
        () => 'F' + d(),
        () => '\x04' + d(),                    // ^D kick
        () => 'x',
        () => 'E' + '-' + 'Elbereth\r',
        () => '\x18' + ' ' + ' ' + ESC,        // ^X attributes
        () => '\\' + ESC,                      // discoveries
        () => '\x10' + '\x10' + ESC,           // ^P message history
        () => '#pray\r' + 'y' + ' ' + ' ',
        () => '#chat\r' + d(),
        () => '#terrain\r' + ESC,
        () => '#overview\r' + ESC,
        () => '#enhance\r' + ESC,
        () => '#sit\r',
        () => '\xe5' + ESC,                    // M-e: #enhance
        () => '\xf6' + ' ' + ESC,              // M-v: #version
        () => '\xe3' + d(),                    // M-c: #chat
        () => '>' , () => '<',
        () => '_' + '<' + '.' + ESC,           // travel
        () => 'C' + ESC,
        () => '\x12',                          // ^R redraw
        () => '@',                             // toggle autopickup
    ];
    const wiz = [
        () => '\x16' + String(2 + Math.floor(r() * 30)) + '\r' + ' ' + ' ',   // ^V
        () => '\x06' + ' ',                                                 // ^F map
        () => '\x17' + pick(r, ['blessed +2 silver dragon scale mail', '3 cursed potions of sleeping',
            'wand of digging', 'magic marker', 'bag of holding', 'blessed scroll of genocide']) + '\r' + ' ',
        () => '\x07' + pick(r, ['newt', 'gnome lord', 'soldier ant', 'nymph', 'floating eye']) + '\r' + ' ',
        () => '\x05',                                                       // ^E search
        () => '\x09' + ESC,                                                 // ^I identify
        () => '#wizwhere\r' + ESC,
    ];
    if (wizard && c < 0.3) return pick(r, wiz)();
    return pick(r, opts)();
}

function movesFor(r, n, wizard) {
    let m = '';
    while (m.length < n) {
        m += snippet(r, wizard);
        if (r() < 0.5) m += ' ';
    }
    return m;
}

function rcFor(name, char, opts, extra, wizard) {
    const [role, race, align, gender] = char;
    const lines = [
        `OPTIONS=name:${name},role:${role},race:${race},gender:${gender},align:${align}`,
        // an option given twice is an rc error, whose message prints the
        // recorder's temporary $HOME
        `OPTIONS=${opts.includes('autopickup') ? '' : '!autopickup,'}!legacy,!tutorial,suppress_alert:3.4.3`,
    ];
    if (wizard) lines.push('OPTIONS=playmode:debug');
    if (opts.length) lines.push('OPTIONS=' + opts.join(','));
    if (extra) lines.push(extra);
    return lines.join('\n') + '\n';
}

function recipes() {
    const out = [];
    let idx = 0;
    // 24 single-game sessions: every character, varied dates/seeds/options.
    for (let i = 0; i < CHARS.length; i++, idx++) {
        const r = rngFor(1000 + i);
        const wizard = i % 4 === 3;
        const char = CHARS[i];
        const name = wizard ? 'wizard' : pick(r, ['Ada', 'Bo', 'Cyd', 'Dex', 'Eve', 'Fin']) + i;
        const opts = OPTION_SETS[i % OPTION_SETS.length];
        out.push({
            name: `local${String(idx).padStart(2, '0')}-${char[0].toLowerCase()}-${char[1]}${wizard ? '-wiz' : ''}`,
            segments: [{
                seed: SEEDS[i % SEEDS.length] + (i >= SEEDS.length ? 7 * i : 0),
                datetime: DATES[i % DATES.length],
                nethackrc: rcFor(name, char, opts, EXTRA_LINES[i % EXTRA_LINES.length], wizard),
                moves: (i % 3 === 0 ? '' : ' ') + movesFor(r, 120 + Math.floor(r() * 120), wizard),
            }],
        });
    }
    // Interactive character selection (no role given).
    for (let i = 0; i < 3; i++, idx++) {
        const r = rngFor(2000 + i);
        out.push({
            name: `local${String(idx).padStart(2, '0')}-chargen`,
            segments: [{
                seed: 5000 + i * 77,
                datetime: DATES[(i * 7) % DATES.length],
                nethackrc: 'OPTIONS=!autopickup,suppress_alert:3.4.3,symset:DECgraphics\n',
                moves: pick(r, ['Zed', 'Quinn', 'Rio']) + '\r' + 'y' + 'y' + ' ' + ' ' + ' ' + 'n' + movesFor(r, 80, false),
            }],
        });
    }
    // Save, restore under a later date, quit; then a new game (score list).
    for (let i = 0; i < 3; i++, idx++) {
        const r = rngFor(3000 + i);
        const char = CHARS[(i * 5) % CHARS.length];
        const name = ['Saver', 'Keeper', 'Hoarder'][i];
        const rc = rcFor(name, char, OPTION_SETS[(i * 3) % OPTION_SETS.length], '', false);
        out.push({
            name: `local${String(idx).padStart(2, '0')}-save-restore-quit`,
            segments: [
                { seed: 700 + i, datetime: DATES[(3 + i) % DATES.length], nethackrc: rc,
                  moves: movesFor(r, 60, false) + ESC + 'S' + 'y' },
                { seed: 701 + i, datetime: DATES[(9 + i) % DATES.length], nethackrc: rc,
                  moves: ' ' + ' ' + movesFor(r, 60, false) + ESC + '#quit\r' + 'y' + 'q' + ' ' + ' ' + ' ' + ' ' },
                { seed: 702 + i, datetime: DATES[(14 + i) % DATES.length], nethackrc: rc,
                  moves: movesFor(r, 40, false) + ESC + '#quit\r' + 'y' + 'q' + ' ' + ' ' + ' ' + ' ' },
            ],
        });
    }
    return out;
}

function main() {
    mkdirSync(OUT, { recursive: true });
    const work = join(tmpdir(), `local-sessions-${process.pid}`);
    mkdirSync(work, { recursive: true });
    const all = recipes();
    let failed = 0;
    for (const rec of all) {
        const recipePath = join(work, `${rec.name}.recipe.json`);
        const outPath = join(OUT, `${rec.name}.session.json`);
        writeFileSync(recipePath, JSON.stringify({
            version: 5,
            source: 'local-recorder',
            segments: rec.segments.map(s => ({ ...s, steps: [] })),
        }));
        try {
            execFileSync(process.execPath, [join(ROOT, 'scripts', 'record-session.mjs'), recipePath, outPath],
                { stdio: ['ignore', 'ignore', 'pipe'] });
            process.stderr.write(`  recorded ${rec.name}\n`);
        } catch (e) {
            failed++;
            process.stderr.write(`  FAILED ${rec.name}: ${String(e.stderr || e.message).trim().split('\n').pop()}\n`);
        }
    }
    rmSync(work, { recursive: true, force: true });
    process.stderr.write(`${all.length - failed}/${all.length} recorded into ${OUT}\n`);
}

main();
