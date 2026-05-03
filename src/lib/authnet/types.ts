export interface AuthNetChargeParams {
  dataDescriptor: string   // from Accept.js nonce
  dataValue: string        // from Accept.js nonce
  amount: number           // in dollars, e.g. 149.50
  currency?: string        // 'USD' default
  refId: string            // idempotency key — same key = Auth.net deduplication
  customerEmail: string
  customerPhone?: string
  description: string
}

export interface AuthNetChargeResult {
  transactionId: string
  authCode: string
  avsResultCode: string
  cvvResultCode: string
  responseCode: '1' | '2' | '3'  // 1=approved, 2=declined, 3=error
  responseText: string
}

export interface AuthNetRefundParams {
  transactionId: string
  amount: number
  lastFour: string  // last 4 digits of card — required by Auth.net for refunds
}

export interface AuthNetCreateProfileParams {
  opaqueData: { dataDescriptor: string; dataValue: string }
  email: string
  merchantCustomerId: string  // userId — deduplication key in Auth.net
}

export interface AuthNetCreateProfileResult {
  customerProfileId: string
  paymentProfileId: string
}

export interface AuthNetChargeProfileParams {
  customerProfileId: string
  paymentProfileId: string
  amount: number
  refId: string
  description: string
}
