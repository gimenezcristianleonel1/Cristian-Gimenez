export type Destino =
  | 'personal'
  | 'vivienda'
  | 'vehiculo'
  | 'negocio'
  | 'salud'
  | 'educacion'
  | 'otro'

export const DESTINOS: { value: Destino; label: string }[] = [
  { value: 'personal', label: 'Gastos personales' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'negocio', label: 'Negocio propio' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'otro', label: 'Otro' },
]

export type SituacionLaboral = 'relacion_dependencia' | 'autonomo' | 'monotributista' | 'otro'

export const SITUACIONES_LABORALES: { value: SituacionLaboral; label: string }[] = [
  { value: 'relacion_dependencia', label: 'Relación de dependencia' },
  { value: 'autonomo', label: 'Autónomo' },
  { value: 'monotributista', label: 'Monotributista' },
  { value: 'otro', label: 'Otro' },
]

export interface SolicitudFormData {
  monto: number
  cuotas: number
  destino: Destino | ''
  nombre: string
  dni: string
  email: string
  telefono: string
  direccion: string
  password: string
  confirmarPassword: string
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
  direccion: '',
  password: '',
  confirmarPassword: '',
  situacionLaboral: '',
  ingresosMensuales: '',
}
