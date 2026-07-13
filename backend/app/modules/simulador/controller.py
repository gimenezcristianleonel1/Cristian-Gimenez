from fastapi import APIRouter

from app.modules.simulador.schemas import SimulacionRequest, SimulacionResponse
from app.modules.simulador.service import SimuladorService

router = APIRouter(prefix="/simulador", tags=["simulador"])

service = SimuladorService()


@router.post("/prestamos", response_model=SimulacionResponse)
def simular_prestamo(data: SimulacionRequest) -> SimulacionResponse:
    """Simula un préstamo por sistema francés. No persiste nada en la base."""
    return service.simular(monto=data.monto, tasa=data.tasa, cantidad_cuotas=data.cantidad_cuotas)
