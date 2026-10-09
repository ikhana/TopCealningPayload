// src/components/Honeypot/index.tsx
import React from 'react'

import { HONEYPOT_NAME } from '@/lib/leads/constants'

/**
 * A field only a bot fills in. Ported from BrandBloomPayload.
 *
 * No third-party script, no request to Google, nothing for a real person to solve, and
 * nothing that can fail closed and block a genuine lead. A submission that fills it is
 * stored as quarantined, not discarded (src/lib/leads/spam.ts).
 *
 * Hidden with position and clipping rather than `display: none` or `type="hidden"`,
 * because both of those are trivially detected by the autofill routines this is meant to
 * catch. `tabIndex={-1}` and `aria-hidden` keep it away from keyboard and screen-reader
 * users, who would otherwise be the ones caught by it.
 *
 * It is not sufficient on its own and is not meant to be: the server also checks fill time
 * and the bot-detection challenge.
 */
export const Honeypot: React.FC = () => (
  <div
    aria-hidden="true"
    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
  >
    <label htmlFor={`hp-${HONEYPOT_NAME}`}>Leave this field empty</label>
    <input
      id={`hp-${HONEYPOT_NAME}`}
      name={HONEYPOT_NAME}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      defaultValue=""
    />
  </div>
)
