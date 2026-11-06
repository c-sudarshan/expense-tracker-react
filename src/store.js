const read = (k, d) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : d
  } catch {
    return d
  }
}
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

// Demo admin account (client-side only app, so this is not real security)
export const ADMIN = { email: 'admin@expense.com', password: 'admin123' }

export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Health',
  'Entertainment', 'Education', 'Travel', 'Salary', 'Other',
]

export const THEMES = {
  Teal: '#0d9488',
  Red: '#dc2626',
  Blue: '#2563eb',
  'Dark blue': '#1e3a8a',
  Green: '#16a34a',
  'Light green': '#65a30d',
  Violet: '#7c3aed',
  Orange: '#ea580c',
  Pink: '#db2777',
  Rose: '#e11d48',
  Amber: '#d97706',
}

export const getTheme = () => read('et_theme', 'Teal')
export const saveTheme = (t) => write('et_theme', t)
export const applyTheme = (name) => {
  document.documentElement.style.setProperty('--primary', THEMES[name] || THEMES.Teal)
}

export const getUsers = () => read('et_users', [])
export const saveUsers = (u) => write('et_users', u)

export const getSession = () => read('et_session', null)
export const setSession = (s) => {
  if (s) write('et_session', s)
  else localStorage.removeItem('et_session')
}

export const emptyData = () => ({
  transactions: [],
  budgets: [],
  accounts: [{ id: uid(), name: 'Cash', opening: 0 }],
  recurring: [],
})
export const getData = (userId) => {
  const d = read('et_data_' + userId, null)
  return d ? { ...emptyData(), ...d } : emptyData()
}
export const saveData = (userId, d) => write('et_data_' + userId, d)
export const deleteUserData = (userId) => localStorage.removeItem('et_data_' + userId)

export const fmt = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

export const today = () => new Date().toISOString().slice(0, 10)
export const monthOf = (date) => date.slice(0, 7)
export const currentMonth = () => today().slice(0, 7)

export const accountBalance = (acc, transactions) =>
  Number(acc.opening || 0) +
  transactions
    .filter((t) => t.accountId === acc.id)
    .reduce((s, t) => s + (t.type === 'income' ? 1 : -1) * Number(t.amount), 0)

export const sum = (list, type) =>
  list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0)
