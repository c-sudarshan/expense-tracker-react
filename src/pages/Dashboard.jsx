import { useState } from 'react'
import { getData, saveData } from '../store.js'
import Overview from '../components/Overview.jsx'
import Transactions from '../components/Transactions.jsx'
import Budgets from '../components/Budgets.jsx'
import Accounts from '../components/Accounts.jsx'
import Recurring from '../components/Recurring.jsx'
import Reports from '../components/Reports.jsx'

const TABS = ['Overview', 'Transactions', 'Budgets', 'Accounts', 'Recurring', 'Reports']

export default function Dashboard({ session }) {
  const [data, setData] = useState(() => getData(session.userId))
  const [tab, setTab] = useState('Overview')

  // update(fn): fn receives current data and returns the new data
  const update = (fn) => {
    setData((prev) => {
      const next = fn(prev)
      saveData(session.userId, next)
      return next
    })
  }

  const props = { data, update }
  return (
    <div className="container">
      <h2>Hello, {session.name} 👋</h2>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Overview' && <Overview {...props} />}
      {tab === 'Transactions' && <Transactions {...props} />}
      {tab === 'Budgets' && <Budgets {...props} />}
      {tab === 'Accounts' && <Accounts {...props} />}
      {tab === 'Recurring' && <Recurring {...props} />}
      {tab === 'Reports' && <Reports {...props} />}
    </div>
  )
}
