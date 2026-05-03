'use client'

export interface CardData {
  cardNumber: string
  month: string   // MM
  year: string    // YYYY
  cardCode: string
  cardName?: string
}

export interface OpaqueData {
  dataDescriptor: string
  dataValue: string
}

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: {
          authData: { clientKey: string; apiLoginID: string }
          cardData: { cardNumber: string; month: string; year: string; cardCode: string; fullName?: string }
        },
        callback: (response: { opaqueData?: OpaqueData; messages: { resultCode: string; message: Array<{ code: string; text: string }> } }) => void,
      ) => void
    }
  }
}

function getAcceptJsUrl(): string {
  const mode = process.env.NEXT_PUBLIC_AUTHNET_MODE ?? 'sandbox'
  return mode === 'production'
    ? 'https://js.authorize.net/v1/Accept.js'
    : 'https://jstest.authorize.net/v1/Accept.js'
}

async function loadAcceptJs(): Promise<void> {
  if (window.Accept) return

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = getAcceptJsUrl()
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Accept.js'))
    document.head.appendChild(script)
  })
}

export async function tokenizeCard(
  cardData: CardData,
  authData?: { clientKey: string; apiLoginID: string },
): Promise<OpaqueData> {
  await loadAcceptJs()

  if (!window.Accept) throw new Error('Accept.js not loaded')

  // Fall back to env vars if auth data not passed
  const auth = authData ?? {
    clientKey: process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY!,
    apiLoginID: process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID!,
  }

  return new Promise((resolve, reject) => {
    window.Accept!.dispatchData(
      {
        authData: auth,
        cardData: {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          month: cardData.month,
          year: cardData.year,
          cardCode: cardData.cardCode,
          ...(cardData.cardName ? { fullName: cardData.cardName } : {}),
        },
      },
      (response) => {
        if (response.messages.resultCode === 'Error') {
          const msg = response.messages.message[0]?.text ?? 'Tokenization failed'
          reject(new Error(msg))
          return
        }
        if (!response.opaqueData) {
          reject(new Error('No opaque data returned from Accept.js'))
          return
        }
        resolve(response.opaqueData)
      },
    )
  })
}
