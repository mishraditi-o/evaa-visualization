const API_BASE = import.meta.env.VITE_EVAA_API_URL || 'http://localhost:3000/api';

export async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

// These endpoint paths are proposed integration points. Match them to the actual
// Express routes before enabling live API mode.
export const evaaApi = {
  preview: (limit = 5000) => fetchJson(`/events/preview?limit=${limit}`),
  metrics: () => fetchJson('/events/metrics'),
};
