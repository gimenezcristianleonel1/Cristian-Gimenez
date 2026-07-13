from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.enums import DecisionEvaluacion, EstadoPrestamo
from app.models.evaluacion import Evaluacion
from app.models.prestamo import Prestamo


class PrestamoRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, cliente_id: int, monto_solicitado: Decimal, plazo_meses: int, motivo: str) -> Prestamo:
        prestamo = Prestamo(
            cliente_id=cliente_id,
            monto_solicitado=monto_solicitado,
            plazo_meses=plazo_meses,
            motivo=motivo,
            estado=EstadoPrestamo.SOLICITADO,
        )
        self.db.add(prestamo)
        self.db.commit()
        self.db.refresh(prestamo)
        return prestamo

    def get_by_id(self, prestamo_id: int) -> Prestamo | None:
        return self.db.get(Prestamo, prestamo_id)

    def list_by_cliente(self, cliente_id: int) -> list[Prestamo]:
        return (
            self.db.query(Prestamo)
            .filter(Prestamo.cliente_id == cliente_id)
            .order_by(Prestamo.id.desc())
            .all()
        )

    def list_all(self, estado: EstadoPrestamo | None = None) -> list[Prestamo]:
        query = self.db.query(Prestamo)
        if estado is not None:
            query = query.filter(Prestamo.estado == estado)
        return query.order_by(Prestamo.id.desc()).all()

    def registrar_evaluacion(
        self, prestamo: Prestamo, analista_id: int, decision: DecisionEvaluacion, observaciones: str
    ) -> Prestamo:
        evaluacion = Evaluacion(
            prestamo_id=prestamo.id,
            analista_id=analista_id,
            decision=decision,
            observaciones=observaciones,
        )
        prestamo.estado = (
            EstadoPrestamo.APROBADO if decision == DecisionEvaluacion.APROBADO else EstadoPrestamo.RECHAZADO
        )
        self.db.add(evaluacion)
        self.db.add(prestamo)
        self.db.commit()
        self.db.refresh(prestamo)
        return prestamo

    def asignar_financiador(self, prestamo: Prestamo, financiador_id: int) -> Prestamo:
        prestamo.financiador_id = financiador_id
        self.db.add(prestamo)
        self.db.commit()
        self.db.refresh(prestamo)
        return prestamo

    def marcar_desembolsado(self, prestamo: Prestamo) -> Prestamo:
        prestamo.estado = EstadoPrestamo.DESEMBOLSADO
        self.db.add(prestamo)
        self.db.commit()
        self.db.refresh(prestamo)
        return prestamo
