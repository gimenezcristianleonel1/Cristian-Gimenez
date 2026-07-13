from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles
from app.models.enums import RolUsuario
from app.modules.financiadores.repository import FinanciadorRepository
from app.modules.financiadores.schemas import AsignarFinanciador, FinanciadorCreate, FinanciadorResponse
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
    dependencies=[Depends(require_roles(RolUsuario.ADMIN))],
)
def crear_financiador(
    data: FinanciadorCreate, service: FinanciadorService = Depends(get_financiador_service)
) -> FinanciadorResponse:
    return service.crear(financiera_id=data.financiera_id, nombre=data.nombre, contacto=data.contacto)


@router.get(
    "",
    response_model=list[FinanciadorResponse],
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def listar_financiadores(
    service: FinanciadorService = Depends(get_financiador_service),
) -> list[FinanciadorResponse]:
    return service.listar()


@router.post(
    "/asignar",
    response_model=PrestamoResponse,
    dependencies=[Depends(require_roles(RolUsuario.ADMIN))],
)
def asignar_financiador(
    data: AsignarFinanciador, service: FinanciadorService = Depends(get_financiador_service)
) -> PrestamoResponse:
    return service.asignar_a_prestamo(prestamo_id=data.prestamo_id, financiador_id=data.financiador_id)
