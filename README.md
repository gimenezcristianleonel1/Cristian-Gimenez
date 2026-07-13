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
backend/    API FastAPI (ver backend/README.md)
frontend/   SPA React (ver frontend/README.md)
```

## Flujo de negocio

1. Cliente solicita préstamo.
2. Analista evalúa (aprueba o rechaza) la solicitud.
3. Si se aprueba, un Admin asigna un financiador.
4. Admin registra el desembolso.

## Desarrollo local

```bash
docker compose up --build
```

Backend en `http://localhost:8000` (docs en `/docs`), frontend en `http://localhost:5173`.
