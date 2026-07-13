from sqlalchemy.orm import Session

from app.models.financiador import Financiador


class FinanciadorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, financiera_id: int, nombre: str, contacto: str) -> Financiador:
        financiador = Financiador(financiera_id=financiera_id, nombre=nombre, contacto=contacto)
        self.db.add(financiador)
        self.db.commit()
        self.db.refresh(financiador)
        return financiador

    def get_by_id(self, financiador_id: int) -> Financiador | None:
        return self.db.get(Financiador, financiador_id)

    def list_all(self) -> list[Financiador]:
        return self.db.query(Financiador).order_by(Financiador.id).all()
