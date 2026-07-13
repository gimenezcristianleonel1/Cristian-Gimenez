from sqlalchemy.orm import Session

from app.models.cliente import Cliente


class ClienteRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_dni(self, dni: str) -> Cliente | None:
        return self.db.query(Cliente).filter(Cliente.dni == dni).first()

    def get_by_id(self, cliente_id: int) -> Cliente | None:
        return self.db.get(Cliente, cliente_id)

    def get_by_usuario_id(self, usuario_id: int) -> Cliente | None:
        return self.db.query(Cliente).filter(Cliente.usuario_id == usuario_id).first()

    def list_all(self) -> list[Cliente]:
        return self.db.query(Cliente).order_by(Cliente.id).all()

    def create(self, usuario_id: int, dni: str, telefono: str, direccion: str) -> Cliente:
        cliente = Cliente(usuario_id=usuario_id, dni=dni, telefono=telefono, direccion=direccion)
        self.db.add(cliente)
        self.db.commit()
        self.db.refresh(cliente)
        return cliente
