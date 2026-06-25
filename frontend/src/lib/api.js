const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

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

  // Exam applications
  createExamApplication: (body) => request('/exams/applications', { method: 'POST', body: JSON.stringify(body) }),
  myExamApplications: () => request('/exams/applications/me'),

  // Admin
  adminStats: () => request('/admin/stats'),
  adminUsers: () => request('/admin/users'),
  adminDeleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  adminChangeRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  adminDiagnosis: () => request('/admin/diagnosis'),
  adminApplications: (params = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString()
    return request(`/admin/applications${search ? `?${search}` : ''}`)
  },
  adminUpdateApplication: (id, body) => request(`/admin/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}