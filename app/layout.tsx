import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'REM Waste — Book Your Skip',
  description: 'Book your skip hire online in minutes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="header-inner" style={{
          backgroundColor: '#ffffff',
          borderBottom: '4px solid #F97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
          padding: '0 40px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <img src="/logo.webp" alt="REM Waste" className="header-logo" style={{ height: '70px', objectFit: 'contain' }} />
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#999', marginBottom: '2px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Free Quote</p>
            <a href="tel:08008085475" className="header-phone" style={{ color: '#F97316', fontWeight: '800', fontSize: '20px', textDecoration: 'none', letterSpacing: '0.5px' }}>
              0800 808 5475
            </a>
          </div>
        </header>

        {/* Trust banner */}
        <div className="trust-banner" style={{
          backgroundColor: '#EA580C',
          padding: '8px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
        }}>
          <span className="trust-badge">Same-Day Delivery</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>|</span>
          <span className="trust-badge">Up to 90% Recycled</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>|</span>
          <span className="trust-badge">10,000+ Customers</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>|</span>
          <span className="trust-badge">Fully Licensed & Insured</span>
        </div>

{/* Hero */}
<div style={{
  backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #1a1a1a 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '28px 40px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  willChange: 'transform',
  contain: 'layout',
}}>
  <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(249,115,22,0.1)', pointerEvents: 'none' }} />
  <div style={{ position: 'absolute', left: '-40px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(249,115,22,0.06)', pointerEvents: 'none' }} />

  <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
    <div style={{ display: 'inline-block', backgroundColor: '#F97316', color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '4px', marginBottom: '12px' }}>
      Skip Hire Made Easy
    </div>
    <h1 className="hero-title" style={{ color: '#ffffff', fontSize: '40px', fontWeight: '800', lineHeight: 1.1, marginBottom: '10px', letterSpacing: '-0.5px' }}>
      Book Your Skip <span style={{ color: '#F97316' }}>Online Today</span>
    </h1>
    <p style={{ color: '#cccccc', fontSize: '15px', lineHeight: 1.5, maxWidth: '500px', margin: '0 auto' }}>
      Fast, affordable skip hire across the UK — done in minutes.
    </p>
  </div>
</div>

        {children}

        {/* Footer */}
        <footer style={{
          backgroundColor: '#1a1a1a',
          color: '#aaa',
          textAlign: 'center',
          padding: '16px 24px',
          fontSize: '13px',
          borderTop: '4px solid #F97316',
        }}>
          <p style={{ marginBottom: '4px', fontWeight: '600' }}>© 2026 REM Waste. All rights reserved.</p>
          <p>
            <a href="tel:08008085475" style={{ color: '#F97316', textDecoration: 'none', fontWeight: 'bold' }}>0800 808 5475</a>
            {' · '}
            <a href="mailto:hire@remwaste.com" style={{ color: '#F97316', textDecoration: 'none' }}>hire@remwaste.com</a>
          </p>
        </footer>
      </body>
    </html>
  )
}