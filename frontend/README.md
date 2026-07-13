# Nexo Préstamos — Frontend

React + Vite + TypeScript + TailwindCSS. Consume la API del backend (`../backend`).

## Desarrollo local

```bash
cp .env.example .env   # apuntar VITE_API_URL al backend
npm install
npm run dev
```

## Estructura

```
src/
  auth/        Contexto de autenticación y rutas protegidas por rol
  components/  Layout compartido
  lib/         Cliente HTTP (axios)
  pages/       Login, registro y dashboards de cliente/analista/admin
  types/       Tipos compartidos con la API
```
