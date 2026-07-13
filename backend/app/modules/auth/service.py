from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.usuario import Usuario
from app.modules.auth.repository import UsuarioRepository
from app.modules.auth.schemas import TokenResponse


class AuthService:
    def __init__(self, repository: UsuarioRepository) -> None:
        self.repository = repository

    def crear_usuario(self, nombre: str, email: str, password: str) -> Usuario:
        if self.repository.get_by_email(email) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado"
            )
        return self.repository.create(nombre=nombre, email=email, hashed_password=hash_password(password))

    def autenticar(self, email: str, password: str) -> TokenResponse:
        credenciales_invalidas = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Email o contraseña incorrectos"
        )
        usuario = self.repository.get_by_email(email)
        if usuario is None or not verify_password(password, usuario.hashed_password):
            raise credenciales_invalidas
        if not usuario.activo:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")

        token = create_access_token(subject=str(usuario.id), role="cliente")
        return TokenResponse(access_token=token)
