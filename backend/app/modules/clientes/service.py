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

    def actualizar(
        self,
        cliente_id: int,
        nombre: str | None,
        email: str | None,
        dni: str | None,
        telefono: str | None,
        direccion: str | None,
    ) -> Cliente:
        cliente = self.obtener_por_id(cliente_id)

        if dni is not None and dni != cliente.dni:
            existente = self.repository.get_by_dni(dni)
            if existente is not None and existente.id != cliente_id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El DNI ya está registrado")

        if email is not None and email != cliente.usuario.email:
            existente = self.auth_service.repository.get_by_email(email)
            if existente is not None and existente.id != cliente.usuario_id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")

        if nombre is not None or email is not None:
            self.auth_service.repository.update(cliente.usuario, nombre=nombre, email=email)

        return self.repository.update(cliente, dni=dni, telefono=telefono, direccion=direccion)

    def eliminar(self, cliente_id: int) -> Cliente:
        cliente = self.obtener_por_id(cliente_id)
        self.auth_service.repository.update(cliente.usuario, activo=False)
        return cliente
