import uuid

from fastapi import HTTPException, status

from app.models.enums import RolStaff
from app.models.staff import Staff
from app.modules.staff.repository import StaffRepository


class StaffService:
    def __init__(self, repository: StaffRepository) -> None:
        self.repository = repository

    def crear(self, id: uuid.UUID, nombre: str, rol: RolStaff) -> Staff:
        if self.repository.get_by_id(id) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Ese usuario ya tiene un perfil de staff"
            )
        return self.repository.create(id=id, nombre=nombre, rol=rol)

    def listar(self) -> list[Staff]:
        return self.repository.list_all()
