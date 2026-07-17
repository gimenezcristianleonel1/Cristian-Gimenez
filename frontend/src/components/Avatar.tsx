function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function Avatar({ nombre, className = 'h-9 w-9 text-sm' }: { nombre: string; className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-accent-600 font-semibold text-white ${className}`}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </div>
  )
}
