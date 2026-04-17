'use client'

import { useState } from 'react'
import { BookingData } from '@/lib/types'
import { card, input, label, stepTitle, errorBox, colors } from '@/lib/styles'

type Props = {
  onNext: (data: Partial<BookingData>) => void
}

export default function StepPostcode({ onNext }: Props) {
  const [postcode, setPostcode] = useState('')
  const [addresses, setAddresses] = useState<{ id: string; line1: string; city: string }[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [looked, setLooked] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualAddress, setManualAddress] = useState('')

  const isValidPostcode = (pc: string) => /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim())

  const handleLookup = async () => {
    if (!isValidPostcode(postcode)) {
      setError('Please enter a valid UK postcode')
      return
    }
    setLoading(true)
    setError('')
    setLooked(false)
    setAddresses([])
    setManualMode(false)

    try {
      const res = await fetch('/api/postcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      const data = await res.json()
      setAddresses(data.addresses)
      setLooked(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (manualMode) {
      if (!manualAddress.trim()) return
      onNext({ postcode, addressId: 'manual', addressLabel: manualAddress })
      return
    }
    const selected = addresses.find(a => a.id === selectedId)
    if (!selected) return
    onNext({ postcode, addressId: selected.id, addressLabel: `${selected.line1}, ${selected.city}` })
  }

  const canProceed = manualMode ? manualAddress.trim().length > 0 : !!selectedId

  return (
    <div style={card} className="animate-fade-in-up">
      <h2 style={stepTitle}>Step 1: Enter your postcode</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          data-cy="postcode-input"
          type="text"
          value={postcode}
          onChange={e => setPostcode(e.target.value.toUpperCase())}
          placeholder="e.g. SW1A 1AA"
          style={{ ...input, flex: 1, width: 'auto' }}
        />
        <button
          data-cy="lookup-button"
          onClick={handleLookup}
          disabled={loading}
          className="btn-orange"
          style={{ width: 'auto', padding: '10px 24px', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Loading...' : 'Find'}
        </button>
      </div>

      {error && (
        <div data-cy="error-message" style={errorBox}>
          <span>{error}</span>
          <button data-cy="retry-button" onClick={handleLookup} style={{ background: 'none', border: 'none', color: colors.error, textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div data-cy="loading-state" style={{ textAlign: 'center', color: colors.black, padding: '24px' }}>
          Looking up addresses...
        </div>
      )}

      {looked && addresses.length === 0 && !loading && (
        <div data-cy="empty-state" style={{ textAlign: 'center', color: colors.black, padding: '24px' }}>
          No addresses found for this postcode.
        </div>
      )}

      {addresses.length > 0 && !manualMode && (
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Select your address</label>
          <select
            data-cy="address-select"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{ ...input }}
          >
            <option value="">-- Select an address --</option>
            {addresses.map(a => (
              <option key={a.id} value={a.id}>{a.line1}, {a.city}</option>
            ))}
          </select>
        </div>
      )}

      {/* Manual entry toggle */}
      {looked && (
        <div style={{ marginBottom: '16px' }}>
          <button
            data-cy="manual-entry-toggle"
            onClick={() => { setManualMode(!manualMode); setSelectedId('') }}
            style={{ background: 'none', border: 'none', color: colors.orange, cursor: 'pointer', fontSize: '13px', fontWeight: '600', textDecoration: 'underline', padding: 0 }}
          >
            {manualMode ? '← Back to address list' : "Can't find your address? Enter manually"}
          </button>
        </div>
      )}

      {manualMode && (
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Enter your address manually</label>
          <input
            data-cy="manual-address-input"
            type="text"
            value={manualAddress}
            onChange={e => setManualAddress(e.target.value)}
            placeholder="e.g. 10 Downing Street, London"
            style={{ ...input }}
          />
        </div>
      )}

      <button
        data-cy="next-button"
        onClick={handleNext}
        disabled={!canProceed}
        className="btn-orange"
        style={{ opacity: canProceed ? 1 : 0.4 }}
      >
        Next →
      </button>
    </div>
  )
}