import uuid
from decimal import Decimal

from fastapi import HTTPException, status

from app.core.deps import ActorCliente, ActorStaff
from app.models.enums import DecisionEvaluacion, EstadoPrestamo
from app.models.prestamo import Prestamo
from app.modules.clientes.repository import ClienteRepository
from app.modules.prestamos.repository import PrestamoRepository


class PrestamoService:
    def __init__(self, repository: PrestamoRepository, cliente_repository: ClienteRepository) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def _cliente_de(self, usuario_id: int) -> int:
        cliente = self.cliente_repository.get_by_usuario_id(usuario_id)
        if cliente is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de cliente no encontrado")
        return cliente.id

    def solicitar(
        self, usuario_id: int, monto_solicitado: Decimal, cantidad_cuotas: int, destino: str
    ) -> Prestamo:
        cliente_id = self._cliente_de(usuario_id)
        return self.repository.create(
            cliente_id=cliente_id,
            monto_solicitado=monto_solicitado,
            cantidad_cuotas=cantidad_cuotas,
            destino=destino,
        )

    def crear_por_staff(
        self,
        cliente_id: int,
        monto_solicitado: Decimal,
        cantidad_cuotas: int,
        tasa: Decimal,
        destino: str,
        observaciones: str | None,
    ) -> Prestamo:
        if self.cliente_repository.get_by_id(cliente_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
        return self.repository.create(
            cliente_id=cliente_id,
            monto_solicitado=monto_solicitado,
            cantidad_cuotas=cantidad_cuotas,
            destino=destino,
            tasa=tasa,
            observaciones=observaciones,
        )

    def listar_mios(self, usuario_id: int) -> list[Prestamo]:
        cliente_id = self._cliente_de(usuario_id)
        return self.repository.list_by_cliente(cliente_id)

    def listar_todos(self, estado: EstadoPrestamo | None) -> list[Prestamo]:
        return self.repository.list_all(estado)

    def obtener(self, prestamo_id: int, actor: ActorCliente | ActorStaff) -> Prestamo:
        prestamo = self.repository.get_by_id(prestamo_id)
        if prestamo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Préstamo no encontrado")

        if isinstance(actor, ActorCliente) and prestamo.cliente.usuario_id != actor.usuario.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No podés ver este préstamo")

        return prestamo

    def evaluar(
        self, prestamo_id: int, operador_id: uuid.UUID, decision: DecisionEvaluacion, observaciones: str
    ) -> Prestamo:
        prestamo = self.repository.get_by_id(prestamo_id)
        if prestamo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Préstamo no encontrado")

        if prestamo.estado != EstadoPrestamo.PENDIENTE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El préstamo ya fue evaluado o no está pendiente",
            )

        return self.repository.registrar_evaluacion(
            prestamo=prestamo, operador_id=operador_id, decision=decision, observaciones=observaciones
        )
