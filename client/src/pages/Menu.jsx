import { useState, useEffect } from 'react'
import api from '../api/api'
import './Menu.css'

const CATEGORIES = ['All', 'Fruits', 'Seasonal', 'Exotic', 'Berries']

function getCategoryEmoji(cat) {
  const map = { Seasonal: '🥭', Fruits: '🍎', Exotic: '🍍', Berries: '🍇' }
  return map[cat] || '🍑'
}

export default function Menu() {
  const [items, setItems]     = useState([])
  const [combos, setCombos]   = useState([])
  const [cat, setCat]         = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    Promise.all([api.getMenu(), api.getCombos()])
      .then(([m, c]) => { setItems(m); setCombos(c) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = cat === 'All' ? items : items.filter(i => i.category === cat)

  // Detect categories present in data
  const presentCats = ['All', ...new Set(items.map(i => i.category).filter(Boolean))]

  return (
    <div className="menu-page page-enter">

      {/* Header */}
      <div className="menu-header">
        <div className="smoke-overlay" />
        <div className="container menu-header__inner">
          <span className="section-label">Shelby's Crew</span>
          <h1>Menu &amp; <span className="gold-text">Prices</span></h1>
          <div className="gold-divider" />
          <p className="menu-header__sub">Hand-picked. Fresh daily. Pickup only.</p>
        </div>
      </div>

      {/* Fruit Items */}
      <section className="section">
        <div className="container">

          {/* Category filter */}
          <div className="menu-filters">
            {presentCats.map(c => (
              <button
                key={c}
                className={`filter-btn ${cat === c ? 'filter-btn--active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: '80px 0' }}><div className="spinner" /></div>
          ) : error ? (
            <div className="menu-error">
              <p>⚠️ Could not load menu. Please try again later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="menu-empty">No items in this category yet.</p>
          ) : (
            <div className="menu-grid">
              {filtered.map(item => (
                <div className="menu-item-card card" key={item.id}>
                  <div className="menu-item-card__left">
                    <span className="menu-item-card__emoji">{getCategoryEmoji(item.category)}</span>
                  </div>
                  <div className="menu-item-card__body">
                    <div className="menu-item-card__top">
                      <div>
                        <p className="menu-item-card__cat">{item.category || 'Fruits'}</p>
                        <h3 className="menu-item-card__name">{item.name}</h3>
                        {item.description && (
                          <p className="menu-item-card__desc">{item.description}</p>
                        )}
                      </div>
                      <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`}>
                        {item.is_available ? '✓ Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="menu-item-card__price-row">
                      <span className="menu-item-card__price">₹{item.price}</span>
                      <span className="menu-item-card__unit">per {item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Combos */}
      <section className="section combo-section" id="combos">
        <div className="container">
          <span className="section-label">Special Deals</span>
          <h2 style={{ marginBottom: 40 }}>Crew <span className="gold-text">Combos</span></h2>

          {loading ? (
            <div className="flex-center" style={{ padding: '40px 0' }}><div className="spinner" /></div>
          ) : combos.length === 0 ? (
            <p className="menu-empty">No combos available right now.</p>
          ) : (
            <div className="combos-list">
              {combos.map(c => (
                <div className="combo-row card" key={c.id}>
                  <div className="combo-row__left">
                    <span className="combo-row__icon">🛒</span>
                    <div>
                      <h3 className="combo-row__name">{c.name}</h3>
                      {c.description && <p className="combo-row__desc">{c.description}</p>}
                      <div className="combo-row__items">
                        {(c.items || []).map((it, i) => (
                          <span key={i} className="combo-row__item-tag">{it}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="combo-row__price-wrap">
                    <span className="combo-row__price">₹{c.price}</span>
                    <span className="combo-row__label">combo</span>
                    <span className={`badge ${c.is_available ? 'badge-green' : 'badge-red'}`}>
                      {c.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <div className="menu-note">
        <div className="container">
          <p>🎩 <strong>Pickup only</strong> — Small Shelby Street · Mon–Sat 7AM–8PM · Prices in INR ₹ · Subject to availability</p>
        </div>
      </div>

    </div>
  )
}
