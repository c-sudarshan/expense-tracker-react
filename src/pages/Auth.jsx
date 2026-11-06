import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ADMIN, getUsers, saveUsers, uid, emptyData, saveData } from '../store.js'

export default function Auth({ mode, onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (mode === 'admin') {
      if (email === ADMIN.email && password === ADMIN.password) {
        return onLogin({ role: 'admin', name: 'Admin' })
      }
      return setError('Invalid admin credentials.')
    }

    const users = getUsers()
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.')
      if (password.length < 6) return setError('Password must be at least 6 characters.')
      if (users.some((u) => u.email === email)) return setError('Email already registered.')
      const user = { id: uid(), name: form.name.trim(), email, password, createdAt: new Date().toISOString() }
      saveUsers([...users, user])
      saveData(user.id, emptyData())
      return onLogin({ role: 'user', userId: user.id, name: user.name })
    }

    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) return setError('Invalid email or password.')
    onLogin({ role: 'user', userId: user.id, name: user.name })
  }

  const title = { login: 'User Login', signup: 'Create Account', admin: 'Admin Login' }[mode]

  return (
    <div className="container narrow">
      <form className="card" onSubmit={submit}>
        <h2>{title}</h2>
        {mode === 'signup' && (
          <label>Name<input value={form.name} onChange={set('name')} required /></label>
        )}
        <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
        <label>Password<input type="password" value={form.password} onChange={set('password')} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">{title}</button>
        {mode === 'login' && <p className="muted">No account? <Link to="/signup">Sign up</Link></p>}
        {mode === 'signup' && <p className="muted">Already registered? <Link to="/login">Login</Link></p>}
        {mode === 'admin' && (
          <p className="muted">Demo admin: {ADMIN.email} / {ADMIN.password}</p>
        )}
      </form>
    </div>
  )
}
