from sqlalchemy.orm import Session

from app.models.usuario import Usuario


class UsuarioRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_email(self, email: str) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.email == email).first()

    def get_by_id(self, usuario_id: int) -> Usuario | None:
        return self.db.get(Usuario, usuario_id)

    def create(self, nombre: str, email: str, hashed_password: str) -> Usuario:
        usuario = Usuario(nombre=nombre, email=email, hashed_password=hashed_password)
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def update(
        self,
        usuario: Usuario,
        nombre: str | None = None,
        email: str | None = None,
        activo: bool | None = None,
    ) -> Usuario:
        if nombre is not None:
            usuario.nombre = nombre
        if email is not None:
            usuario.email = email
        if activo is not None:
            usuario.activo = activo
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
