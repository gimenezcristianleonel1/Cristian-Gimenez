import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-4">
      <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Nexo Préstamos</h1>
      <Link
        to="/login"
        className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
      >
        Comenzar
      </Link>
    </div>
  )
}
