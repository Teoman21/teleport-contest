/* jsglue.c — the seam between compiled NetHack and the JavaScript driver.
 *
 * Built only into the JavaScript port (wasm/build.sh copies it into src/).
 * Three things live here:
 *
 *   1. keystrokes:  tty input (unixconf.h maps tgetch to js_tgetch) asks
 *      the JS driver for the next key.  When the recorded keys run out the
 *      driver throws, which unwinds the whole C stack back to jsmain.js.
 *   2. screens:     the recorder's nomux shadow buffer is serialized in C
 *      (nomux_capture_screen) exactly as in the recordings; termcap.c hands
 *      each frame to the driver here instead of printing an OSC marker.
 *   3. termcap:     the recorder linked macOS ncurses with TERM=xterm-256color.
 *      The tty code branches on those capabilities (color count, alt
 *      charset, clear-to-end-of-screen), so the same values are served
 *      from a table, dumped from macOS ncurses with tgetstr/tgetnum.
 */

#include <stdarg.h>
#include <stdio.h>
#include <string.h>
#include <emscripten.h>

/* ---- 1. keystrokes ---------------------------------------------------- */

EM_JS(int, js_next_key, (void), {
    return Module.nhNextKey();
});

int
js_tgetch(void)
{
    return js_next_key();
}

/* ---- 2. screens ------------------------------------------------------- */

EM_JS(void, js_frame, (int is_input, int seq, int cx, int cy, const char *scr), {
    Module.nhFrame(is_input, seq, cx, cy, UTF8ToString(scr));
});

void
js_screen_marker(int is_input, int seq, int cx, int cy, const char *scr)
{
    js_frame(is_input, seq, cx, cy, scr);
}

/* ---- 3. termcap (xterm-256color, as served by macOS ncurses) ---------- */

short ospeed;

struct tc_str { const char *id; const char *val; };
struct tc_num { const char *id; int val; };

static const struct tc_str tc_strs[] = {
    { "le", "\010" },
    { "ho", "\033[H" },
    { "nd", "\033[C" },
    { "ce", "\033[K" },
    { "up", "\033[A" },
    { "cm", "\033[%i%p1%d;%p2%dH" },
    { "so", "\033[7m" },
    { "se", "\033[27m" },
    { "us", "\033[4m" },
    { "ue", "\033[24m" },
    { "ZH", "\033[3m" },
    { "ZR", "\033[23m" },
    { "ti", "\033[?1049h" },
    { "te", "\033[?1049l" },
    { "ks", "\033[?1h\033=" },
    { "ke", "\033[?1l\033>" },
    { "mr", "\033[7m" },
    { "mb", "\033[5m" },
    { "md", "\033[1m" },
    { "mh", "\033[2m" },
    { "me", "\033[0m" },
    { "vi", "\033[?25l" },
    { "ve", "\033[?12l\033[?25h" },
    { "Ic", "\033]4;%p1%d;rgb:%p2%{255}%*%{1000}%/%2.2X/%p3%{255}%*%{1000}%/%2.2X/%p4%{255}%*%{1000}%/%2.2X\033\\" },
    { "as", "\033(0" },
    { "ae", "\033(B" },
    { "cd", "\033[J" },
    { "cl", "\033[H\033[2J" },
    { "AF", "\033[%?%p1%{8}%<%t3%p1%d%e%p1%{16}%<%t9%p1%{8}%-%d%e38;5;%p1%d%;m" },
    { "AB", "\033[%?%p1%{8}%<%t4%p1%d%e%p1%{16}%<%t10%p1%{8}%-%d%e48;5;%p1%d%;m" },
    { "op", "\033[39;49m" },
    { "vs", "\033[?12;25h" },
    { "do", "\012" },
    { "LE", "\033[%p1%dD" },
    { "RI", "\033[%p1%dC" },
    { "DO", "\033[%p1%dB" },
    { "UP", "\033[%p1%dA" },
};

static const struct tc_num tc_nums[] = {
    { "co", 80 }, { "li", 24 }, { "sg", -1 }, { "Co", 256 },
    { "pa", 32767 }, { "ug", -1 },
};

static const char *const tc_flags[] = { "bs", "am", "xn", "ms" };

#define TC_SIZE(a) ((int) (sizeof (a) / sizeof (a)[0]))

int
tgetent(char *bp, const char *name)
{
    (void) bp;
    (void) name;
    return 1;
}

char *
tgetstr(const char *id, char **area)
{
    int i;

    for (i = 0; i < TC_SIZE(tc_strs); i++) {
        if (!strncmp(tc_strs[i].id, id, 2)) {
            const char *v = tc_strs[i].val;
            char *r;

            if (!area || !*area)
                return (char *) v;
            r = *area;
            strcpy(r, v);
            *area += strlen(v) + 1;
            return r;
        }
    }
    return (char *) 0;
}

int
tgetnum(const char *id)
{
    int i;

    for (i = 0; i < TC_SIZE(tc_nums); i++)
        if (!strncmp(tc_nums[i].id, id, 2))
            return tc_nums[i].val;
    return -1;
}

int
tgetflag(const char *id)
{
    int i;

    for (i = 0; i < TC_SIZE(tc_flags); i++)
        if (!strncmp(tc_flags[i], id, 2))
            return 1;
    return 0;
}

/* only "cm" is ever passed: "\033[%i%p1%d;%p2%dH" with p1=row, p2=col */
char *
tgoto(const char *cap, int col, int row)
{
    static char buf[32];

    (void) cap;
    snprintf(buf, sizeof buf, "\033[%d;%dH", row + 1, col + 1);
    return buf;
}

/* only the AF (setaf) capability is expanded: colors 0-7, 8-15, 16-255 */
char *
tparm(const char *cap, ...)
{
    static char buf[64];
    va_list ap;
    int n;

    (void) cap;
    va_start(ap, cap);
    n = va_arg(ap, int);
    va_end(ap);
    if (n < 8)
        snprintf(buf, sizeof buf, "\033[3%dm", n);
    else if (n < 16)
        snprintf(buf, sizeof buf, "\033[9%dm", n - 8);
    else
        snprintf(buf, sizeof buf, "\033[38;5;%dm", n);
    return buf;
}

void
tputs(const char *str, int affcnt, int (*outc)(int))
{
    (void) affcnt;
    for (; str && *str; str++) {
        if (str[0] == '$' && str[1] == '<') { /* skip padding: $<n> */
            const char *e = strchr(str, '>');
            if (e) {
                str = e;
                continue;
            }
        }
        (*outc)((unsigned char) *str);
    }
}

/* ---- 4. stand-ins for macOS-only calls used by report.c ---------------- */

#include <CommonCrypto/CommonDigest.h>

int
backtrace(void **buffer, int size)
{
    (void) buffer;
    (void) size;
    return 0;
}

char **
backtrace_symbols(void *const *buffer, int size)
{
    (void) buffer;
    (void) size;
    return (char **) 0;
}

int
CC_MD4_Init(CC_MD4_CTX *c)
{
    (void) c;
    return 1;
}

int
CC_MD4_Update(CC_MD4_CTX *c, const void *data, unsigned int len)
{
    (void) c;
    (void) data;
    (void) len;
    return 1;
}

int
CC_MD4_Final(unsigned char *md, CC_MD4_CTX *c)
{
    (void) c;
    memset(md, 0, CC_MD4_DIGEST_LENGTH);
    return 1;
}

/* unixmain.c's macOS clipboard helper (port_insert_pastebuf, never called
   here) declares `extern int errno;`, which musl provides only as a macro. */
#undef errno
int errno;

/* ---- 5. clock: America/New_York, as the recorder ran ------------------ */
/*
 * The recorder ran with TZ=America/New_York.  Emscripten would take the
 * zone from the host (the judge's may be UTC), so local time is computed
 * here, with the US daylight-saving rules for each era.
 *
 * time() is pinned to the moment the recorder build is dated (Sat May  2
 * 12:00:00 2026 UTC).  Only two things read the real clock: the patched
 * time_from_yyyymmddhhmmss() copies tm_isdst from localtime(now) before
 * calling mktime() on NETHACK_FIXED_DATETIME, and Lua seeds its string
 * hash with it.  The recordings were made while daylight time was in
 * effect, so a fixed winter datetime comes out an hour earlier in local
 * time; shopkeeper names (ubirthday / 257) depend on that hour.
 */

#include <time.h>

#define NH_JS_NOW ((time_t) 1777723200) /* 2026-05-02 12:00:00 UTC */

time_t
time(time_t *t)
{
    if (t)
        *t = NH_JS_NOW;
    return NH_JS_NOW;
}

static long long
days_from_civil(long long y, unsigned m, unsigned d)
{
    long long era;
    unsigned yoe, doy, doe;

    y -= m <= 2;
    era = (y >= 0 ? y : y - 399) / 400;
    yoe = (unsigned) (y - era * 400);
    doy = (153 * (m + (m > 2 ? -3 : 9)) + 2) / 5 + d - 1;
    doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return era * 146097 + (long long) doe - 719468;
}

static void
civil_from_days(long long z, long long *y, unsigned *m, unsigned *d)
{
    long long era;
    unsigned doe, yoe, doy, mp;

    z += 719468;
    era = (z >= 0 ? z : z - 146096) / 146097;
    doe = (unsigned) (z - era * 146097);
    yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    mp = (5 * doy + 2) / 153;
    *d = doy - (153 * mp + 2) / 5 + 1;
    *m = mp < 10 ? mp + 3 : mp - 9;
    *y = (long long) yoe + era * 400 + (*m <= 2);
}

static int
weekday_of(long long days) /* 0 = Sunday; day 0 (1970-01-01) was a Thursday */
{
    return (int) (((days % 7) + 7 + 4) % 7);
}

static long long
nth_sunday(long long y, unsigned m, int n)
{
    long long first = days_from_civil(y, m, 1);

    return first + (7 - weekday_of(first)) % 7 + 7 * (n - 1);
}

static long long
last_sunday(long long y, unsigned m)
{
    long long last = days_from_civil(m == 12 ? y + 1 : y, m == 12 ? 1 : m + 1, 1) - 1;

    return last - weekday_of(last);
}

/* is daylight time in effect at UTC instant t? */
static int
ny_is_dst(time_t t)
{
    long long y, start, end;
    unsigned m, d;

    civil_from_days((long long) ((t - 5 * 3600) >= 0 ? (t - 5 * 3600) / 86400
                                 : -((-(t - 5 * 3600) + 86399) / 86400)),
                    &y, &m, &d);
    if (y >= 2007) {
        start = nth_sunday(y, 3, 2);
        end = nth_sunday(y, 11, 1);
    } else if (y >= 1987) {
        start = nth_sunday(y, 4, 1);
        end = last_sunday(y, 10);
    } else if (y >= 1967) {
        start = last_sunday(y, 4);
        end = last_sunday(y, 10);
    } else {
        return 0;
    }
    /* starts 02:00 EST (07:00 UTC), ends 02:00 EDT (06:00 UTC) */
    return (long long) t >= start * 86400 + 7 * 3600
           && (long long) t < end * 86400 + 6 * 3600;
}

struct tm *
localtime_r(const time_t *tp, struct tm *tm)
{
    time_t t = *tp;
    int dst = ny_is_dst(t);
    long off = dst ? -4 * 3600L : -5 * 3600L;
    long long lt = (long long) t + off;
    long long days = lt >= 0 ? lt / 86400 : -((-lt + 86399) / 86400);
    long long secs = lt - days * 86400, y;
    unsigned m, d;

    civil_from_days(days, &y, &m, &d);
    memset(tm, 0, sizeof *tm);
    tm->tm_year = (int) (y - 1900);
    tm->tm_mon = (int) m - 1;
    tm->tm_mday = (int) d;
    tm->tm_hour = (int) (secs / 3600);
    tm->tm_min = (int) (secs / 60 % 60);
    tm->tm_sec = (int) (secs % 60);
    tm->tm_wday = weekday_of(days);
    tm->tm_yday = (int) (days - days_from_civil(y, 1, 1));
    tm->tm_isdst = dst;
    tm->__tm_gmtoff = off;
    tm->__tm_zone = dst ? "EDT" : "EST";
    return tm;
}

struct tm *
localtime(const time_t *tp)
{
    static struct tm result;

    return localtime_r(tp, &result);
}

/* macOS (tzcode) semantics: tm_isdst > 0 reads the fields as daylight
   time and == 0 as standard time, even when that is not the zone's rule
   on that date; < 0 lets the date decide.  The struct is normalized. */
time_t
mktime(struct tm *tm)
{
    long long mon = tm->tm_mon, y = (long long) tm->tm_year + 1900;
    long long days, secs;
    time_t t;

    y += mon >= 0 ? mon / 12 : -((11 - mon) / 12);
    mon -= 12 * (mon >= 0 ? mon / 12 : -((11 - mon) / 12));
    days = days_from_civil(y, (unsigned) mon + 1, 1) + (tm->tm_mday - 1);
    secs = days * 86400 + tm->tm_hour * 3600LL + tm->tm_min * 60LL + tm->tm_sec;
    if (tm->tm_isdst > 0) {
        t = (time_t) (secs + 4 * 3600);
    } else if (tm->tm_isdst == 0) {
        t = (time_t) (secs + 5 * 3600);
    } else {
        t = (time_t) (secs + 5 * 3600);
        if (ny_is_dst(t) || ny_is_dst((time_t) (secs + 4 * 3600)))
            t = (time_t) (secs + 4 * 3600);
    }
    localtime_r(&t, tm);
    return t;
}
