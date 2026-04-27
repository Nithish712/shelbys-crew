import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import './Home.css'

export default function Home() {
  const [quotes, setQuotes]     = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [combos, setCombos]     = useState([])
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [fade, setFade]         = useState(true)
  const [loading, setLoading]   = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    Promise.all([api.getQuotes(), api.getMenu(), api.getCombos()])
      .then(([q, m, c]) => {
        setQuotes(q)
        setMenuItems(m.slice(0, 6))
        setCombos(c.slice(0, 3))
      })
      .catch(() => {
        setQuotes([
          { id: 1, text: 'By order of the Peaky Blinders, only the finest fruits shall be served.', author: 'Tommy Shelby' },
          { id: 2, text: 'A man who does not enjoy fresh fruit has no soul.', author: 'Arthur Shelby' },
          { id: 3, text: 'Every morning is a chance to choose better. Choose fruit.', author: 'Polly Gray' },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (quotes.length < 2) return
    intervalRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % quotes.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [quotes])

  const currentQuote = quotes[quoteIdx]

  return (
    <div className="home page-enter">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="smoke-overlay" />
          <div className="hero__gradient" />
        </div>

        <div className="hero__content container">
          <div className="hero__text">
            <span className="section-label">By Order of the Peaky Blinders</span>
            <h1>
              The Finest<br />
              <span className="gold-text">Fruits</span> in<br />
              the City
            </h1>
            <div className="gold-divider" />
            <p className="hero__sub">
              Shelby's Crew brings you nature's best — hand-picked, fresh daily.<br />
              Pickup from Small Shelby Street.
            </p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn-gold">View Menu & Prices</Link>
            </div>
          </div>

          <div className="hero__image-wrap">
            <div className="hero__img-frame">
              <img src="/peaky_hero.png" alt="Shelby's Crew character" className="hero__img" />
              <div className="hero__img-glow" />
            </div>
            <div className="hero__badge">
              <span>🎩</span>
              <p>Est. 1919</p>
              <p className="hero__badge-sub">Small Heath, Birmingham</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── QUOTE ROTATOR ── */}
      {quotes.length > 0 && (
        <section className="quotes-section">
          <div className="quotes-bg">
            <img src="/peaky_crew.png" alt="Shelby crew" className="quotes-bg__img" />
            <div className="quotes-bg__overlay" />
          </div>
          <div className="container quotes-inner">
            <span className="section-label">Words of Wisdom</span>
            <div className={`quote-card ${fade ? 'quote-fade-in' : 'quote-fade-out'}`}>
              <div className="quote-mark">"</div>
              <p className="quote-text">{currentQuote?.text}</p>
              <p className="quote-author">— {currentQuote?.author}</p>
            </div>
            <div className="quote-dots">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  className={`quote-dot ${i === quoteIdx ? 'quote-dot--active' : ''}`}
                  onClick={() => { setFade(false); setTimeout(() => { setQuoteIdx(i); setFade(true) }, 300) }}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED MENU ── */}
      <section className="section featured">
        <div className="container">
          <div className="featured__header">
            <div>
              <span className="section-label">Fresh Today</span>
              <h2>Today's <span className="gold-text">Selection</span></h2>
            </div>
            <Link to="/menu" className="btn btn-outline">Full Menu →</Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
          ) : menuItems.length === 0 ? (
            <p style={{ color: 'var(--grey)', textAlign: 'center', padding: '60px 0' }}>Menu loading soon...</p>
          ) : (
            <div className="featured__grid">
              {menuItems.map(item => (
                <div className="menu-card card" key={item.id}>
                  <div className="menu-card__emoji">{getCategoryEmoji(item.category)}</div>
                  <div className="menu-card__body">
                    <p className="menu-card__category">{item.category || 'Fruits'}</p>
                    <h3 className="menu-card__name">{item.name}</h3>
                    {item.description && <p className="menu-card__desc">{item.description}</p>}
                    <div className="menu-card__footer">
                      <span className="menu-card__price">₹{item.price} <span className="menu-card__unit">/ {item.unit}</span></span>
                      <span className={`badge ${item.is_available ? 'badge-green' : 'badge-red'}`}>
                        {item.is_available ? '✓ Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMBOS PREVIEW ── */}
      {combos.length > 0 && (
        <section className="section combos-preview">
          <div className="container">
            <div className="featured__header">
              <div>
                <span className="section-label">Special Deals</span>
                <h2>Crew <span className="gold-text">Combos</span></h2>
              </div>
              <Link to="/menu#combos" className="btn btn-outline">All Combos →</Link>
            </div>
            <div className="combos-grid">
              {combos.map(c => (
                <div className="combo-card card" key={c.id}>
                  <div className="combo-card__top">
                    <span className="combo-card__icon">🛒</span>
                    <h3 className="combo-card__name">{c.name}</h3>
                    <p className="combo-card__desc">{c.description}</p>
                  </div>
                  <div className="combo-card__items">
                    {(c.items || []).map((it, i) => (
                      <span key={i} className="combo-item">• {it}</span>
                    ))}
                  </div>
                  <div className="combo-card__price-row">
                    <span className="combo-card__price">₹{c.price}</span>
                    <span className="combo-card__label">combo deal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CHARACTER BANNER ── */}
      <section className="char-banner">
        <div className="char-banner__img-wrap">
          <img src="/peaky_portrait.png" alt="Peaky Blinders character" className="char-banner__img" />
          <div className="char-banner__overlay" />
        </div>
        <div className="char-banner__content container">
          <span className="section-label">Our Promise</span>
          <h2>Fresh. Daily. <span className="gold-text">No Exceptions.</span></h2>
          <p>We don't deal in half-measures. Every fruit is hand-picked at the peak of ripeness.<br />That's the Shelby way.</p>
          <Link to="/menu" className="btn btn-gold" style={{ marginTop: '24px' }}>Shop the Menu</Link>
        </div>
      </section>

    </div>
  )
}

function getCategoryEmoji(cat) {
  const map = { Seasonal: '🥭', Fruits: '🍎', Exotic: '🍍', Berries: '🍇' }
  return map[cat] || '🍑'
}
