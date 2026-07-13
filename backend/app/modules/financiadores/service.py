from decimal import Decimal

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

    def _validar_financiera(self, financiera_id: int) -> None:
        financiera = self.financiera_repository.get_by_id(financiera_id)
        if financiera is None or not financiera.activa:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financiera no disponible")

    def crear(
        self,
        financiera_id: int,
        nombre: str,
        contacto: str,
        capital_aportado: Decimal,
        capital_disponible: Decimal,
        rendimiento_acordado: Decimal,
        observaciones: str | None,
    ) -> Financiador:
        self._validar_financiera(financiera_id)
        return self.repository.create(
            financiera_id=financiera_id,
            nombre=nombre,
            contacto=contacto,
            capital_aportado=capital_aportado,
            capital_disponible=capital_disponible,
            rendimiento_acordado=rendimiento_acordado,
            observaciones=observaciones,
        )

    def listar(self) -> list[Financiador]:
        return self.repository.list_all()

    def obtener(self, financiador_id: int) -> Financiador:
        financiador = self.repository.get_by_id(financiador_id)
        if financiador is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financiador no encontrado")
        return financiador

    def actualizar(
        self,
        financiador_id: int,
        financiera_id: int | None,
        nombre: str | None,
        contacto: str | None,
        capital_aportado: Decimal | None,
        capital_disponible: Decimal | None,
        rendimiento_acordado: Decimal | None,
        observaciones: str | None,
    ) -> Financiador:
        financiador = self.obtener(financiador_id)

        if financiera_id is not None:
            self._validar_financiera(financiera_id)

        aportado_final = capital_aportado if capital_aportado is not None else financiador.capital_aportado
        disponible_final = (
            capital_disponible if capital_disponible is not None else financiador.capital_disponible
        )
        if disponible_final > aportado_final:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="El capital disponible no puede ser mayor al capital aportado",
            )

        return self.repository.update(
            financiador,
            financiera_id=financiera_id,
            nombre=nombre,
            contacto=contacto,
            capital_aportado=capital_aportado,
            capital_disponible=capital_disponible,
            rendimiento_acordado=rendimiento_acordado,
            observaciones=observaciones,
        )

    def eliminar(self, financiador_id: int) -> Financiador:
        financiador = self.obtener(financiador_id)
        prestamos_activos = self.prestamo_repository.contar_activos_por_financiador(financiador_id)
        if prestamos_activos > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No se puede eliminar: el financiador tiene préstamos activos",
            )
        return self.repository.dar_de_baja(financiador)

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
