# Auditoría de seguridad de EVOT

Skill oficial: https://github.com/cloudflare/security-audit-skill  
Referencia revisada al preparar la integración: `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`.

## Instalación local en un agente compatible

Desde la raíz del repositorio:

En PowerShell: `./scripts/install-security-audit.ps1`

En Linux/macOS: `bash scripts/install-security-audit.sh`

Ambos scripts ejecutan:
```bash
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit
```

La skill se descarga desde el repositorio externo y puede actualizarse. Revisar los archivos y los permisos antes de ejecutar el instalador. EVOT ignora `.agents/` y `.claude/` para evitar enviar configuraciones locales.

## Alcance sugerido

Auditar el control de acceso por rol, separación de datos por institución, JWT/refresh, registro de estudiantes, solicitudes de diplomas, dependencias, configuración de despliegue y exposición de datos personales.

La skill no sustituye controles del backend. Sus auditorías completas requieren sandbox aislado (sin red externa y sin secretos). No probar contra servicios reales, cuentas de terceros ni MongoDB/Cloudflare/Vercel de producción.

Esta instalación local es independiente del MCP de Cloudflare conectado a ChatGPT.
