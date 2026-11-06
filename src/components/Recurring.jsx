import { useState } from 'react'
import { CATEGORIES, currentMonth, fmt, today, uid } from '../store.js'

export default function Recurring({ data, update }) {
  const { recurring, accounts } = data
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense', category: 'Bills',
    accountId: accounts[0]?.id || '', day: 1,
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const month = currentMonth()
  const todayDay = new Date().getDate()

  const add = (e) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!(amount > 0)) return
    update((d) => ({
      ...d,
      recurring: [...d.recurring, { ...form, amount, day: Number(form.day), id: uid(), lastAdded: '' }],
    }))
    setForm({ ...form, title: '', amount: '' })
  }
  const remove = (id) => update((d) => ({ ...d, recurring: d.recurring.filter((r) => r.id !== id) }))

  const addNow = (r) => {
    update((d) => ({
      ...d,
      transactions: [
        ...d.transactions,
        { id: uid(), type: r.type, amount: r.amount, category: r.category, accountId: r.accountId, date: today(), note: r.title },
      ],
      recurring: d.recurring.map((x) => (x.id === r.id ? { ...x, lastAdded: month } : x)),
    }))
  }

  const due = recurring.filter((r) => r.lastAdded !== month && r.day <= todayDay)

  return (
    <>
      {due.length > 0 && (
        <div className="card notice">
          <strong>🔔 Due this month</strong>
          {due.map((r) => (
            <div className="row between" key={r.id}>
              <span>{r.title} — {fmt(r.amount)} (day {r.day})</span>
              <button className="btn small" onClick={() => addNow(r)}>Add now</button>
            </div>
          ))}
        </div>
      )}

      <form className="card form-grid" onSubmit={add}>
        <h3 className="span-all">Add recurring item</h3>
        <label>Title<input value={form.title} onChange={set('title')} placeholder="Rent, Netflix…" required /></label>
        <label>Amount<input type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} required /></label>
        <label>Type
          <select value={form.type} onChange={set('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>Category
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Account
          <select value={form.accountId} onChange={set('accountId')}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>Day of month<input type="number" min="1" max="28" value={form.day} onChange={set('day')} required /></label>
        <div className="span-all"><button className="btn" type="submit">Add</button></div>
      </form>

      <div className="card">
        <h3>Recurring items</h3>
        {recurring.length === 0 && <p className="muted">Nothing set up yet.</p>}
        <ul className="list">
          {recurring.map((r) => (
            <li key={r.id}>
              <span>{r.title} · {r.category} · day {r.day} {r.lastAdded === month && '✅ added this month'}</span>
              <span>
                <strong className={r.type === 'income' ? 'pos' : 'neg'}>{fmt(r.amount)}</strong>{' '}
                <button className="link danger" onClick={() => remove(r.id)}>Remove</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
