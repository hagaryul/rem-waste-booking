'use client'

import { useState } from 'react'
import { BookingData } from '@/lib/types'
import { btnOrange, btnBack, card, stepTitle, errorBox, colors } from '@/lib/styles'

type Props = {
  booking: BookingData
  onBack: () => void
}

export default function StepReview({ booking, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const VAT_RATE = 0.2
  const vatAmount = booking.price * VAT_RATE
  const total = booking.price + vatAmount

  const handleConfirm = async () => {
    if (submitted) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postcode: booking.postcode,
          addressId: booking.addressId,
          heavyWaste: booking.heavyWaste,
          plasterboard: booking.plasterboard,
          skipSize: booking.skipSize,
          price: booking.price,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setBookingId(data.bookingId)
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div data-cy="booking-confirmation" style={{ ...card, textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.black, marginBottom: '8px' }}>Booking Confirmed!</h2>
        <p style={{ color: colors.black, marginBottom: '12px' }}>Your booking reference is:</p>
        <div style={{ backgroundColor: '#fff7ed', border: `2px solid ${colors.orange}`, borderRadius: '12px', padding: '16px', display: 'inline-block' }}>
          <p data-cy="booking-id" style={{ fontSize: '28px', fontWeight: 'bold', color: colors.orange }}>{bookingId}</p>
        </div>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
          A confirmation will be sent to you shortly. For questions call{' '}
          <a href="tel:08008085475" style={{ color: colors.orange, fontWeight: 'bold' }}>0800 808 5475</a>
        </p>
      </div>
    )
  }

  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
      <span style={{ color: '#555' }}>{label}</span>
      <span style={{ fontWeight: '600', color: colors.black }}>{value}</span>
    </div>
  )

  return (
    <div style={card}>
      <h2 style={stepTitle}>Step 4: Review your booking</h2>

      <div data-cy="review-summary" style={{ marginBottom: '20px' }}>
        {row('Postcode', booking.postcode)}
        {row('Address', booking.addressLabel)}
        {row('General Waste', booking.generalWaste ? 'Yes' : 'No')}
        {row('Heavy Waste', booking.heavyWaste ? 'Yes' : 'No')}
        {row('Plasterboard', booking.plasterboard ? 'Yes' : 'No')}
        {booking.plasterboard && booking.plasterboardOption && row('Plasterboard Option', booking.plasterboardOption)}
        {row('Skip Size', booking.skipSize)}
      </div>

      <div data-cy="price-breakdown" style={{ backgroundColor: '#fff7ed', border: `2px solid ${colors.orange}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 'bold', color: colors.black, marginBottom: '12px' }}>Price Breakdown</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#555' }}>
          <span>Skip hire ({booking.skipSize})</span>
          <span>£{booking.price.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555' }}>
          <span>VAT (20%)</span>
          <span>£{vatAmount.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: `2px solid ${colors.orange}` }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: colors.black }}>Total</span>
          <span style={{ fontWeight: 'bold', fontSize: '22px', color: colors.orange }}>£{total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div data-cy="error-message" style={errorBox}>
          <span>{error}</span>
        </div>
      )}

     <div className="btn-row" style={{ display: 'flex', gap: '12px' }}>
        <button data-cy="back-button" onClick={onBack} disabled={loading} style={{ ...btnBack, flex: 1, padding: '14px' }}>
          ← Back
        </button>
        <button data-cy="confirm-button" onClick={handleConfirm} disabled={loading || submitted} style={{ ...btnOrange, flex: 1, padding: '14px', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Confirming...' : '✓ Confirm Booking'}
        </button>
      </div>
    </div>
  )
}