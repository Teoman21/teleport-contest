/* CommonDigest.h — stand-in for the JavaScript build.  report.c hashes the
 * game binary with MD4 only when it builds a crash report; there is no
 * binary to hash here, so these succeed and produce zeros. */
#ifndef NH_JS_COMMONDIGEST_H
#define NH_JS_COMMONDIGEST_H
#define CC_MD4_DIGEST_LENGTH 16
typedef struct { int unused; } CC_MD4_CTX;
int CC_MD4_Init(CC_MD4_CTX *c);
int CC_MD4_Update(CC_MD4_CTX *c, const void *data, unsigned int len);
int CC_MD4_Final(unsigned char *md, CC_MD4_CTX *c);
#endif
