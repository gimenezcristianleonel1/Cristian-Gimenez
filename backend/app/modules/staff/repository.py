import uuid

from sqlalchemy.orm import Session

from app.models.enums import RolStaff
from app.models.staff import Staff


class StaffRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, id: uuid.UUID, nombre: str, rol: RolStaff) -> Staff:
        staff = Staff(id=id, nombre=nombre, rol=rol)
        self.db.add(staff)
        self.db.commit()
        self.db.refresh(staff)
        return staff

    def get_by_id(self, staff_id: uuid.UUID) -> Staff | None:
        return self.db.get(Staff, staff_id)

    def list_all(self) -> list[Staff]:
        return self.db.query(Staff).order_by(Staff.created_at).all()
