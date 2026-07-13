from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.core.security import create_access_token
from app.models.enums import RolUsuario
from app.models.usuario import Usuario
from app.modules.auth.repository import UsuarioRepository
from app.modules.auth.schemas import TokenResponse
from app.modules.auth.service import AuthService
from app.modules.clientes.repository import ClienteRepository
from app.modules.clientes.schemas import ClienteRegistro, ClienteResponse
from app.modules.clientes.service import ClienteService

router = APIRouter(prefix="/clientes", tags=["clientes"])


def get_cliente_service(db: Session = Depends(get_db)) -> ClienteService:
    return ClienteService(ClienteRepository(db), AuthService(UsuarioRepository(db)))


@router.post("/registro", response_model=TokenResponse, status_code=201)
def registrar_cliente(
    data: ClienteRegistro, service: ClienteService = Depends(get_cliente_service)
) -> TokenResponse:
    cliente = service.registrar(
        nombre=data.nombre,
        email=data.email,
        password=data.password,
        dni=data.dni,
        telefono=data.telefono,
        direccion=data.direccion,
    )
    token = create_access_token(subject=str(cliente.usuario.id), role=RolUsuario.CLIENTE.value)
    return TokenResponse(access_token=token, rol=RolUsuario.CLIENTE)


@router.get(
    "/me",
    response_model=ClienteResponse,
    dependencies=[Depends(require_roles(RolUsuario.CLIENTE))],
)
def mi_perfil(
    usuario: Usuario = Depends(get_current_user),
    service: ClienteService = Depends(get_cliente_service),
) -> ClienteResponse:
    return service.obtener_por_usuario(usuario.id)


@router.get(
    "",
    response_model=list[ClienteResponse],
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def listar_clientes(service: ClienteService = Depends(get_cliente_service)) -> list[ClienteResponse]:
    return service.listar()


@router.get(
    "/{cliente_id}",
    response_model=ClienteResponse,
    dependencies=[Depends(require_roles(RolUsuario.ADMIN, RolUsuario.ANALISTA))],
)
def obtener_cliente(
    cliente_id: int, service: ClienteService = Depends(get_cliente_service)
) -> ClienteResponse:
    return service.obtener_por_id(cliente_id)
