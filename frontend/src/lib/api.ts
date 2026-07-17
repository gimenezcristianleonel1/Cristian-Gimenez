import axios from 'axios'
import { supabase } from './supabaseClient'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

let staffAccessToken: string | null = null

supabase.auth.getSession().then(({ data }) => {
  staffAccessToken = data.session?.access_token ?? null
})

supabase.auth.onAuthStateChange((_event, session) => {
  staffAccessToken = session?.access_token ?? null
})

api.interceptors.request.use((config) => {
  const clienteToken = localStorage.getItem('token')
  const token = clienteToken ?? staffAccessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function apiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }
  return fallback
}
