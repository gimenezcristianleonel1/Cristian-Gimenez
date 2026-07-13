from fastapi import HTTPException, status

from app.models.cliente import Cliente
from app.modules.auth.service import AuthService
from app.modules.clientes.repository import ClienteRepository


class ClienteService:
    def __init__(self, repository: ClienteRepository, auth_service: AuthService) -> None:
        self.repository = repository
        self.auth_service = auth_service

    def registrar(
        self, nombre: str, email: str, password: str, dni: str, telefono: str, direccion: str
    ) -> Cliente:
        if self.repository.get_by_dni(dni) is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El DNI ya está registrado")

        usuario = self.auth_service.crear_usuario(nombre=nombre, email=email, password=password)
        return self.repository.create(
            usuario_id=usuario.id, dni=dni, telefono=telefono, direccion=direccion
        )

    def obtener_por_usuario(self, usuario_id: int) -> Cliente:
        cliente = self.repository.get_by_usuario_id(usuario_id)
        if cliente is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de cliente no encontrado")
        return cliente

    def obtener_por_id(self, cliente_id: int) -> Cliente:
        cliente = self.repository.get_by_id(cliente_id)
        if cliente is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
        return cliente

    def listar(self) -> list[Cliente]:
        return self.repository.list_all()
