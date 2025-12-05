import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || ''

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
})


export async function getCurrent(location) {
  const q = location ? `?location=${encodeURIComponent(location)}` : ''
  const res = await api.get(`/api/weather/current${q}`)
  return res.data
}

export async function getHistory(location, days = 2) {
  const q = location ? `?location=${encodeURIComponent(location)}` : ''
  const res = await api.get(`/api/weather/history${q}${q ? '&' : '?'}days=${days}`)
  return res.data
}

export async function getInsights(location) {
  const q = location ? `?location=${encodeURIComponent(location)}` : ''
  const res = await api.get(`/api/insights${q}`)
  return res.data
}

export async function fetchAllData(location = '') {
  const [current, history, insights] = await Promise.all([
    getCurrent(location),
    getHistory(location, 2),
    getInsights(location),
  ])

  return {
    current,
    history: history || [],
    insights,
  }
}