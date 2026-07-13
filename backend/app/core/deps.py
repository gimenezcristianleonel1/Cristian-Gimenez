import uuid
from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token, decode_supabase_token
from app.models.enums import RolStaff
from app.models.staff import Staff
from app.models.usuario import Usuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
bearer_scheme = HTTPBearer(auto_error=False)

CREDENCIALES_INVALIDAS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No se pudo validar la credencial",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    """Autenticación de Cliente: JWT propio, emitido por /auth/login."""
    payload = decode_access_token(token)
    if payload is None or payload.get("sub") is None:
        raise CREDENCIALES_INVALIDAS

    usuario = db.get(Usuario, int(payload["sub"]))
    if usuario is None or not usuario.activo:
        raise CREDENCIALES_INVALIDAS
    return usuario


def get_current_staff(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Staff:
    """Autenticación de staff (Administrador/Operador): JWT emitido por Supabase Auth."""
    if credentials is None:
        raise CREDENCIALES_INVALIDAS

    payload = decode_supabase_token(credentials.credentials)
    if payload is None or payload.get("sub") is None:
        raise CREDENCIALES_INVALIDAS

    try:
        staff_id = uuid.UUID(payload["sub"])
    except ValueError:
        raise CREDENCIALES_INVALIDAS

    staff = db.get(Staff, staff_id)
    if staff is None or not staff.activo:
        raise CREDENCIALES_INVALIDAS
    return staff


def require_staff_roles(*roles: RolStaff):
    def dependency(staff: Staff = Depends(get_current_staff)) -> Staff:
        if staff.rol not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para realizar esta acción",
            )
        return staff

    return dependency


@dataclass
class ActorCliente:
    usuario: Usuario


@dataclass
class ActorStaff:
    staff: Staff


def get_current_actor(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> ActorCliente | ActorStaff:
    """Para endpoints que puede consultar tanto un Cliente (dueño del recurso)
    como el staff interno, sin importar cuál de los dos esquemas de JWT trajo."""
    if credentials is None:
        raise CREDENCIALES_INVALIDAS
    token = credentials.credentials

    payload = decode_access_token(token)
    if payload is not None and payload.get("sub") is not None:
        usuario = db.get(Usuario, int(payload["sub"]))
        if usuario is not None and usuario.activo:
            return ActorCliente(usuario)

    payload = decode_supabase_token(token)
    if payload is not None and payload.get("sub") is not None:
        try:
            staff = db.get(Staff, uuid.UUID(payload["sub"]))
        except ValueError:
            staff = None
        if staff is not None and staff.activo:
            return ActorStaff(staff)

    raise CREDENCIALES_INVALIDAS
