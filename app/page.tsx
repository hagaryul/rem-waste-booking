'use client'

import { useState } from 'react'
import StepPostcode from '@/components/StepPostcode'
import StepWasteType from '@/components/StepWasteType'
import StepSkipSelect from '@/components/StepSkipSelect'
import StepReview from '@/components/StepReview'
import { BookingData } from '@/lib/types'
import { colors } from '@/lib/styles'

const STEPS = ['Postcode', 'Waste Type', 'Skip Size', 'Review']

export default function Home() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<Partial<BookingData>>({})

  const updateBooking = (data: Partial<BookingData>) => {
    setBooking(prev => ({ ...prev, ...data }))
  }

  return (
    <main style={{ backgroundColor: '#f0f0f0', paddingBottom: '64px' }}>
      <div className="page-wrapper" style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', backgroundColor: colors.border, zIndex: 0 }} />
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px',
                backgroundColor: i < step ? colors.orange : i === step ? colors.orangeDark : colors.border,
                color: i <= step ? colors.white : '#999',
                border: i === step ? `3px solid ${colors.black}` : '3px solid transparent',
                boxShadow: i === step ? '0 0 0 3px rgba(249,115,22,0.2)' : 'none',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '11px', marginTop: '6px', color: i <= step ? colors.black : '#999', fontWeight: i === step ? 'bold' : 'normal' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {step === 0 && <StepPostcode onNext={(data) => { updateBooking(data); setStep(1) }} />}
        {step === 1 && <StepWasteType onNext={(data) => { updateBooking(data); setStep(2) }} onBack={() => setStep(0)} />}
        {step === 2 && <StepSkipSelect booking={booking} onNext={(data) => { updateBooking(data); setStep(3) }} onBack={() => setStep(1)} />}
        {step === 3 && <StepReview booking={booking as BookingData} onBack={() => setStep(2)} />}
      </div>
    </main>
  )
}