/* curses.h — minimal stand-in for the JavaScript build (wasm/build.sh).
 * win/tty/termcap.c includes <curses.h> only for the COLOR_* numbers and
 * the tparm() declaration; the values are ncurses' (RGB order). */
#ifndef NH_JS_CURSES_H
#define NH_JS_CURSES_H
#ifndef TRUE
#define TRUE 1
#endif
#ifndef FALSE
#define FALSE 0
#endif
#define COLOR_BLACK 0
#define COLOR_RED 1
#define COLOR_GREEN 2
#define COLOR_YELLOW 3
#define COLOR_BLUE 4
#define COLOR_MAGENTA 5
#define COLOR_CYAN 6
#define COLOR_WHITE 7
extern char *tparm(const char *, ...);
#endif
