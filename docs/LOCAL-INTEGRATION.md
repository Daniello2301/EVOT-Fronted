# Integración local de EVOT

Fecha: 12 de noviembre de 2026.

Carpeta de trabajo: `C:\Fabricato\DEV\others\EVOT_PROJECT\EVOT-Fronted`.

Los cambios locales previos se conservaron en el commit `5cfa50c`, sobre la rama `work/integrate-local-auth-diplomas`. Se integró `origin/fix/phase1-auth-registration-tests` en su commit `5a093e4`, sin modificar `Dev`.

## Resolución de conflictos

- Se conserva la implementación remota de autenticación, validación y paginación de diplomas.
- Se conservan las pantallas locales de graduados, solicitudes de documentos, solicitudes de edición y verificación pública, con sus rutas y navegación.
- El dashboard utiliza una sola navegación, suministrada por su layout.
- La edición utiliza el formulario validado y mantiene la solicitud institucional de permiso; una autorización vencida vuelve a mostrar la solicitud.
- La desactivación conserva la selección del diploma y la restricción visual a ADMIN. El diálogo reutiliza `ConfirmModal` y no permite cerrarse durante una operación pendiente.
- Los permisos efectivos siguen siendo responsabilidad del backend; las restricciones visuales no los sustituyen.

## Comprobaciones

- `node --test`: 21 pruebas aprobadas.
- `npm run lint`: aprobado, sin advertencias.
- `npm run build`: aprobado; el primer intento falló por EPERM del sandbox y la repetición fuera del aislamiento terminó correctamente.
- `npm ci`: completado; auditoría npm con 27 vulnerabilidades (1 baja, 7 moderadas, 17 altas y 2 críticas). No se aplicaron actualizaciones automáticas incompatibles.
- Node utilizado: 24.21.0. Los resultados corresponden a la carpeta correcta, después de la integración.

No se han probado todavía los flujos completos en el navegador contra Atlas. La configuración de acceso mínimo de Atlas y el acceso a la cuenta propietaria de Vercel siguen pendientes.
