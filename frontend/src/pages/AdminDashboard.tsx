import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Banknote, CheckCircle2, FileText, Users, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { api } from '../lib/api'
import { formatearMonto } from '../lib/creditMath'
import type { Cliente, Desembolso, EstadoPrestamo, Prestamo } from '../types'

const ESTADO_LABEL: Record<EstadoPrestamo, string> = {
  pendiente: 'Pendientes',
  en_evaluacion: 'En evaluación',
  aprobado: 'Aprobados',
  rechazado: 'Rechazados',
  desembolsado: 'Desembolsados',
}

const ESTADO_BAR_COLOR: Record<EstadoPrestamo, string> = {
  pendiente: 'bg-amber-400',
  en_evaluacion: 'bg-amber-400',
  aprobado: 'bg-emerald-accent-500',
  rechazado: 'bg-red-400',
  desembolsado: 'bg-sky-400',
}

interface Evento {
  fecha: Date
  cliente: string
  accion: string
}

function saludo(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const MotionLink = motion(Link)

function StatCard({
  icon: Icon,
  etiqueta,
  valor,
  delay,
  to,
}: {
  icon: typeof FileText
  etiqueta: string
  valor: string
  delay: number
  to: string
}) {
  return (
    <MotionLink
      to={to}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, delay }}
      className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-emerald-accent-300 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-accent-50">
        <Icon className="h-5 w-5 text-emerald-accent-600" aria-hidden="true" />
      </div>
      <p className="mt-4 text-2xl font-bold text-navy-900">{valor}</p>
      <p className="text-sm text-slate-500">{etiqueta}</p>
    </MotionLink>
  )
}

export function AdminDashboard() {
  const { staff } = useStaffAuth()
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [desembolsos, setDesembolsos] = useState<Desembolso[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const [prestamosRes, clientesRes, desembolsosRes] = await Promise.all([
        api.get<Prestamo[]>('/prestamos'),
        api.get<Cliente[]>('/clientes'),
        api.get<Desembolso[]>('/desembolsos'),
      ])
      setPrestamos(prestamosRes.data)
      setClientes(clientesRes.data)
      setDesembolsos(desembolsosRes.data)
      setCargando(false)
    }
    cargar()
  }, [])

  const nombreCliente = useMemo(() => {
    const mapa = new Map(clientes.map((c) => [c.id, c.usuario.nombre]))
    return (id: number) => mapa.get(id) ?? `Cliente #${id}`
  }, [clientes])

  const stats = useMemo(() => {
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

    const pendientes = prestamos.filter((p) => p.estado === 'pendiente').length

    const aprobadosEsteMes = prestamos
      .filter((p) => p.evaluacion?.decision === 'aprobado' && new Date(p.evaluacion.fecha_evaluacion) >= inicioMes)
      .reduce((acc, p) => acc + Number(p.monto_solicitado), 0)

    const desembolsosPendientes = prestamos.filter(
      (p) => p.estado === 'aprobado' && p.financiador_id !== null,
    ).length

    return { pendientes, aprobadosEsteMes, desembolsosPendientes }
  }, [prestamos])

  const solicitudesPorMes = useMemo(() => {
    const meses: { label: string; value: number }[] = []
    const ahora = new Date()
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const siguiente = new Date(ahora.getFullYear(), ahora.getMonth() - i + 1, 1)
      const cantidad = prestamos.filter((p) => {
        const f = new Date(p.fecha_solicitud)
        return f >= fecha && f < siguiente
      }).length
      meses.push({ label: fecha.toLocaleDateString('es-AR', { month: 'short' }), value: cantidad })
    }
    return meses
  }, [prestamos])

  const porEstado = useMemo(() => {
    const conteos: Record<EstadoPrestamo, number> = {
      pendiente: 0,
      en_evaluacion: 0,
      aprobado: 0,
      rechazado: 0,
      desembolsado: 0,
    }
    for (const p of prestamos) conteos[p.estado]++
    const total = prestamos.length || 1
    return (Object.keys(conteos) as EstadoPrestamo[])
      .filter((e) => e !== 'en_evaluacion')
      .map((estado) => ({ estado, cantidad: conteos[estado], porcentaje: (conteos[estado] / total) * 100 }))
  }, [prestamos])

  const actividadReciente = useMemo(() => {
    const eventos: Evento[] = []
    for (const p of prestamos) {
      eventos.push({ fecha: new Date(p.fecha_solicitud), cliente: nombreCliente(p.cliente_id), accion: 'Solicitud creada' })
      if (p.evaluacion) {
        eventos.push({
          fecha: new Date(p.evaluacion.fecha_evaluacion),
          cliente: nombreCliente(p.cliente_id),
          accion: p.evaluacion.decision === 'aprobado' ? 'Crédito aprobado' : 'Solicitud rechazada',
        })
      }
    }
    for (const d of desembolsos) {
      const prestamo = prestamos.find((p) => p.id === d.prestamo_id)
      eventos.push({
        fecha: new Date(d.fecha_desembolso),
        cliente: prestamo ? nombreCliente(prestamo.cliente_id) : `Préstamo #${d.prestamo_id}`,
        accion: 'Desembolso realizado',
      })
    }
    return eventos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()).slice(0, 8)
  }, [prestamos, desembolsos, nombreCliente])

  const maxMes = Math.max(1, ...solicitudesPorMes.map((m) => m.value))

  if (cargando) return <p className="text-sm text-slate-500">Cargando...</p>

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          {saludo()}, {staff?.nombre?.split(' ')[0] ?? ''}
        </h1>
        <p className="text-sm text-slate-500">Resumen de actividad de hoy.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          etiqueta="Solicitudes pendientes"
          valor={String(stats.pendientes)}
          delay={0}
          to="/solicitudes"
        />
        <StatCard
          icon={Users}
          etiqueta="Clientes registrados"
          valor={String(clientes.length)}
          delay={0.05}
          to="/administrador/clientes"
        />
        <StatCard
          icon={CheckCircle2}
          etiqueta="Créditos aprobados este mes"
          valor={formatearMonto(stats.aprobadosEsteMes)}
          delay={0.1}
          to="/solicitudes"
        />
        <StatCard
          icon={Banknote}
          etiqueta="Desembolsos pendientes"
          valor={String(stats.desembolsosPendientes)}
          delay={0.15}
          to="/administrador/desembolsos"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy-900">Solicitudes por mes</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {solicitudesPorMes.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.value / maxMes) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full rounded-t-md bg-emerald-accent-500"
                  />
                </div>
                <span className="text-xs capitalize text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy-900">Créditos por estado</h2>
          <div className="mt-6 flex flex-col gap-4">
            {porEstado.map((item) => (
              <div key={item.estado}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{ESTADO_LABEL[item.estado]}</span>
                  <span className="font-medium text-navy-900">{item.cantidad}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.porcentaje}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${ESTADO_BAR_COLOR[item.estado]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-navy-900">Últimas actividades</h2>
        {actividadReciente.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Todavía no hay movimientos.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Acción</th>
                  <th className="py-2">Hora</th>
                </tr>
              </thead>
              <tbody>
                {actividadReciente.map((ev, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-4 font-medium text-navy-900">{ev.cliente}</td>
                    <td className="py-2 pr-4 text-slate-600">
                      {ev.accion === 'Solicitud rechazada' ? (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {ev.accion}
                        </span>
                      ) : (
                        ev.accion
                      )}
                    </td>
                    <td className="py-2 text-slate-500">
                      {ev.fecha.toLocaleDateString('es-AR')} {ev.fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
