export type RolStaff = 'administrador' | 'operador'

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
  activo: boolean
  created_at: string
}

export interface Staff {
  id: string
  nombre: string
  rol: RolStaff
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
  operador_id: string
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
  financiera_id: number | null
  fecha_solicitud: string
  evaluacion: Evaluacion | null
}

export interface Financiera {
  id: number
  nombre: string
  cuit: string
  contacto: string
  email: string
  telefono: string
  activa: boolean
  created_at: string
}

export interface FinancieraEstadisticas {
  financiera_id: number
  nombre: string
  prestamos_originados: number
  monto_total_desembolsado: string
  financiadores: Financiador[]
}

export interface Financiador {
  id: number
  financiera_id: number
  nombre: string
  contacto: string
  capital_aportado: string
  capital_disponible: string
  rendimiento_acordado: string
  observaciones: string | null
  activo: boolean
  created_at: string
}

export interface Desembolso {
  id: number
  prestamo_id: number
  registrado_por_id: string
  monto: string
  metodo: string
  observaciones: string | null
  fecha_desembolso: string
}
