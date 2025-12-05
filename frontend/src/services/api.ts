import axios from 'axios'

const BASE =
  (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  withCredentials: true,
})

export async function getCurrent(location?: string) {
  const q = location ? `?location=${encodeURIComponent(location)}` : ''
  const res = await api.get(`/api/weather/current${q}`)
  return res.data
}
