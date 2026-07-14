import enum


class RolStaff(str, enum.Enum):
    ADMINISTRADOR = "administrador"
    OPERADOR = "operador"


class EstadoPrestamo(str, enum.Enum):
    PENDIENTE = "pendiente"
    EN_EVALUACION = "en_evaluacion"
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
    DESEMBOLSADO = "desembolsado"


class DecisionEvaluacion(str, enum.Enum):
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
