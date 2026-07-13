from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.financiador import Financiador


class FinanciadorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        financiera_id: int,
        nombre: str,
        contacto: str,
        capital_aportado: Decimal,
        capital_disponible: Decimal,
        rendimiento_acordado: Decimal,
        observaciones: str | None,
    ) -> Financiador:
        financiador = Financiador(
            financiera_id=financiera_id,
            nombre=nombre,
            contacto=contacto,
            capital_aportado=capital_aportado,
            capital_disponible=capital_disponible,
            rendimiento_acordado=rendimiento_acordado,
            observaciones=observaciones,
        )
        self.db.add(financiador)
        self.db.commit()
        self.db.refresh(financiador)
        return financiador

    def get_by_id(self, financiador_id: int) -> Financiador | None:
        return self.db.get(Financiador, financiador_id)

    def list_all(self) -> list[Financiador]:
        return self.db.query(Financiador).order_by(Financiador.id).all()

    def update(self, financiador: Financiador, **campos) -> Financiador:
        for campo, valor in campos.items():
            if valor is not None:
                setattr(financiador, campo, valor)
        self.db.add(financiador)
        self.db.commit()
        self.db.refresh(financiador)
        return financiador

    def dar_de_baja(self, financiador: Financiador) -> Financiador:
        financiador.activo = False
        self.db.add(financiador)
        self.db.commit()
        self.db.refresh(financiador)
        return financiador
