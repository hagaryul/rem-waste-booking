'use client'

import { useState, useEffect } from 'react'
import { BookingData } from '@/lib/types'
import { card, stepTitle, errorBox, colors } from '@/lib/styles'

type Skip = {
  size: string
  price: number
  disabled: boolean
}

type Props = {
  booking: Partial<BookingData>
  onNext: (data: Partial<BookingData>) => void
  onBack: () => void
}

export default function StepSkipSelect({ booking, onNext, onBack }: Props) {
  const [skips, setSkips] = useState<Skip[]>([])
  const [selected, setSelected] = useState<Skip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSkips = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/skips?postcode=${booking.postcode}&heavyWaste=${booking.heavyWaste}`)
      if (!res.ok) {
        setError('Failed to load skip options. Please try again.')
        return
      }
      const data = await res.json()
      setSkips(data.skips)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSkips() }, [booking.postcode, booking.heavyWaste])

  const handleNext = () => {
    if (!selected) return
    onNext({ skipSize: selected.size, price: selected.price })
  }

  return (
    <div style={card} className="animate-fade-in-up">
      <h2 style={stepTitle}>Step 3: Select your skip size</h2>

      {loading && (
        <div data-cy="loading-state" style={{ textAlign: 'center', color: colors.black, padding: '40px' }}>
          Loading skip options...
        </div>
      )}

      {error && (
        <div data-cy="error-message" style={errorBox}>
          <span>{error}</span>
          <button data-cy="retry-button" onClick={fetchSkips} style={{ background: 'none', border: 'none', color: colors.error, textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="skip-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {skips.map(skip => (
            <button
              key={skip.size}
              data-cy={`skip-option-${skip.size}`}
              onClick={() => !skip.disabled && setSelected(skip)}
              disabled={skip.disabled}
              className={`skip-card ${selected?.size === skip.size ? 'selected' : ''}`}
              style={{ opacity: skip.disabled ? 0.5 : 1, cursor: skip.disabled ? 'not-allowed' : 'pointer' }}
            >
              <p style={{ fontWeight: 'bold', color: colors.black, marginBottom: '4px', fontSize: '14px' }}>{skip.size}</p>
              <p style={{ color: colors.orange, fontWeight: 'bold', fontSize: '16px' }}>£{skip.price}</p>
              {skip.disabled && (
                <p data-cy="disabled-label" style={{ color: colors.error, fontSize: '11px', marginTop: '4px' }}>
                  Not available
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="btn-row" style={{ display: 'flex', gap: '12px' }}>
        <button data-cy="back-button" onClick={onBack} className="btn-back">
          ← Back
        </button>
        <button data-cy="next-button" onClick={handleNext} disabled={!selected} className="btn-orange" style={{ opacity: selected ? 1 : 0.4 }}>
          Next →
        </button>
      </div>
    </div>
  )
}