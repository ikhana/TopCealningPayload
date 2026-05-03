import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // apiLoginId is safe to expose to browser — it is NOT the Transaction Key
  // Accept.js requires it alongside the Public Client Key for tokenization
  const config = {
    apiLoginID: process.env.AUTHNET_API_LOGIN_ID ?? '',
    clientKey: process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY ?? '',
    mode: process.env.AUTHNET_MODE ?? 'sandbox',
  }

  if (!config.apiLoginID || !config.clientKey) {
    return NextResponse.json({ error: 'Payment processor not configured' }, { status: 503 })
  }

  return NextResponse.json(config, { status: 200 })
}
