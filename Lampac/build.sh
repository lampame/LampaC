#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

OUTPUT="${OUTPUT:-publish}"
CONFIG="${CONFIG:-Release}"

CLEAN=false
FORMAT=false
extra_args=()
for arg in "$@"; do
  case "$arg" in
    --clean|-C)
      CLEAN=true
      ;;
    --format)
      FORMAT=true
      ;;
    *)
      extra_args+=("$arg")
      ;;
  esac
done

if [[ "$FORMAT" == true ]]; then
  dotnet format NextGen.slnx
  exit 0
fi

if [[ "$CLEAN" == true ]]; then
  while IFS= read -r -d '' d; do
    rm -rf "$d"
  done < <(find "$ROOT" \( -name node_modules -o -name .git \) -prune -o -type d \( -name bin -o -name obj \) -print0)
  exit 0
fi

args=(
  "Core/Core.csproj"
  "-c" "$CONFIG"
  "--self-contained" "false"
  "-o" "$OUTPUT"
)

if [[ -n "${RUNTIME_ID:-}" ]]; then
  args+=("-r" "$RUNTIME_ID")
fi

if ((${#extra_args[@]} > 0)); then
  dotnet publish "${args[@]}" "${extra_args[@]}"
else
  dotnet publish "${args[@]}"
fi
