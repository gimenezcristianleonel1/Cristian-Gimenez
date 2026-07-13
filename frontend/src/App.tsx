import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { ClienteDashboard } from './pages/ClienteDashboard'
import { AnalistaDashboard } from './pages/AnalistaDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import type { Rol } from './types'

const RUTA_POR_ROL: Record<Rol, string> = {
  admin: '/admin',
  analista: '/analista',
  cliente: '/cliente',
}

function Inicio() {
  const { usuario, cargando } = useAuth()
  if (cargando) return null
  if (!usuario) return <Navigate to="/login" replace />
  return <Navigate to={RUTA_POR_ROL[usuario.rol]} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute roles={['cliente']}>
            <Layout>
              <ClienteDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analista"
        element={
          <ProtectedRoute roles={['analista']}>
            <Layout>
              <AnalistaDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
