from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_staff_roles
from app.models.enums import RolStaff
from app.modules.financiadores.repository import FinanciadorRepository
from app.modules.financiadores.schemas import (
    AsignarFinanciador,
    FinanciadorCreate,
    FinanciadorResponse,
    FinanciadorUpdate,
)
from app.modules.financiadores.service import FinanciadorService
from app.modules.financieras.repository import FinancieraRepository
from app.modules.prestamos.repository import PrestamoRepository
from app.modules.prestamos.schemas import PrestamoResponse

router = APIRouter(prefix="/financiadores", tags=["financiadores"])


def get_financiador_service(db: Session = Depends(get_db)) -> FinanciadorService:
    return FinanciadorService(FinanciadorRepository(db), PrestamoRepository(db), FinancieraRepository(db))


@router.post(
    "",
    response_model=FinanciadorResponse,
    status_code=201,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def crear_financiador(
    data: FinanciadorCreate, service: FinanciadorService = Depends(get_financiador_service)
) -> FinanciadorResponse:
    return service.crear(
        financiera_id=data.financiera_id,
        nombre=data.nombre,
        contacto=data.contacto,
        capital_aportado=data.capital_aportado,
        capital_disponible=data.capital_disponible,
        rendimiento_acordado=data.rendimiento_acordado,
        observaciones=data.observaciones,
    )


@router.get(
    "",
    response_model=list[FinanciadorResponse],
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def listar_financiadores(
    service: FinanciadorService = Depends(get_financiador_service),
) -> list[FinanciadorResponse]:
    return service.listar()


@router.get(
    "/{financiador_id}",
    response_model=FinanciadorResponse,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def obtener_financiador(
    financiador_id: int, service: FinanciadorService = Depends(get_financiador_service)
) -> FinanciadorResponse:
    return service.obtener(financiador_id)


@router.put(
    "/{financiador_id}",
    response_model=FinanciadorResponse,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def editar_financiador(
    financiador_id: int,
    data: FinanciadorUpdate,
    service: FinanciadorService = Depends(get_financiador_service),
) -> FinanciadorResponse:
    return service.actualizar(
        financiador_id,
        financiera_id=data.financiera_id,
        nombre=data.nombre,
        contacto=data.contacto,
        capital_aportado=data.capital_aportado,
        capital_disponible=data.capital_disponible,
        rendimiento_acordado=data.rendimiento_acordado,
        observaciones=data.observaciones,
    )


@router.delete(
    "/{financiador_id}",
    response_model=FinanciadorResponse,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def eliminar_financiador(
    financiador_id: int, service: FinanciadorService = Depends(get_financiador_service)
) -> FinanciadorResponse:
    return service.eliminar(financiador_id)


@router.post(
    "/asignar",
    response_model=PrestamoResponse,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def asignar_financiador(
    data: AsignarFinanciador, service: FinanciadorService = Depends(get_financiador_service)
) -> PrestamoResponse:
    return service.asignar_a_prestamo(prestamo_id=data.prestamo_id, financiador_id=data.financiador_id)
