import { useState } from 'react'
import { CATEGORIES, fmt, today, uid } from '../store.js'

const blank = (accounts) => ({
  type: 'expense', amount: '', category: 'Food', accountId: accounts[0]?.id || '',
  date: today(), note: '',
})

export default function Transactions({ data, update }) {
  const { transactions, accounts } = data
  const [form, setForm] = useState(blank(accounts))
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [typeF, setTypeF] = useState('all')
  const [catF, setCatF] = useState('all')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!(amount > 0)) return
    if (editing) {
      update((d) => ({
        ...d,
        transactions: d.transactions.map((t) => (t.id === editing ? { ...t, ...form, amount } : t)),
      }))
    } else {
      update((d) => ({ ...d, transactions: [...d.transactions, { ...form, amount, id: uid() }] }))
    }
    setEditing(null)
    setForm(blank(accounts))
  }

  const edit = (t) => {
    setEditing(t.id)
    setForm({ type: t.type, amount: t.amount, category: t.category, accountId: t.accountId, date: t.date, note: t.note || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const remove = (id) => {
    if (confirm('Delete this transaction?')) {
      update((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) }))
    }
  }

  const shown = transactions
    .filter((t) => (typeF === 'all' || t.type === typeF) && (catF === 'all' || t.category === catF))
    .filter((t) => (t.note || '').toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date))

  const accName = (id) => accounts.find((a) => a.id === id)?.name || '—'

  return (
    <>
      <form className="card form-grid" onSubmit={submit}>
        <h3 className="span-all">{editing ? 'Edit transaction' : 'Add transaction'}</h3>
        <label>Type
          <select value={form.type} onChange={set('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>Amount<input type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} required /></label>
        <label>Category
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Account
          <select value={form.accountId} onChange={set('accountId')} required>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>Date<input type="date" value={form.date} onChange={set('date')} required /></label>
        <label>Note<input value={form.note} onChange={set('note')} /></label>
        <div className="span-all row">
          <button className="btn" type="submit">{editing ? 'Save changes' : 'Add'}</button>
          {editing && <button type="button" className="btn ghost" onClick={() => { setEditing(null); setForm(blank(accounts)) }}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <div className="row wrap">
          <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select value={catF} onChange={(e) => setCatF(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Category</th><th>Account</th><th>Note</th><th className="r">Amount</th><th /></tr>
            </thead>
            <tbody>
              {shown.length === 0 && <tr><td colSpan="6" className="muted">No transactions found.</td></tr>}
              {shown.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{accName(t.accountId)}</td>
                  <td>{t.note}</td>
                  <td className={'r ' + (t.type === 'income' ? 'pos' : 'neg')}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                  </td>
                  <td className="r">
                    <button className="link" onClick={() => edit(t)}>Edit</button>{' '}
                    <button className="link danger" onClick={() => remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
