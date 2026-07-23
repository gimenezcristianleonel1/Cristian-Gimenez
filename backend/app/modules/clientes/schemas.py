from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.auth.schemas import UsuarioResponse


class ClienteRegistro(BaseModel):
    nombre: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    dni: str = Field(min_length=5, max_length=20)
    telefono: str = Field(min_length=5, max_length=30)
    direccion: str = Field(min_length=5, max_length=255)


class ClienteUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    dni: str | None = Field(default=None, min_length=5, max_length=20)
    telefono: str | None = Field(default=None, min_length=5, max_length=30)
    direccion: str | None = Field(default=None, min_length=5, max_length=255)


class ClienteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dni: str
    telefono: str
    direccion: str
    created_at: datetime
    usuario: UsuarioResponse
