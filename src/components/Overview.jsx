import { Donut } from './Charts.jsx'
import { accountBalance, currentMonth, fmt, monthOf, sum } from '../store.js'

export default function Overview({ data }) {
  const { transactions, accounts } = data
  const month = currentMonth()
  const monthTx = transactions.filter((t) => monthOf(t.date) === month)
  const income = sum(monthTx, 'income')
  const expense = sum(monthTx, 'expense')
  const totalBalance = accounts.reduce((s, a) => s + accountBalance(a, transactions), 0)

  const byCat = {}
  monthTx.filter((t) => t.type === 'expense').forEach((t) => {
    byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount)
  })
  const items = Object.entries(byCat)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <>
      <div className="grid4">
        <div className="card stat"><span>Total balance</span><strong>{fmt(totalBalance)}</strong></div>
        <div className="card stat"><span>Income ({month})</span><strong className="pos">{fmt(income)}</strong></div>
        <div className="card stat"><span>Expenses ({month})</span><strong className="neg">{fmt(expense)}</strong></div>
        <div className="card stat"><span>Savings ({month})</span><strong>{fmt(income - expense)}</strong></div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Spending by category</h3>
          <Donut items={items} />
        </div>
        <div className="card">
          <h3>Recent transactions</h3>
          {recent.length === 0 && <p className="muted">No transactions yet. Add one from the Transactions tab.</p>}
          <ul className="list">
            {recent.map((t) => (
              <li key={t.id}>
                <span>{t.date} · {t.category}{t.note ? ` · ${t.note}` : ''}</span>
                <strong className={t.type === 'income' ? 'pos' : 'neg'}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
