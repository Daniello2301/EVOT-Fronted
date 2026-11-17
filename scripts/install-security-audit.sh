#!/usr/bin/env bash
# Instala Cloudflare security-audit solo en el repositorio actual.
# Revisar el código del proveedor antes de ejecutarlo; no usar en CI.
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
if ! command -v npx >/dev/null 2>&1; then
  echo 'Se requiere Node.js/npm (npx).' >&2
  exit 1
fi
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit
