'use client'

import { useState } from 'react'
import { BookingData } from '@/lib/types'
import { card, stepTitle, errorBox, colors } from '@/lib/styles'

type Props = {
  onNext: (data: Partial<BookingData>) => void
  onBack: () => void
}

export default function StepWasteType({ onNext, onBack }: Props) {
  const [generalWaste, setGeneralWaste] = useState(false)
  const [heavyWaste, setHeavyWaste] = useState(false)
  const [plasterboard, setPlasterboard] = useState(false)
  const [plasterboardOption, setPlasterboardOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (!generalWaste && !heavyWaste && !plasterboard) {
      setError('Please select at least one waste type')
      return
    }
    if (plasterboard && !plasterboardOption) {
      setError('Please select a plasterboard handling option')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waste-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generalWaste, heavyWaste, plasterboard, plasterboardOption }),
      })
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }
      onNext({ generalWaste, heavyWaste, plasterboard, plasterboardOption })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const wasteOptions = [
    { key: 'general', label: 'General Waste', desc: 'Household items, furniture, garden waste', checked: generalWaste, onChange: (v: boolean) => setGeneralWaste(v) },
    { key: 'heavy', label: 'Heavy Waste', desc: 'Concrete, soil, bricks, tiles', checked: heavyWaste, onChange: (v: boolean) => setHeavyWaste(v) },
    { key: 'plasterboard', label: 'Plasterboard', desc: 'Requires special handling', checked: plasterboard, onChange: (v: boolean) => { setPlasterboard(v); if (!v) setPlasterboardOption(null) } },
  ]

  return (
    <div style={card} className="animate-fade-in-up">
      <h2 style={stepTitle}>Step 2: Select waste type</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {wasteOptions.map(opt => (
          <label
            key={opt.key}
            className={`waste-option ${opt.checked ? 'selected' : ''}`}
          >
            <input
              data-cy={`${opt.key}-checkbox`}
              type="checkbox"
              checked={opt.checked}
              onChange={e => opt.onChange(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: colors.orange }}
            />
            <div>
              <p style={{ fontWeight: 'bold', color: colors.black, marginBottom: '2px' }}>{opt.label}</p>
              <p style={{ fontSize: '13px', color: '#555' }}>{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {plasterboard && (
        <div data-cy="plasterboard-options" style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fff7ed', border: `2px solid ${colors.orange}`, borderRadius: '12px' }}>
          <p style={{ fontWeight: 'bold', color: colors.black, marginBottom: '12px' }}>Plasterboard handling option</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { value: 'separate', label: 'Separate collection' },
              { value: 'mixed', label: 'Mixed with other waste' },
              { value: 'collection', label: 'Dedicated plasterboard skip' },
            ].map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: colors.black }}>
                <input
                  data-cy={`plasterboard-option-${opt.value}`}
                  type="radio"
                  name="plasterboardOption"
                  value={opt.value}
                  checked={plasterboardOption === opt.value}
                  onChange={() => setPlasterboardOption(opt.value)}
                  style={{ accentColor: colors.orange }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div data-cy="error-message" style={errorBox}>
          <span>{error}</span>
        </div>
      )}

      <div className="btn-row" style={{ display: 'flex', gap: '12px' }}>
        <button data-cy="back-button" onClick={onBack} className="btn-back">
          ← Back
        </button>
        <button data-cy="next-button" onClick={handleNext} disabled={loading} className="btn-orange" style={{ opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Loading...' : 'Next →'}
        </button>
      </div>
    </div>
  )
}