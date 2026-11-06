import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import { THEMES, applyTheme, getSession, getTheme, saveTheme, setSession } from './store.js'

export default function App() {
  const [session, setSess] = useState(getSession())
  const [theme, setThemeState] = useState(getTheme())
  const nav = useNavigate()

  const login = (s) => {
    setSession(s)
    setSess(s)
    nav(s.role === 'admin' ? '/admin' : '/dashboard')
  }
  const logout = () => {
    setSession(null)
    setSess(null)
    nav('/')
  }
  const changeTheme = (name) => {
    setThemeState(name)
    saveTheme(name)
    applyTheme(name)
  }

  return (
    <>
      <header className="nav">
        <Link to="/" className="brand">💰 Expense Tracker</Link>
        <nav>
          <Link to="/">Home</Link>
          {!session && (
            <>
              <Link to="/login">User Login</Link>
              <Link to="/admin-login">Admin Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
          {session && (
            <>
              <Link to={session.role === 'admin' ? '/admin' : '/dashboard'}>
                {session.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <a href="#/" onClick={(e) => { e.preventDefault(); logout() }}>Logout</a>
            </>
          )}
          <select
            className="theme-select"
            value={theme}
            onChange={(e) => changeTheme(e.target.value)}
            aria-label="Colour theme"
          >
            {Object.keys(THEMES).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" onLogin={login} />} />
          <Route path="/signup" element={<Auth mode="signup" onLogin={login} />} />
          <Route path="/admin-login" element={<Auth mode="admin" onLogin={login} />} />
          <Route
            path="/dashboard"
            element={session?.role === 'user' ? <Dashboard session={session} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={session?.role === 'admin' ? <Admin /> : <Navigate to="/admin-login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="footer">
        Expense Tracker © 2026 • React + Vite • Data stored in Local Storage
      </footer>
    </>
  )
}
