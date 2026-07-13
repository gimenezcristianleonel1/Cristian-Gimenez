from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.desembolso import Desembolso
from app.models.financiera import Financiera
from app.models.prestamo import Prestamo


class FinancieraRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, nombre: str, cuit: str, contacto: str, email: str, telefono: str) -> Financiera:
        financiera = Financiera(nombre=nombre, cuit=cuit, contacto=contacto, email=email, telefono=telefono)
        self.db.add(financiera)
        self.db.commit()
        self.db.refresh(financiera)
        return financiera

    def get_by_id(self, financiera_id: int) -> Financiera | None:
        return self.db.get(Financiera, financiera_id)

    def get_by_cuit(self, cuit: str) -> Financiera | None:
        return self.db.query(Financiera).filter(Financiera.cuit == cuit).first()

    def list_all(self) -> list[Financiera]:
        return self.db.query(Financiera).order_by(Financiera.id).all()

    def contar_prestamos_originados(self, financiera_id: int) -> int:
        return (
            self.db.query(func.count(Prestamo.id))
            .filter(Prestamo.financiera_id == financiera_id)
            .scalar()
        )

    def monto_total_desembolsado(self, financiera_id: int) -> Decimal:
        total = (
            self.db.query(func.coalesce(func.sum(Desembolso.monto), 0))
            .join(Prestamo, Prestamo.id == Desembolso.prestamo_id)
            .filter(Prestamo.financiera_id == financiera_id)
            .scalar()
        )
        return Decimal(total)
