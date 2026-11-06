import { useState } from 'react'
import { CATEGORIES, currentMonth, fmt, monthOf, uid } from '../store.js'

export default function Budgets({ data, update }) {
  const { budgets, transactions } = data
  const [month, setMonth] = useState(currentMonth())
  const [category, setCategory] = useState('Food')
  const [limit, setLimit] = useState('')

  const add = (e) => {
    e.preventDefault()
    const l = Number(limit)
    if (!(l > 0)) return
    update((d) => {
      const others = d.budgets.filter((b) => !(b.month === month && b.category === category))
      return { ...d, budgets: [...others, { id: uid(), month, category, limit: l }] }
    })
    setLimit('')
  }
  const remove = (id) => update((d) => ({ ...d, budgets: d.budgets.filter((b) => b.id !== id) }))

  const rows = budgets
    .filter((b) => b.month === month)
    .map((b) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === b.category && monthOf(t.date) === month)
        .reduce((s, t) => s + Number(t.amount), 0)
      return { ...b, spent, pct: Math.min(100, (spent / b.limit) * 100) }
    })

  return (
    <>
      <form className="card form-grid" onSubmit={add}>
        <h3 className="span-all">Set a budget</h3>
        <label>Month<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} required /></label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.filter((c) => c !== 'Salary').map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Limit<input type="number" min="0" step="0.01" value={limit} onChange={(e) => setLimit(e.target.value)} required /></label>
        <div className="span-all"><button className="btn" type="submit">Save budget</button></div>
      </form>

      <div className="card">
        <h3>Budgets for {month}</h3>
        {rows.length === 0 && <p className="muted">No budgets set for this month.</p>}
        {rows.map((b) => (
          <div key={b.id} className="budget">
            <div className="row between">
              <strong>{b.category}</strong>
              <span>
                {fmt(b.spent)} / {fmt(b.limit)}{' '}
                <button className="link danger" onClick={() => remove(b.id)}>Remove</button>
              </span>
            </div>
            <div className="progress">
              <div className={'fill' + (b.spent > b.limit ? ' over' : b.pct > 80 ? ' warn' : '')} style={{ width: b.pct + '%' }} />
            </div>
            {b.spent > b.limit && <small className="error">Over budget by {fmt(b.spent - b.limit)}</small>}
          </div>
        ))}
      </div>
    </>
  )
}
