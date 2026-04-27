import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminApi from '../api/api'

export default function Dashboard() {
  const [counts, setCounts] = useState({ menu: 0, combos: 0, quotes: 0, available: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.getMenu(), adminApi.getCombos(), adminApi.getAllQuotes()])
      .then(([menu, combos, quotes]) => {
        setCounts({
          menu: menu.length,
          combos: combos.length,
          quotes: quotes.length,
          available: menu.filter(i => i.is_available).length,
        })
        setRecent(menu.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Menu Items',    value: counts.menu,      icon: '🍑', link: '/menu' },
    { label: 'Available Now', value: counts.available,  icon: '✓',  link: '/menu' },
    { label: 'Combo Deals',   value: counts.combos,    icon: '🛒',  link: '/combos' },
    { label: 'Active Quotes', value: counts.quotes,    icon: '💬',  link: '/quotes' },
  ]

  return (
    <>
      <div className="topbar">
        <span className="topbar__title">Dashboard</span>
        <span className="topbar__badge">🎩 Shelby's Crew</span>
      </div>
      <div className="page-content">
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ marginBottom: 4 }}>Welcome back, Boss</h2>
          <p style={{ color: 'var(--grey)', fontSize: '0.88rem' }}>By order of the Peaky Blinders — manage your empire below.</p>
        </div>

        {/* Stat Cards */}
        {loading ? <div style={{padding:'40px 0'}}><div className="spinner"/></div> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16, marginBottom:36 }}>
            {stats.map(s => (
              <Link to={s.link} key={s.label} style={{ textDecoration:'none' }}>
                <div className="stat-card" style={{ cursor:'pointer', transition:'var(--transition)' }}>
                  <div style={{ fontSize:'1.8rem', marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:'2rem', fontFamily:'var(--font-display)', color:'var(--gold)', fontWeight:700, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--grey)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Recent Items */}
        <div className="data-card">
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontSize:'1rem' }}>Recent Menu Items</h3>
            <Link to="/menu" className="btn btn-outline btn-sm">Manage All →</Link>
          </div>
          {loading ? <div style={{padding:'40px'}}><div className="spinner"/></div> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight:600 }}>{item.name}</td>
                    <td style={{ color:'var(--grey)' }}>{item.category}</td>
                    <td className="td-price">₹{item.price} <span style={{ fontSize:'0.7rem', color:'var(--grey)', fontFamily:'var(--font-body)', fontWeight:400 }}>/{item.unit}</span></td>
                    <td><span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`}>{item.is_available ? 'Available' : 'Unavailable'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
