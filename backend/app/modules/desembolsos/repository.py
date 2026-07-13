import uuid
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.desembolso import Desembolso


class DesembolsoRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        prestamo_id: int,
        registrado_por_id: uuid.UUID,
        monto: Decimal,
        metodo: str,
        observaciones: str | None,
    ) -> Desembolso:
        desembolso = Desembolso(
            prestamo_id=prestamo_id,
            registrado_por_id=registrado_por_id,
            monto=monto,
            metodo=metodo,
            observaciones=observaciones,
        )
        self.db.add(desembolso)
        self.db.commit()
        self.db.refresh(desembolso)
        return desembolso

    def get_by_id(self, desembolso_id: int) -> Desembolso | None:
        return self.db.get(Desembolso, desembolso_id)

    def get_by_prestamo_id(self, prestamo_id: int) -> Desembolso | None:
        return self.db.query(Desembolso).filter(Desembolso.prestamo_id == prestamo_id).first()

    def list_all(self) -> list[Desembolso]:
        return self.db.query(Desembolso).order_by(Desembolso.id.desc()).all()
