from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_staff, require_staff_roles
from app.models.enums import RolStaff
from app.models.staff import Staff
from app.modules.staff.repository import StaffRepository
from app.modules.staff.schemas import StaffCreate, StaffResponse
from app.modules.staff.service import StaffService

router = APIRouter(prefix="/staff", tags=["staff"])


def get_staff_service(db: Session = Depends(get_db)) -> StaffService:
    return StaffService(StaffRepository(db))


@router.post(
    "",
    response_model=StaffResponse,
    status_code=201,
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def crear_staff(data: StaffCreate, service: StaffService = Depends(get_staff_service)) -> StaffResponse:
    return service.crear(id=data.id, nombre=data.nombre, rol=data.rol)


@router.get("/me", response_model=StaffResponse)
def mi_perfil(staff: Staff = Depends(get_current_staff)) -> StaffResponse:
    return staff


@router.get(
    "",
    response_model=list[StaffResponse],
    dependencies=[Depends(require_staff_roles(RolStaff.ADMINISTRADOR))],
)
def listar_staff(service: StaffService = Depends(get_staff_service)) -> list[StaffResponse]:
    return service.listar()
