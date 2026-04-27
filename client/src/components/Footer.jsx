import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__crest">🎩</span>
          <p className="footer__name">Shelby's Crew</p>
          <p className="footer__tagline">Finest Fruits. By Order.</p>
        </div>
        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu & Prices</Link>
        </div>
        <div className="footer__info">
          <p>📍 Small Shelby Street, Birmingham</p>
          <p>🕐 Mon–Sat: 7 AM – 8 PM</p>
          <p>📞 Pickup Only</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2025 Shelby's Crew · <em>By Order of the Peaky Blinders</em></p>
      </div>
    </footer>
  )
}
