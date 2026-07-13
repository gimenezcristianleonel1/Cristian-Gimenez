import enum


class RolUsuario(str, enum.Enum):
    ADMIN = "admin"
    ANALISTA = "analista"
    CLIENTE = "cliente"


class EstadoPrestamo(str, enum.Enum):
    SOLICITADO = "solicitado"
    EN_EVALUACION = "en_evaluacion"
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
    DESEMBOLSADO = "desembolsado"


class DecisionEvaluacion(str, enum.Enum):
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
