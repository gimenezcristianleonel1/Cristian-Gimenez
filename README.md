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
2. Analista evalúa (aprueba o rechaza) la solicitud.
3. Si se aprueba, un Admin asigna un financiador.
4. Admin registra el desembolso.

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

- `DATABASE_URL`: connection string de Supabase (Project Settings → Database → Connection string). `JWT_SECRET_KEY` se genera automáticamente.
- `CORS_ORIGINS`: URL del frontend en Vercel (ej. `https://nexo-prestamos.vercel.app`).

**Frontend (Vercel):** importar el repo apuntando el "Root Directory" a `frontend/`. Vercel detecta Vite automáticamente; `vercel.json` agrega el rewrite necesario para que las rutas de React Router funcionen al refrescar. Variable a completar:

- `VITE_API_URL`: URL pública del backend en Render.

## Primer usuario Admin

El sistema no expone un endpoint público para crear administradores (los crea otro Admin desde `/auth/usuarios`). Para el primer Admin, insertarlo directamente en la base:

```sql
INSERT INTO usuarios (nombre, email, hashed_password, rol, activo)
VALUES ('<nombre>', '<email>', '<hash-bcrypt>', 'ADMIN', true);
```

El hash se genera con `passlib` (`hash_password()` en `backend/app/core/security.py`), por ejemplo corriendo `python -c "from app.core.security import hash_password; print(hash_password('...'))"` dentro del entorno del backend.
