from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.modules.auth.controller import router as auth_router
from app.modules.clientes.controller import router as clientes_router
from app.modules.desembolsos.controller import router as desembolsos_router
from app.modules.financiadores.controller import router as financiadores_router
from app.modules.prestamos.controller import router as prestamos_router

settings = get_settings()

app = FastAPI(
    title="Nexo Préstamos API",
    description=(
        "API para gestión de préstamos: solicitud, evaluación, aprobación, "
        "asignación de financiador y registro de desembolso. No administra cobranza."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(clientes_router)
app.include_router(prestamos_router)
app.include_router(financiadores_router)
app.include_router(desembolsos_router)
