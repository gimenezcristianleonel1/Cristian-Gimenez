from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import ActorCliente, ActorStaff, get_current_actor, get_current_user, require_staff_roles
from app.models.enums import EstadoPrestamo, RolStaff
from app.models.staff import Staff
from app.models.usuario import Usuario
from app.modules.clientes.repository import ClienteRepository
from app.modules.prestamos.repository import PrestamoRepository
from app.modules.prestamos.schemas import (
    EvaluacionCreate,
    PrestamoCreate,
    PrestamoResponse,
    SolicitudStaffCreate,
)
from app.modules.prestamos.service import PrestamoService

router = APIRouter(prefix="/prestamos", tags=["prestamos"])


def get_prestamo_service(db: Session = Depends(get_db)) -> PrestamoService:
    return PrestamoService(PrestamoRepository(db), ClienteRepository(db))


@router.post("", response_model=PrestamoResponse, status_code=201)
def solicitar_prestamo(
    data: PrestamoCreate,
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.solicitar(
        usuario_id=usuario.id,
        monto_solicitado=data.monto_solicitado,
        cantidad_cuotas=data.cantidad_cuotas,
        destino=data.destino,
    )


@router.post(
    "/solicitudes",
    response_model=PrestamoResponse,
    status_code=201,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def crear_solicitud_staff(
    data: SolicitudStaffCreate, service: PrestamoService = Depends(get_prestamo_service)
) -> PrestamoResponse:
    """Carga una solicitud en nombre de un cliente ya existente (staff)."""
    return service.crear_por_staff(
        cliente_id=data.cliente_id,
        monto_solicitado=data.monto_solicitado,
        cantidad_cuotas=data.cantidad_cuotas,
        tasa=data.tasa,
        destino=data.destino,
        observaciones=data.observaciones,
    )


@router.get("/me", response_model=list[PrestamoResponse])
def mis_prestamos(
    usuario: Usuario = Depends(get_current_user),
    service: PrestamoService = Depends(get_prestamo_service),
) -> list[PrestamoResponse]:
    return service.listar_mios(usuario.id)


@router.get(
    "",
    response_model=list[PrestamoResponse],
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR))],
)
def listar_prestamos(
    estado: EstadoPrestamo | None = Query(default=None),
    service: PrestamoService = Depends(get_prestamo_service),
) -> list[PrestamoResponse]:
    return service.listar_todos(estado)


@router.get("/{prestamo_id}", response_model=PrestamoResponse)
def obtener_prestamo(
    prestamo_id: int,
    actor: ActorCliente | ActorStaff = Depends(get_current_actor),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.obtener(prestamo_id, actor)


@router.post("/{prestamo_id}/evaluar", response_model=PrestamoResponse)
def evaluar_prestamo(
    prestamo_id: int,
    data: EvaluacionCreate,
    staff: Staff = Depends(require_staff_roles(RolStaff.ADMINISTRADOR, RolStaff.OPERADOR)),
    service: PrestamoService = Depends(get_prestamo_service),
) -> PrestamoResponse:
    return service.evaluar(
        prestamo_id=prestamo_id,
        aprobado_por_id=staff.id,
        decision=data.decision,
        observaciones=data.observaciones,
    )
