export const PALETTE = [
  '#0d9488', '#2563eb', '#7c3aed', '#ea580c', '#db2777',
  '#16a34a', '#d97706', '#dc2626', '#0891b2', '#64748b',
]

export function Donut({ items }) {
  const total = items.reduce((s, i) => s + i.value, 0)
  if (!total) return <p className="muted">No data yet.</p>
  let acc = 0
  const stops = items.map((it, i) => {
    const start = (acc / total) * 100
    acc += it.value
    const end = (acc / total) * 100
    return `${PALETTE[i % PALETTE.length]} ${start}% ${end}%`
  })
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ background: `conic-gradient(${stops.join(',')})` }}>
        <div className="donut-hole" />
      </div>
      <ul className="legend">
        {items.map((it, i) => (
          <li key={it.label}>
            <span className="dot" style={{ background: PALETTE[i % PALETTE.length] }} />
            {it.label} — {Math.round((it.value / total) * 100)}%
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Bars({ items }) {
  // items: [{label, income, expense}]
  const max = Math.max(1, ...items.flatMap((i) => [i.income, i.expense]))
  if (!items.length) return <p className="muted">No data yet.</p>
  return (
    <div className="bars">
      {items.map((it) => (
        <div className="bar-group" key={it.label}>
          <div className="bar-pair">
            <div className="bar inc" style={{ height: `${(it.income / max) * 100}%` }} title={`Income ${it.income}`} />
            <div className="bar exp" style={{ height: `${(it.expense / max) * 100}%` }} title={`Expense ${it.expense}`} />
          </div>
          <span className="bar-label">{it.label}</span>
        </div>
      ))}
    </div>
  )
}
