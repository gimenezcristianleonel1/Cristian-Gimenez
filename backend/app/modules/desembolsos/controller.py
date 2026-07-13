from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models.enums import RolUsuario
from app.models.usuario import Usuario
from app.modules.desembolsos.repository import DesembolsoRepository
from app.modules.desembolsos.schemas import DesembolsoCreate, DesembolsoResponse
from app.modules.desembolsos.service import DesembolsoService
from app.modules.prestamos.repository import PrestamoRepository

router = APIRouter(prefix="/desembolsos", tags=["desembolsos"])


def get_desembolso_service(db: Session = Depends(get_db)) -> DesembolsoService:
    return DesembolsoService(DesembolsoRepository(db), PrestamoRepository(db))


@router.post(
    "",
    response_model=DesembolsoResponse,
    status_code=201,
    dependencies=[Depends(require_roles(RolUsuario.ADMIN))],
)
def registrar_desembolso(
    data: DesembolsoCreate,
    usuario: Usuario = Depends(get_current_user),
    service: DesembolsoService = Depends(get_desembolso_service),
) -> DesembolsoResponse:
    return service.registrar(
        prestamo_id=data.prestamo_id,
        registrado_por_id=usuario.id,
        monto=data.monto,
        metodo=data.metodo,
        observaciones=data.observaciones,
    )


@router.get(
    "",
    response_model=list[DesembolsoResponse],
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def listar_desembolsos(
    service: DesembolsoService = Depends(get_desembolso_service),
) -> list[DesembolsoResponse]:
    return service.listar()


@router.get(
    "/{desembolso_id}",
    response_model=DesembolsoResponse,
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def obtener_desembolso(
    desembolso_id: int, service: DesembolsoService = Depends(get_desembolso_service)
) -> DesembolsoResponse:
    return service.obtener(desembolso_id)
