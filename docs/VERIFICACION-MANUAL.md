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

## Panel completo (rama `feat/frontend-cobertura-backend`)

Ejecutar contra el entorno de pruebas, con datos ficticios, en 375 px (móvil), 768 px (tableta) y ≥ 1280 px (escritorio).

**Común**
- Por debajo de 1024 px el botón de menú abre y cierra la barra lateral. También se cierra al navegar, con Escape y al tocar el fondo.
- El menú de usuario muestra el nombre y el rol. "Cerrar sesión" lleva al login.
- "Cambiar contraseña" valida los campos. Al terminar cierra la sesión y el login muestra un aviso.
- Abrir por URL una sección de otro rol (p. ej. `/admin-dashboard/users` como INSTITUCION) redirige al inicio.
- En móvil las tablas se ven como tarjetas, sin desplazamiento horizontal.

**INSTITUCION**
1. Con un usuario recién creado (sin institución), cualquier sección redirige a "Registra tu institución". Al completar el alta se habilita el panel sin volver a iniciar sesión.
2. Mi institución: el código es de solo lectura. Se guardan nombre, ciudad, departamento, resolución y fecha.
3. Registrar graduado. Si el documento ya existe, se muestra el registro existente y no aparece un error.
4. Registrar diploma para ese graduado. Después, el graduado aparece en "Graduados".
5. Solicitudes de documentos:
   - El filtro de estado funciona.
   - "Ver" muestra el detalle.
   - "Aprobar" rechaza archivos que no son PDF y archivos de más de 10 MB. La fecha de vencimiento va desde mañana hasta 3 meses: el backend solo acepta `aaaa-mm-dd` y la toma como medianoche UTC.
   - "Rechazar" pide confirmación.
   - "Descargar PDF" descarga el documento aprobado (ver la nota sobre Cloudinary).

**ADMIN**
1. Usuarios:
   - Los filtros y la paginación funcionan.
   - "Nuevo usuario" solo ofrece Institución y Administrador.
   - Activar o desactivar pide confirmación. No hay acción sobre la propia cuenta.
2. Instituciones: los filtros, la edición (incluido el código) y activar o desactivar funcionan.
3. Graduados:
   - El filtro de rango de registro exige "desde" y "hasta", e incluye el último día.
   - Editar, desactivar y reactivar funcionan.
4. Solicitudes de edición: aprobar muestra hasta cuándo es editable el diploma, y rechazar también funciona.
5. El inicio muestra los totales reales y la bandeja de pendientes. Si un servicio falla, aparece "—" con la opción "Reintentar".

**Requisito para aprobar y descargar:** el backend necesita credenciales reales de Cloudinary. Con los valores de ejemplo del `.env` (`tu_api_key`), aprobar responde 500.

**Nota sobre la descarga del PDF:**
- `GET solicitudes-documento/:id/descargar` responde con un 302 hacia una URL firmada de Cloudinary. El navegador la sigue con una petición CORS.
- Si Cloudinary no envía `Access-Control-Allow-Origin`, la descarga falla y la pantalla muestra un aviso.
- En ese caso, la solución recomendada en el backend es que el endpoint devuelva `{ url }` en JSON, para que el frontend abra la URL firmada directamente.
