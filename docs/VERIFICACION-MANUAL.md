# EVOT — Verificación manual de fases 1 y 2

Esta rama no utiliza GitHub Actions. Los siguientes controles deben ejecutarse **antes de fusionar a Dev**.

## Verificación local (sin secretos en el repositorio)

```bash
npm ci
npm test
npm run lint
npm run build
```

Node.js compatible con la versión configurada en el proyecto. El comando `npm test` descubre automáticamente los archivos `*.test.js`, incluso en Windows.

## Pruebas funcionales con la API de pruebas de EVOT

1. Registrar un estudiante de prueba. Confirmar alta, inicio de sesión automático y mensajes de error ante correo duplicado.
2. Iniciar sesión con rol `ADMIN`. Verificar las rutas `/admin-dashboard/diplomas`, `/admin-dashboard/students` y `/admin-dashboard/institutions`.
3. En diplomas: consultar listado, buscar por código/programa/documento, avanzar y retroceder páginas.
4. Crear un diploma con datos ficticios y verificar que aparece tras actualizar automáticamente la lista.
5. Abrir detalles del diploma y confirmar que se muestran **sus** datos, no información de ejemplo.
6. Editar el diploma y confirmar el guardado mediante `PUT /diplomas/:id`, sin alterar el número de documento del graduado.
7. Desactivar el diploma de prueba y confirmar que `PATCH /diplomas/:id/deactivate` refleja el resultado esperado.
8. Repetir la consulta con rol `INSTITUCION`; verificar que la API respeta la separación entre instituciones. Intentos sobre datos de otra institución deben ser rechazados **por el backend**.
9. Simular errores HTTP 400/401/403/404/500 y fallos lógicos con `success:false`; comprobar mensajes, reintentos de sesión y ausencia de falsos éxitos.

No utilizar diplomas, identidades o bases de datos reales para estas pruebas.

## Contratos API a confirmar con el equipo de backend

- `GET /diplomas` — ADMIN, colección (`results`, `data`, o arreglo).
- `GET /diplomas/by/institution` — INSTITUCION, colección de su institución.
- `GET /diplomas/:id` — objeto del diploma, con `_id`.
- `POST /diplomas` — creación con `codigoDiploma`, `nombrePrograma`, `nivelPrograma`, `registroPrograma`, `libro`, `fechaGrados`, `numeroDocumento`.
- `PUT /diplomas/:id` — edición de los seis campos académicos, sin modificar al graduado.
- `PATCH /diplomas/:id/deactivate` — desactivación lógica.

**Limitación conocida:** el filtro y la paginación actuales se aplican **sobre los diplomas devueltos por la API**. Si el backend limita los resultados, será necesario implementar paginación y filtros del lado del servidor.

**Bloqueo actual:** sin código y entorno de pruebas del backend no se pueden certificar los contratos ni el control de acceso por institución. No fusionar ni desplegar a producción antes de estas comprobaciones.
