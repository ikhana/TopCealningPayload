// Server-only — never import this in client components
import { AuthNetAvsError, AuthNetCvvError, AuthNetDeclinedError, AuthNetError } from './errors'
import type {
  AuthNetChargeParams,
  AuthNetChargeResult,
  AuthNetRefundParams,
  AuthNetCreateProfileParams,
  AuthNetCreateProfileResult,
  AuthNetChargeProfileParams,
} from './types'

// AVS codes that indicate address mismatch (decline)
const AVS_DECLINE_CODES = new Set(['N', 'A', 'Z', 'W', 'U', 'R', 'S', 'E', 'G'])
// CVV codes that indicate mismatch (decline)
const CVV_DECLINE_CODES = new Set(['N', 'P', 'S', 'U'])

function getApiEndpoint() {
  const mode = process.env.AUTHNET_MODE ?? 'sandbox'
  return mode === 'production'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api'
}

function buildAuthPayload() {
  return {
    name: process.env.AUTHNET_API_LOGIN_ID!,
    transactionKey: process.env.AUTHNET_TRANSACTION_KEY!,
  }
}

export async function chargeNonce(params: AuthNetChargeParams): Promise<AuthNetChargeResult> {
  const {
    dataDescriptor,
    dataValue,
    amount,
    refId,
    customerEmail,
    customerPhone,
    description,
  } = params

  const payload = {
    createTransactionRequest: {
      merchantAuthentication: buildAuthPayload(),
      refId,
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: amount.toFixed(2),
        payment: {
          opaqueData: { dataDescriptor, dataValue },
        },
        order: { description: description.slice(0, 255) },
        customer: { email: customerEmail },
        ...(customerPhone ? { billTo: { phoneNumber: customerPhone } } : {}),
      },
    },
  }

  const res = await fetch(getApiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new AuthNetError({
      message: `Auth.net HTTP error: ${res.status}`,
      responseCode: '3',
      responseText: res.statusText,
    })
  }

  // Auth.net prepends a BOM character — strip it
  const text = (await res.text()).replace(/^﻿/, '')
  const json = JSON.parse(text)

  const txResponse = json?.transactionResponse
  const responseCode = txResponse?.responseCode as '1' | '2' | '3' | undefined
  const responseText = txResponse?.messages?.[0]?.description ?? txResponse?.errors?.[0]?.errorText ?? 'Unknown error'
  const avsResultCode = txResponse?.avsResultCode as string | undefined
  const cvvResultCode = txResponse?.cvvResultCode as string | undefined
  const transactionId = txResponse?.transId as string | undefined
  const authCode = txResponse?.authCode as string | undefined

  // Check for AVS mismatch
  if (avsResultCode && AVS_DECLINE_CODES.has(avsResultCode)) {
    throw new AuthNetAvsError(avsResultCode)
  }

  // Check for CVV mismatch
  if (cvvResultCode && CVV_DECLINE_CODES.has(cvvResultCode)) {
    throw new AuthNetCvvError(cvvResultCode)
  }

  if (responseCode === '2') {
    throw new AuthNetDeclinedError(responseText, avsResultCode, cvvResultCode)
  }

  if (responseCode !== '1' || !transactionId) {
    const errorText = txResponse?.errors?.[0]?.errorText ?? responseText
    throw new AuthNetError({
      message: `Auth.net error: ${errorText}`,
      responseCode: responseCode ?? '3',
      responseText: errorText,
    })
  }

  return {
    transactionId,
    authCode: authCode ?? '',
    avsResultCode: avsResultCode ?? '',
    cvvResultCode: cvvResultCode ?? '',
    responseCode: '1',
    responseText,
  }
}

export async function createCustomerProfile(
  params: AuthNetCreateProfileParams,
): Promise<AuthNetCreateProfileResult> {
  const { opaqueData, email, merchantCustomerId } = params
  const isTest = (process.env.AUTHNET_MODE ?? 'sandbox') !== 'production'

  const body = {
    createCustomerProfileRequest: {
      merchantAuthentication: buildAuthPayload(),
      profile: {
        merchantCustomerId,
        email,
        paymentProfiles: {
          payment: { opaqueData },
        },
      },
      validationMode: isTest ? 'testMode' : 'liveMode',
    },
  }

  const res = await fetch(getApiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new AuthNetError({ message: `Auth.net HTTP ${res.status}`, responseCode: '3', responseText: res.statusText })
  }

  const text = (await res.text()).replace(/^﻿/, '')
  const json = JSON.parse(text)

  // E00039 = duplicate profile — customer already has a profile, extract the existing ID
  const resultCode = json.messages?.resultCode
  if (resultCode !== 'Ok') {
    const errCode = json.messages?.message?.[0]?.code as string | undefined
    const errText = json.messages?.message?.[0]?.text ?? 'Failed to create customer profile'
    if (errCode === 'E00039') {
      // Duplicate — Auth.net returns the existing customerProfileId in the message text
      const match = errText.match(/A duplicate record with ID (\d+) already exists/)
      if (match?.[1]) {
        const customerProfileId = match[1]
        const paymentProfileId = json.customerPaymentProfileIdList?.[0] as string | undefined
        if (paymentProfileId) return { customerProfileId, paymentProfileId }
      }
    }
    throw new AuthNetError({ message: errText, responseCode: '3', responseText: errText })
  }

  const customerProfileId = String(json.customerProfileId)
  const paymentProfileId = String(json.customerPaymentProfileIdList?.[0])

  if (!customerProfileId || !paymentProfileId) {
    throw new AuthNetError({ message: 'Missing profile IDs in response', responseCode: '3', responseText: 'No profile ID returned' })
  }

  return { customerProfileId, paymentProfileId }
}

export async function chargeCustomerProfile(
  params: AuthNetChargeProfileParams,
): Promise<AuthNetChargeResult> {
  const { customerProfileId, paymentProfileId, amount, refId, description } = params

  const body = {
    createTransactionRequest: {
      merchantAuthentication: buildAuthPayload(),
      refId,
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: amount.toFixed(2),
        profile: {
          customerProfileId,
          paymentProfile: { paymentProfileId },
        },
        order: { description: description.slice(0, 255) },
      },
    },
  }

  const res = await fetch(getApiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new AuthNetError({ message: `Auth.net HTTP ${res.status}`, responseCode: '3', responseText: res.statusText })
  }

  const text = (await res.text()).replace(/^﻿/, '')
  const json = JSON.parse(text)
  const txResponse = json?.transactionResponse
  const responseCode = txResponse?.responseCode as '1' | '2' | '3' | undefined
  const responseText = txResponse?.messages?.[0]?.description ?? txResponse?.errors?.[0]?.errorText ?? 'Unknown error'
  const avsResultCode = txResponse?.avsResultCode as string | undefined
  const cvvResultCode = txResponse?.cvvResultCode as string | undefined
  const transactionId = txResponse?.transId as string | undefined
  const authCode = txResponse?.authCode as string | undefined

  if (avsResultCode && AVS_DECLINE_CODES.has(avsResultCode)) throw new AuthNetAvsError(avsResultCode)
  if (cvvResultCode && CVV_DECLINE_CODES.has(cvvResultCode)) throw new AuthNetCvvError(cvvResultCode)
  if (responseCode === '2') throw new AuthNetDeclinedError(responseText, avsResultCode, cvvResultCode)
  if (responseCode !== '1' || !transactionId) {
    const errorText = txResponse?.errors?.[0]?.errorText ?? responseText
    throw new AuthNetError({ message: `Auth.net error: ${errorText}`, responseCode: responseCode ?? '3', responseText: errorText })
  }

  return { transactionId, authCode: authCode ?? '', avsResultCode: avsResultCode ?? '', cvvResultCode: cvvResultCode ?? '', responseCode: '1', responseText }
}

export async function refundTransaction(params: AuthNetRefundParams): Promise<void> {
  const { transactionId, amount, lastFour } = params

  const payload = {
    createTransactionRequest: {
      merchantAuthentication: buildAuthPayload(),
      transactionRequest: {
        transactionType: 'refundTransaction',
        amount: amount.toFixed(2),
        payment: {
          creditCard: {
            cardNumber: lastFour,
            expirationDate: 'XXXX',
          },
        },
        refTransId: transactionId,
      },
    },
  }

  const res = await fetch(getApiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new AuthNetError({
      message: `Auth.net refund HTTP error: ${res.status}`,
      responseCode: '3',
      responseText: res.statusText,
    })
  }

  const text = (await res.text()).replace(/^﻿/, '')
  const json = JSON.parse(text)
  const txResponse = json?.transactionResponse
  const responseCode = txResponse?.responseCode

  if (responseCode !== '1') {
    const errorText = txResponse?.errors?.[0]?.errorText ?? 'Refund failed'
    throw new AuthNetError({
      message: `Auth.net refund failed: ${errorText}`,
      responseCode: responseCode ?? '3',
      responseText: errorText,
    })
  }
}
