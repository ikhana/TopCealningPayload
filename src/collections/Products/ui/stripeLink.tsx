'use client'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

export const StripeLink: React.FC = () => {
  const { stripeID } = useFormFields(([fields]) => ({
    stripeID: fields.stripeID?.value as string,
  }))

  if (!stripeID) {
    return null
  }

  const isTestMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test')
  const stripeUrl = `https://dashboard.stripe.com/${isTestMode ? 'test/' : ''}products/${stripeID}`

  return (
    <div className="field-type ui">
      <div className="field-label">Stripe Product</div>
      <div className="field-description">
        <a
          href={stripeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#007cba',
            textDecoration: 'underline',
          }}
        >
          View in Stripe Dashboard →
        </a>
      </div>
    </div>
  )
}