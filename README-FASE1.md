# EVOT — Fase 1: registro, autenticación y pruebas

La rama `fix/phase1-auth-registration-tests` corrige el registro de estudiantes y centraliza la gestión del access token y de la renovación de sesión.

## Verificación manual (sin GitHub Actions)
```bash
npm ci
npm test
npm run lint
npm run build
```

Antes de fusionar el PR, ejecutar estos comandos en una copia limpia del repositorio y comprobar que todos terminan correctamente. Guardar el resultado de las pruebas y revisar los cambios del PR. El proyecto ya no incluye un workflow de GitHub Actions para esta fase.

Si se configura un despliegue de vista previa en Vercel, verificar allí la navegación y el registro mediante un entorno de pruebas y credenciales ficticias. Una compilación exitosa no sustituye las pruebas contra la API.

## Contratos a validar con la API real
- `POST auth/login` responde `{ usuario: { tokens: { token, refreshToken } } }`.
- `POST auth/refresh` responde `{ token, refreshToken? }`.
- `POST users/student` devuelve éxito 2xx y errores HTTP 4xx o respuestas lógicas `ok:false`.
- Verificar desde el backend los permisos para `diplomas/:codigo/solicitar-documento`.

El refresh token permanece en localStorage por compatibilidad con el backend actual. La migración a cookies HttpOnly, Secure y SameSite exige cambios coordinados de backend, CORS y CSRF. No desplegar sin validación integrada.
