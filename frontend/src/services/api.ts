export const API_BASE = "http://localhost:3000";

export async function fetchWeather() {
  const res = await fetch(`${API_BASE}/weather`);
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/weather/insights`);
  return res.json();
}

export async function exportCsv() {
  const res = await fetch(`${API_BASE}/weather/export/csv`);
  return res.blob();
}

export async function exportXlsx() {
  const res = await fetch(`${API_BASE}/weather/export/xlsx`);
  return res.blob();
}
