import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',       icon: '▦',  label: 'Dashboard',   end: true },
  { to: '/menu',   icon: '🍑', label: 'Menu Items'  },
  { to: '/combos', icon: '🛒', label: 'Combos'      },
  { to: '/quotes', icon: '💬', label: 'Quotes'      },
]

export default function Layout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__icon">🎩</span>
          <div>
            <div className="sidebar__title">Shelby's Crew</div>
            <div className="sidebar__sub">Admin Panel</div>
          </div>
        </div>
        <nav className="sidebar__nav">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-item__icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div style={{ fontSize: '0.72rem', color: 'var(--grey)', marginBottom: 8, paddingLeft: 12 }}>
            Logged in as <strong style={{ color: 'var(--gold)' }}>{admin?.username}</strong>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⎋</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
