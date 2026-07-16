export type Destino =
  | 'personal'
  | 'vivienda'
  | 'vehiculo'
  | 'negocio'
  | 'salud'
  | 'educacion'
  | 'otro'

export type SituacionLaboral = 'relacion_dependencia' | 'autonomo' | 'monotributista' | 'otro'

export interface SolicitudFormData {
  monto: number
  cuotas: number
  destino: Destino | ''
  nombre: string
  dni: string
  email: string
  telefono: string
  situacionLaboral: SituacionLaboral | ''
  ingresosMensuales: number | ''
}

export const FORM_DATA_INICIAL: SolicitudFormData = {
  monto: 500_000,
  cuotas: 12,
  destino: '',
  nombre: '',
  dni: '',
  email: '',
  telefono: '',
  situacionLaboral: '',
  ingresosMensuales: '',
}

export interface OfertaPreliminar {
  financiera: string
  tasaMensualEstimada: number
  cuotaEstimada: number
}
