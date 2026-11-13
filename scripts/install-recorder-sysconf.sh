#!/bin/bash
# install-recorder-sysconf.sh — Give the locally built C recorder the
# sysconf file it needs to start.
#
# nethack-c/macosx-minimal (and linux-minimal) never install sysconf, and
# NetHack 5.0 exits with "Unable to open SYSCF_FILE." without one. This
# copies upstream's sys/unix/sysconf with two changes:
#   - WIZARDS=*  so playmode:debug sessions get wizard mode
#   - GDBPATH, GREPPATH and PANICTRACE_* commented out; on macOS those
#     paths don't exist and NetHack shows an error screen at startup
# With it, scripts/verify-rerecord.mjs reproduces the public sessions.
#
# Run after every bash nethack-c/build-recorder.sh (which deletes
# nethack-c/recorder/ and so removes this file).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/nethack-c/upstream/sys/unix/sysconf"
DEST="$ROOT/nethack-c/recorder/install/games/lib/nethackdir/sysconf"

[ -f "$SRC" ] || { echo "missing $SRC (populate nethack-c/upstream first)" >&2; exit 1; }
[ -d "$(dirname "$DEST")" ] || { echo "recorder not built; run bash nethack-c/build-recorder.sh" >&2; exit 1; }

sed -e 's/^WIZARDS=root games$/WIZARDS=*/' \
    -e 's/^\(GDBPATH=\)/#\1/' \
    -e 's/^\(GREPPATH=\)/#\1/' \
    -e 's/^\(PANICTRACE_[A-Z]*=\)/#\1/' \
    "$SRC" > "$DEST"
chmod 600 "$DEST"
echo "wrote $DEST"
