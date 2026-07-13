import uuid
from decimal import Decimal

from fastapi import HTTPException, status

from app.models.desembolso import Desembolso
from app.models.enums import EstadoPrestamo
from app.modules.desembolsos.repository import DesembolsoRepository
from app.modules.prestamos.repository import PrestamoRepository


class DesembolsoService:
    def __init__(self, repository: DesembolsoRepository, prestamo_repository: PrestamoRepository) -> None:
        self.repository = repository
        self.prestamo_repository = prestamo_repository

    def registrar(
        self,
        prestamo_id: int,
        registrado_por_id: uuid.UUID,
        monto: Decimal,
        metodo: str,
        observaciones: str | None,
    ) -> Desembolso:
        prestamo = self.prestamo_repository.get_by_id(prestamo_id)
        if prestamo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Préstamo no encontrado")

        if prestamo.estado != EstadoPrestamo.APROBADO:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Solo se puede desembolsar un préstamo aprobado",
            )

        if prestamo.financiador_id is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El préstamo no tiene un financiador asignado",
            )

        desembolso = self.repository.create(
            prestamo_id=prestamo_id,
            registrado_por_id=registrado_por_id,
            monto=monto,
            metodo=metodo,
            observaciones=observaciones,
        )
        self.prestamo_repository.marcar_desembolsado(prestamo)
        return desembolso

    def listar(self) -> list[Desembolso]:
        return self.repository.list_all()

    def obtener(self, desembolso_id: int) -> Desembolso:
        desembolso = self.repository.get_by_id(desembolso_id)
        if desembolso is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Desembolso no encontrado")
        return desembolso
