export type Rol = 'admin' | 'analista' | 'cliente'

export type EstadoPrestamo =
  | 'solicitado'
  | 'en_evaluacion'
  | 'aprobado'
  | 'rechazado'
  | 'desembolsado'

export type DecisionEvaluacion = 'aprobado' | 'rechazado'

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
  activo: boolean
  created_at: string
}

export interface Cliente {
  id: number
  dni: string
  telefono: string
  direccion: string
  created_at: string
  usuario: Usuario
}

export interface Evaluacion {
  id: number
  analista_id: number
  decision: DecisionEvaluacion
  observaciones: string
  fecha_evaluacion: string
}

export interface Prestamo {
  id: number
  cliente_id: number
  monto_solicitado: string
  plazo_meses: number
  motivo: string
  estado: EstadoPrestamo
  financiador_id: number | null
  fecha_solicitud: string
  evaluacion: Evaluacion | null
}

export interface Financiador {
  id: number
  nombre: string
  contacto: string
  activo: boolean
  created_at: string
}

export interface Desembolso {
  id: number
  prestamo_id: number
  registrado_por_id: number
  monto: string
  metodo: string
  observaciones: string | null
  fecha_desembolso: string
}
