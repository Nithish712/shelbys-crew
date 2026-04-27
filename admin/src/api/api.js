const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() { return localStorage.getItem('admin_token') }

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('admin_token')
    window.location.href = '/login'
    return
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

const adminApi = {
  login:    (body)         => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  verify:   ()             => request('/auth/verify'),

  getMenu:  ()             => request('/menu'),
  addItem:  (body)         => request('/menu', { method: 'POST', body: JSON.stringify(body) }),
  updateItem:(id, body)    => request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem:(id)          => request(`/menu/${id}`, { method: 'DELETE' }),

  getCombos:()             => request('/combos'),
  addCombo: (body)         => request('/combos', { method: 'POST', body: JSON.stringify(body) }),
  updateCombo:(id, body)   => request(`/combos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCombo:(id)         => request(`/combos/${id}`, { method: 'DELETE' }),

  getAllQuotes:()           => request('/quotes/all'),
  addQuote: (body)         => request('/quotes', { method: 'POST', body: JSON.stringify(body) }),
  updateQuote:(id, body)   => request(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQuote:(id)         => request(`/quotes/${id}`, { method: 'DELETE' }),
}

export default adminApi
