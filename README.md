# Nexo Préstamos

Plataforma de gestión de préstamos: solicitud, evaluación, aprobación, asignación de financiador y registro de desembolso. **No administra cobranza de cuotas** (se realiza fuera del sistema).

## Stack

- **Backend**: FastAPI + SQLAlchemy + Alembic + Pydantic (Clean Architecture)
- **Frontend**: React + Vite + TailwindCSS
- **Base de datos**: PostgreSQL (Supabase)
- **Infraestructura**: Docker / docker-compose
- **Deploy**: Render (backend) + Vercel (frontend)

## Estructura

```
backend/    API FastAPI
frontend/   SPA React (ver frontend/README.md)
```

## Flujo de negocio

1. Cliente solicita préstamo.
2. Operador evalúa (aprueba o rechaza) la solicitud.
3. Si se aprueba, un Administrador asigna un financiador.
4. Administrador registra el desembolso.

## Autenticación

Hay dos esquemas de identidad, independientes entre sí:

- **Cliente**: login propio (email/password con JWT emitido por nuestra API). Se autorregistra en `/registro`.
- **Staff (Administrador / Operador)**: login vía **Supabase Auth** (`/staff/login`). El backend verifica el JWT que emite Supabase; nunca vemos ni guardamos su contraseña. No hay recuperación de contraseña propia — la maneja Supabase.

## Desarrollo local

```bash
cp backend/.env.example backend/.env      # completar DATABASE_URL de Supabase
docker compose up --build                 # backend + Postgres local

cp frontend/.env.example frontend/.env
cd frontend && npm install && npm run dev
```

Backend en `http://localhost:8000` (docs en `/docs`), frontend en `http://localhost:5173`.

## Deploy

**Backend (Render):** el repo incluye `render.yaml` (Blueprint). Al crear el servicio desde este repo, Render arma la imagen con `backend/Dockerfile`, que corre las migraciones de Alembic antes de levantar la API. Variables a completar en el dashboard de Render:

- `DATABASE_URL`: connection string de Supabase con **connection pooling activado** (Project Settings → Database → Connection string → pestaña "Transaction pooler"; la conexión directa no funciona desde Render por IPv6). `JWT_SECRET_KEY` se genera automáticamente.
- `SUPABASE_URL`: URL del proyecto (Project Settings → API), ej. `https://xxxxx.supabase.co`. Se usa para verificar los tokens del staff contra las claves públicas (JWKS) del proyecto.
- `SUPABASE_JWT_SECRET`: Project Settings → API → JWT Settings → JWT Secret. Solo se usa como respaldo en proyectos con firma legacy (HS256); igual hay que completarlo porque el setting es requerido.
- `CORS_ORIGINS`: URL del frontend en Vercel (ej. `https://nexo-prestamos.vercel.app`).

**Frontend (Vercel):** importar el repo apuntando el "Root Directory" a `frontend/`. Vercel detecta Vite automáticamente; `vercel.json` agrega el rewrite necesario para que las rutas de React Router funcionen al refrescar. Variables a completar:

- `VITE_API_URL`: URL pública del backend en Render.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Project Settings → API.

## Primer usuario Administrador

El staff se autentica con Supabase Auth, así que el primer Administrador se crea en dos pasos:

1. Crear el usuario en **Supabase Dashboard → Authentication → Users → Add user** (con email y password). No lo crees insertando filas a mano en `auth.users`: Supabase no lo soporta y puede dejar la instancia inconsistente.
2. Vincular ese usuario (por su `id`, un UUID) con un perfil de staff:

```sql
INSERT INTO staff (id, nombre, rol, activo)
VALUES ('<uuid-del-usuario-en-auth.users>', '<nombre>', 'ADMINISTRADOR', true);
```

De ahí en adelante, ese Administrador puede dar de alta al resto del staff desde `POST /staff` (una vez que cada nueva persona ya se creó su usuario en Supabase Auth).
