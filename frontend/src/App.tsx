import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { StaffAuthProvider } from './auth/StaffAuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { StaffProtectedRoute } from './auth/StaffProtectedRoute'
import { ClienteLayout } from './components/ClienteLayout'
import { StaffLayout } from './components/StaffLayout'
import { LandingPage } from './pages/LandingPage'
import { AccesoPage } from './pages/AccesoPage'
import { LoginPage } from './pages/LoginPage'
import { StaffLoginPage } from './pages/StaffLoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { ClienteDashboard } from './pages/ClienteDashboard'
import { OperadorDashboard } from './pages/OperadorDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { FinanciadoresPage } from './pages/FinanciadoresPage'
import { FinancierasPage } from './pages/FinancierasPage'
import { DesembolsosPage } from './pages/DesembolsosPage'
import { ClientesPage } from './pages/ClientesPage'
import { SimuladorPage } from './pages/SimuladorPage'
import { SolicitudesPage } from './pages/SolicitudesPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/acceso" element={<AccesoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/simulador" element={<SimuladorPage />} />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute>
            <ClienteLayout>
              <ClienteDashboard />
            </ClienteLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/operador"
        element={
          <StaffProtectedRoute roles={['operador']}>
            <StaffLayout>
              <OperadorDashboard />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/administrador"
        element={
          <StaffProtectedRoute roles={['administrador']}>
            <StaffLayout>
              <AdminDashboard />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/administrador/financiadores"
        element={
          <StaffProtectedRoute roles={['administrador']}>
            <StaffLayout>
              <FinanciadoresPage />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/administrador/clientes"
        element={
          <StaffProtectedRoute roles={['administrador']}>
            <StaffLayout>
              <ClientesPage />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/administrador/financieras"
        element={
          <StaffProtectedRoute roles={['administrador']}>
            <StaffLayout>
              <FinancierasPage />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/administrador/desembolsos"
        element={
          <StaffProtectedRoute roles={['administrador']}>
            <StaffLayout>
              <DesembolsosPage />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/solicitudes"
        element={
          <StaffProtectedRoute roles={['administrador', 'operador']}>
            <StaffLayout>
              <SolicitudesPage />
            </StaffLayout>
          </StaffProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <StaffAuthProvider>
        <AppRoutes />
      </StaffAuthProvider>
    </AuthProvider>
  )
}
