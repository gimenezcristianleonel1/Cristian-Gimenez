from fastapi import HTTPException, status

from app.models.enums import EstadoPrestamo
from app.models.financiador import Financiador
from app.models.prestamo import Prestamo
from app.modules.financieras.repository import FinancieraRepository
from app.modules.financiadores.repository import FinanciadorRepository
from app.modules.prestamos.repository import PrestamoRepository


class FinanciadorService:
    def __init__(
        self,
        repository: FinanciadorRepository,
        prestamo_repository: PrestamoRepository,
        financiera_repository: FinancieraRepository,
    ) -> None:
        self.repository = repository
        self.prestamo_repository = prestamo_repository
        self.financiera_repository = financiera_repository

    def crear(self, financiera_id: int, nombre: str, contacto: str) -> Financiador:
        financiera = self.financiera_repository.get_by_id(financiera_id)
        if financiera is None or not financiera.activa:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financiera no disponible")

        return self.repository.create(financiera_id=financiera_id, nombre=nombre, contacto=contacto)

    def listar(self) -> list[Financiador]:
        return self.repository.list_all()

    def asignar_a_prestamo(self, prestamo_id: int, financiador_id: int) -> Prestamo:
        prestamo = self.prestamo_repository.get_by_id(prestamo_id)
        if prestamo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Préstamo no encontrado")

        if prestamo.estado != EstadoPrestamo.APROBADO:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Solo se puede asignar financiador a un préstamo aprobado",
            )

        financiador = self.repository.get_by_id(financiador_id)
        if financiador is None or not financiador.activo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financiador no disponible")

        return self.prestamo_repository.asignar_financiador(
            prestamo, financiador_id, financiador.financiera_id
        )
