# EVOT Frontend

Aplicacion React/Vite para la consulta publica y el panel de administracion de diplomas.

## Requisitos

- Node.js 18 o superior.
- El backend de EVOT disponible en una URL accesible.

## Configuracion

1. Copia `.env.example` como `.env`.
2. Define `VITE_API_BASE_URL` con la URL de la API, sin barra final.

Configuracion local esperada:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

El valor se incorpora durante el build de Vite. Para produccion debe configurarse antes de ejecutar `npm run build`.

## Ejecucion

```bash
npm install
npm run dev
```

## Verificacion

```bash
npm run lint
npm run build
```
