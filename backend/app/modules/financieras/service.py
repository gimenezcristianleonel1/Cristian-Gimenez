from fastapi import HTTPException, status

from app.models.financiera import Financiera
from app.modules.financieras.repository import FinancieraRepository
from app.modules.financieras.schemas import FinancieraEstadisticas


class FinancieraService:
    def __init__(self, repository: FinancieraRepository) -> None:
        self.repository = repository

    def crear(self, nombre: str, cuit: str, contacto: str, email: str, telefono: str) -> Financiera:
        if self.repository.get_by_cuit(cuit) is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El CUIT ya está registrado")
        return self.repository.create(nombre=nombre, cuit=cuit, contacto=contacto, email=email, telefono=telefono)

    def listar(self) -> list[Financiera]:
        return self.repository.list_all()

    def obtener(self, financiera_id: int) -> Financiera:
        financiera = self.repository.get_by_id(financiera_id)
        if financiera is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financiera no encontrada")
        return financiera

    def estadisticas(self, financiera_id: int) -> FinancieraEstadisticas:
        financiera = self.obtener(financiera_id)
        return FinancieraEstadisticas(
            financiera_id=financiera.id,
            nombre=financiera.nombre,
            prestamos_originados=self.repository.contar_prestamos_originados(financiera_id),
            monto_total_desembolsado=self.repository.monto_total_desembolsado(financiera_id),
            financiadores=financiera.financiadores,
        )
