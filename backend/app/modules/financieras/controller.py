from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_staff_roles
from app.models.enums import RolStaff
from app.modules.financieras.repository import FinancieraRepository
from app.modules.financieras.schemas import FinancieraCreate, FinancieraEstadisticas, FinancieraResponse
from app.modules.financieras.service import FinancieraService

router = APIRouter(prefix="/financieras", tags=["financieras"])


def get_financiera_service(db: Session = Depends(get_db)) -> FinancieraService:
    return FinancieraService(FinancieraRepository(db))


@router.post(
    "",
    response_model=FinancieraResponse,
    status_code=201,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def crear_financiera(
    data: FinancieraCreate, service: FinancieraService = Depends(get_financiera_service)
) -> FinancieraResponse:
    return service.crear(
        nombre=data.nombre, cuit=data.cuit, contacto=data.contacto, email=data.email, telefono=data.telefono
    )


@router.get(
    "",
    response_model=list[FinancieraResponse],
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def listar_financieras(
    service: FinancieraService = Depends(get_financiera_service),
) -> list[FinancieraResponse]:
    return service.listar()


@router.get(
    "/{financiera_id}",
    response_model=FinancieraResponse,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def obtener_financiera(
    financiera_id: int, service: FinancieraService = Depends(get_financiera_service)
) -> FinancieraResponse:
    return service.obtener(financiera_id)


@router.get(
    "/{financiera_id}/estadisticas",
    response_model=FinancieraEstadisticas,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def estadisticas_financiera(
    financiera_id: int, service: FinancieraService = Depends(get_financiera_service)
) -> FinancieraEstadisticas:
    return service.estadisticas(financiera_id)
