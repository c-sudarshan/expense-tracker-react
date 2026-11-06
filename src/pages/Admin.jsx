import { useState } from 'react'
import { deleteUserData, fmt, getData, getUsers, saveUsers, sum } from '../store.js'

export default function Admin() {
  const [users, setUsers] = useState(getUsers())
  const [tick, setTick] = useState(0) // forces re-read of user data after deletes

  const rows = users.map((u) => {
    const d = getData(u.id)
    return { ...u, count: d.transactions.length, income: sum(d.transactions, 'income'), expense: sum(d.transactions, 'expense'), tx: d.transactions }
  })

  const totals = {
    users: rows.length,
    tx: rows.reduce((s, r) => s + r.count, 0),
    income: rows.reduce((s, r) => s + r.income, 0),
    expense: rows.reduce((s, r) => s + r.expense, 0),
  }

  const allTx = rows
    .flatMap((r) => r.tx.map((t) => ({ ...t, user: r.name })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)

  const removeUser = (u) => {
    if (!confirm(`Delete ${u.name} and all their data?`)) return
    const next = users.filter((x) => x.id !== u.id)
    saveUsers(next)
    deleteUserData(u.id)
    setUsers(next)
    setTick(tick + 1)
  }

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <div className="grid4">
        <div className="card stat"><span>Users</span><strong>{totals.users}</strong></div>
        <div className="card stat"><span>Transactions</span><strong>{totals.tx}</strong></div>
        <div className="card stat"><span>Total income</span><strong className="pos">{fmt(totals.income)}</strong></div>
        <div className="card stat"><span>Total expenses</span><strong className="neg">{fmt(totals.expense)}</strong></div>
      </div>

      <div className="card">
        <h3>Users</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th className="r">Transactions</th><th className="r">Income</th><th className="r">Expenses</th><th /></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="7" className="muted">No users yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.createdAt?.slice(0, 10)}</td>
                  <td className="r">{r.count}</td>
                  <td className="r pos">{fmt(r.income)}</td>
                  <td className="r neg">{fmt(r.expense)}</td>
                  <td className="r"><button className="link danger" onClick={() => removeUser(r)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Latest transactions (all users)</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>User</th><th>Category</th><th>Note</th><th className="r">Amount</th></tr></thead>
            <tbody>
              {allTx.length === 0 && <tr><td colSpan="5" className="muted">No transactions yet.</td></tr>}
              {allTx.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td><td>{t.user}</td><td>{t.category}</td><td>{t.note}</td>
                  <td className={'r ' + (t.type === 'income' ? 'pos' : 'neg')}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
