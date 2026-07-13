from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models.enums import RolUsuario
from app.models.usuario import Usuario
from app.modules.auth.repository import UsuarioRepository
from app.modules.auth.schemas import TokenResponse, UsuarioCreate, UsuarioResponse
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UsuarioRepository(db))


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    return service.autenticar(email=form_data.username, password=form_data.password)


@router.get("/me", response_model=UsuarioResponse)
def me(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    return usuario


@router.post(
    "/usuarios",
    response_model=UsuarioResponse,
    status_code=201,
    dependencies=[Depends(require_roles(RolUsuario.ADMIN))],
)
def crear_usuario_staff(
    data: UsuarioCreate, service: AuthService = Depends(get_auth_service)
) -> Usuario:
    return service.crear_usuario(nombre=data.nombre, email=data.email, password=data.password, rol=data.rol)
