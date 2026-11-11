# Instalación local al proyecto (no global). No ejecutar automáticamente.
$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $repoRoot
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  throw 'Se requiere Node.js/npm (npx).'
}
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit
if ($LASTEXITCODE -ne 0) { throw "Falló la instalación (código $LASTEXITCODE)." }
