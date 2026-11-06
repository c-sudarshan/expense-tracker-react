import { useMemo, useState } from 'react'
import { Bars, Donut } from './Charts.jsx'
import { fmt, monthOf, sum } from '../store.js'

export default function Reports({ data }) {
  const { transactions, accounts } = data
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const filtered = useMemo(
    () => transactions.filter((t) => (!from || t.date >= from) && (!to || t.date <= to)),
    [transactions, from, to]
  )

  const monthly = useMemo(() => {
    const m = {}
    filtered.forEach((t) => {
      const k = monthOf(t.date)
      m[k] = m[k] || { label: k, income: 0, expense: 0 }
      m[k][t.type] += Number(t.amount)
    })
    return Object.values(m).sort((a, b) => a.label.localeCompare(b.label)).slice(-12)
  }, [filtered])

  const catItems = useMemo(() => {
    const c = {}
    filtered.filter((t) => t.type === 'expense').forEach((t) => {
      c[t.category] = (c[t.category] || 0) + Number(t.amount)
    })
    return Object.entries(c).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const accName = (id) => accounts.find((a) => a.id === id)?.name || ''
    const rows = [['Date', 'Type', 'Category', 'Account', 'Amount', 'Note']]
    filtered.forEach((t) => rows.push([t.date, t.type, t.category, accName(t.accountId), t.amount, t.note]))
    const csv = rows.map((r) => r.map(esc).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="card">
        <div className="row wrap">
          <label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
          <button className="btn" onClick={exportCsv} disabled={!filtered.length}>Export CSV</button>
          <button className="btn ghost" onClick={() => window.print()}>Print</button>
        </div>
        <p className="muted">
          Income {fmt(sum(filtered, 'income'))} · Expenses {fmt(sum(filtered, 'expense'))} ·
          Net {fmt(sum(filtered, 'income') - sum(filtered, 'expense'))}
        </p>
      </div>
      <div className="grid2">
        <div className="card">
          <h3>Income vs expenses by month</h3>
          <Bars items={monthly} />
          <div className="legend inline">
            <span><i className="dot inc" /> Income</span>
            <span><i className="dot exp" /> Expense</span>
          </div>
        </div>
        <div className="card">
          <h3>Expenses by category</h3>
          <Donut items={catItems} />
        </div>
      </div>
    </>
  )
}
