from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models.enums import EstadoPrestamo, RolUsuario
from app.models.usuario import Usuario
from app.modules.clientes.repository import ClienteRepository
from app.modules.prestamos.repository import PrestamoRepository
from app.modules.prestamos.schemas import EvaluacionCreate, PrestamoCreate, PrestamoResponse
from app.modules.prestamos.service import PrestamoService

router = APIRouter(prefix="/prestamos", tags=["prestamos"])


def get_prestamo_service(db: Session = Depends(get_db)) -> PrestamoService:
    return PrestamoService(PrestamoRepository(db), ClienteRepository(db))


@router.post(
    "",
    response_model=PrestamoResponse,
    status_code=201,
    dependencies=[Depends(require_roles(RolUsuario.CLIENTE))],
)
def solicitar_prestamo(
    data: PrestamoCreate,
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.solicitar(
        usuario_id=usuario.id,
        monto_solicitado=data.monto_solicitado,
        plazo_meses=data.plazo_meses,
        motivo=data.motivo,
    )


@router.get(
    "/me",
    response_model=list[PrestamoResponse],
    dependencies=[Depends(require_roles(RolUsuario.CLIENTE))],
)
def mis_prestamos(
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> list[PrestamoResponse]:
    return service.listar_mios(usuario.id)


@router.get(
    "",
    response_model=list[PrestamoResponse],
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def listar_prestamos(
    estado: EstadoPrestamo | None = Query(default=None),
    service: PrestamoService = Depends(get_prestamo_service),
) -> list[PrestamoResponse]:
    return service.listar_todos(estado)


@router.get("/{prestamo_id}", response_model=PrestamoResponse)
def obtener_prestamo(
    prestamo_id: int,
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.obtener(prestamo_id, usuario)


@router.post(
    "/{prestamo_id}/evaluar",
    response_model=PrestamoResponse,
    dependencies=[Depends(require_roles(RolUsuario.ANALISTA))],
)
def evaluar_prestamo(
    prestamo_id: int,
    data: EvaluacionCreate,
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.evaluar(
        prestamo_id=prestamo_id,
        analista_id=usuario.id,
        decision=data.decision,
        observaciones=data.observaciones,
    )
