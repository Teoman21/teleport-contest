/* execinfo.h — stand-in for the JavaScript build.  Only used to print a
 * backtrace on panic (PANICTRACE_LIBC); there is no native stack here. */
#ifndef NH_JS_EXECINFO_H
#define NH_JS_EXECINFO_H
int backtrace(void **buffer, int size);
char **backtrace_symbols(void *const *buffer, int size);
#endif
