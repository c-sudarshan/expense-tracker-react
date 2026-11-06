import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Take control of your money, one expense at a time.</h1>
        <p>
          A complete expense tracker to categorize spending, set budgets, track multiple
          accounts and understand your finances through charts and reports.
        </p>
        <div className="stats">
          <div><strong>Track</strong><span>Expenses &amp; income</span></div>
          <div><strong>Budget</strong><span>Per category &amp; month</span></div>
          <div><strong>Accounts</strong><span>Multi-account tracking</span></div>
          <div><strong>Reports</strong><span>Charts &amp; export</span></div>
        </div>
        <div className="row center">
          <Link className="btn" to="/signup">Create Account</Link>
          <Link className="btn ghost" to="/login">User Login</Link>
        </div>
      </section>

      <section className="container">
        <h2>Welcome</h2>
        <p className="muted">A complete finance management system with two modules:</p>
        <div className="grid2">
          <Link to="/login" className="card module">
            <h3>User Module</h3>
            <p>Expenses, incomes, budgets, accounts, recurring reminders, reports</p>
          </Link>
          <Link to="/admin-login" className="card module">
            <h3>Admin Module</h3>
            <p>Manage users, monitor transactions, view overall statistics</p>
          </Link>
        </div>
        <p className="muted">
          Sign up as a new user to get your own private dashboard. All data is stored in your
          browser's Local Storage.
        </p>
        <div className="row">
          <Link className="btn" to="/signup">Sign Up</Link>
          <Link className="btn ghost" to="/login">Login</Link>
        </div>
      </section>
    </>
  )
}
