import uuid
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.enums import DecisionEvaluacion, EstadoPrestamo
from app.models.evaluacion import Evaluacion
from app.models.prestamo import Prestamo

ESTADOS_PRESTAMO_ACTIVO = (EstadoPrestamo.APROBADO, EstadoPrestamo.DESEMBOLSADO)


class PrestamoRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        cliente_id: int,
        monto_solicitado: Decimal,
        cantidad_cuotas: int,
        destino: str,
        tasa: Decimal | None = None,
        observaciones: str | None = None,
    ) -> Prestamo:
        prestamo = Prestamo(
            cliente_id=cliente_id,
            monto_solicitado=monto_solicitado,
            cantidad_cuotas=cantidad_cuotas,
            destino=destino,
            tasa=tasa,
            observaciones=observaciones,
            estado=EstadoPrestamo.PENDIENTE,
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
        self, prestamo: Prestamo, aprobado_por_id: uuid.UUID, decision: DecisionEvaluacion, observaciones: str
    ) -> Prestamo:
        evaluacion = Evaluacion(
            prestamo_id=prestamo.id,
            aprobado_por_id=aprobado_por_id,
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

    def asignar_financiador(self, prestamo: Prestamo, financiador_id: int, financiera_id: int) -> Prestamo:
        prestamo.financiador_id = financiador_id
        prestamo.financiera_id = financiera_id
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

    def update(
        self,
        prestamo: Prestamo,
        monto_solicitado: Decimal | None = None,
        cantidad_cuotas: int | None = None,
        tasa: Decimal | None = None,
        destino: str | None = None,
        observaciones: str | None = None,
    ) -> Prestamo:
        if monto_solicitado is not None:
            prestamo.monto_solicitado = monto_solicitado
        if cantidad_cuotas is not None:
            prestamo.cantidad_cuotas = cantidad_cuotas
        if tasa is not None:
            prestamo.tasa = tasa
        if destino is not None:
            prestamo.destino = destino
        if observaciones is not None:
            prestamo.observaciones = observaciones
        self.db.add(prestamo)
        self.db.commit()
        self.db.refresh(prestamo)
        return prestamo

    def delete(self, prestamo: Prestamo) -> None:
        if prestamo.evaluacion is not None:
            self.db.delete(prestamo.evaluacion)
        self.db.delete(prestamo)
        self.db.commit()

    def contar_activos_por_financiador(self, financiador_id: int) -> int:
        return (
            self.db.query(func.count(Prestamo.id))
            .filter(Prestamo.financiador_id == financiador_id)
            .filter(Prestamo.estado.in_(ESTADOS_PRESTAMO_ACTIVO))
            .scalar()
        )
