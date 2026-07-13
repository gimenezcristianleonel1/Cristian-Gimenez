import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import RolStaff


class StaffCreate(BaseModel):
    id: uuid.UUID = Field(description="id del usuario ya creado en Supabase Auth (auth.users.id)")
    nombre: str = Field(min_length=2, max_length=150)
    rol: RolStaff


class StaffResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    nombre: str
    rol: RolStaff
    activo: bool
    created_at: datetime
