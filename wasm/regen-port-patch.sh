#!/bin/bash
# wasm/regen-port-patch.sh — Rebuild wasm/patches/009-javascript-port.patch
# from edits made in the build tree (.cache/jsbuild/tree).
#
# Workflow: `bash wasm/build.sh prepare`, edit files under
# .cache/jsbuild/tree, then run this script with the edited paths
# (relative to the tree) — or with no arguments to refresh the files the
# patch already touches.  It diffs each file against upstream + the
# recorder patches only, and writes git-style hunks (git apply --recount
# needs `diff --git` headers between files).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
B="${BUILD_DIR:-$ROOT/.cache/jsbuild}"
UPSTREAM="${NETHACK_UPSTREAM:-$ROOT/nethack-c/upstream}"
PATCH="$ROOT/wasm/patches/009-javascript-port.patch"
P="$B/pristine"

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
    while read -r f; do files+=("$f"); done < <(sed -n 's|^diff --git a/\([^ ]*\) .*|\1|p' "$PATCH")
else
    while read -r f; do
        case " ${files[*]} " in *" $f "*) ;; *) files+=("$f") ;; esac
    done < <(sed -n 's|^diff --git a/\([^ ]*\) .*|\1|p' "$PATCH")
fi

rm -rf "$P"
mkdir -p "$P"
rsync -a --exclude='.git' --exclude='*.o' --exclude='*.a' "$UPSTREAM/" "$P/"
G="$B/git-pristine"
rm -rf "$G"
export GIT_DIR="$G" GIT_WORK_TREE="$P"
git init -q
git -c gc.auto=0 add -A
git -c user.email=build@local -c user.name=build commit -q -m baseline
for p in "$ROOT"/nethack-c/patches/*.patch; do
    ( cd "$P" && git apply --recount "$p" 2>/dev/null )
done
unset GIT_DIR GIT_WORK_TREE
rm -rf "$G"

: > "$PATCH.new"
for f in $(printf '%s\n' "${files[@]}" | sort -u); do
    if ! diff -q "$P/$f" "$B/tree/$f" >/dev/null 2>&1; then
        echo "diff --git a/$f b/$f" >> "$PATCH.new"
        diff -u "$P/$f" "$B/tree/$f" \
            | sed -e "1s|^--- .*|--- a/$f|" -e "2s|^+++ .*|+++ b/$f|" >> "$PATCH.new" || true
    fi
done
mv "$PATCH.new" "$PATCH"
rm -rf "$P"
grep -c '^diff --git' "$PATCH" | sed 's/^/files in patch: /'
