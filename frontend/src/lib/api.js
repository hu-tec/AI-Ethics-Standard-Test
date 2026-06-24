const BASE = 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('ai_ethics_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '서버 오류가 발생했습니다.')
  return data
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Diagnosis
  saveDiagnosis: (body) => request('/diagnosis/save', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: () => request('/diagnosis/history'),
}
