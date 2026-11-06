import { useState } from 'react'
import { accountBalance, fmt, uid } from '../store.js'

export default function Accounts({ data, update }) {
  const { accounts, transactions } = data
  const [name, setName] = useState('')
  const [opening, setOpening] = useState('')

  const add = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    update((d) => ({ ...d, accounts: [...d.accounts, { id: uid(), name: name.trim(), opening: Number(opening) || 0 }] }))
    setName('')
    setOpening('')
  }
  const remove = (acc) => {
    if (accounts.length === 1) return alert('You need at least one account.')
    const used = transactions.some((t) => t.accountId === acc.id)
    if (used && !confirm('This account has transactions. Delete the account and its transactions?')) return
    update((d) => ({
      ...d,
      accounts: d.accounts.filter((a) => a.id !== acc.id),
      transactions: d.transactions.filter((t) => t.accountId !== acc.id),
    }))
  }

  return (
    <>
      <form className="card form-grid" onSubmit={add}>
        <h3 className="span-all">Add account</h3>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bank, Wallet" required /></label>
        <label>Opening balance<input type="number" step="0.01" value={opening} onChange={(e) => setOpening(e.target.value)} /></label>
        <div className="span-all"><button className="btn" type="submit">Add account</button></div>
      </form>

      <div className="grid3">
        {accounts.map((a) => (
          <div className="card stat" key={a.id}>
            <span>{a.name}</span>
            <strong>{fmt(accountBalance(a, transactions))}</strong>
            <button className="link danger" onClick={() => remove(a)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  )
}
