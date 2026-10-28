#!/bin/sh
set -eu

# Builds both sites into ./public/:
#   ./public/            Quickstart (./content/, ./config.toml)
#   ./public/reference/  Full API reference (./content-reference/,
#                        ./config.toml overridden by ./config-reference.toml)
#
# Usage: ./scripts/build.sh

g_root=$(cd "$(dirname "$0")/.." && pwd)
cd "${g_root}"

rm -rf ./public/
hugo --gc --minify
hugo --gc --minify --config config.toml,config-reference.toml

echo ""
echo "Built ./public/ (quickstart) and ./public/reference/ (full reference)"
