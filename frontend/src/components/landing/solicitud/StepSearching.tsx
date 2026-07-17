import { Loader2 } from 'lucide-react'

interface StepSearchingProps {
  mensaje: string
}

export function StepSearching({ mensaje }: StepSearchingProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-6 py-16 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-accent-600" aria-hidden="true" />
      <div>
        <p className="text-base font-semibold text-navy-900">{mensaje}</p>
        <p className="mt-1 text-sm text-slate-500">No cierres ni recargues esta página.</p>
      </div>
    </div>
  )
}
