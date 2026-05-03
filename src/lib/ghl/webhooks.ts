import { createHmac, timingSafeEqual } from 'crypto'

const REPLAY_WINDOW_MS = 5 * 60 * 1000  // 5 minutes

export async function verifyGhlWebhook(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
): Promise<boolean> {
  const secret = process.env.GHL_WEBHOOK_SIGNING_SECRET
  if (!secret) {
    console.error('GHL_WEBHOOK_SIGNING_SECRET is not set')
    return false
  }

  // Replay check
  if (timestampHeader) {
    const ts = parseInt(timestampHeader, 10)
    if (isNaN(ts) || Date.now() - ts * 1000 > REPLAY_WINDOW_MS) {
      return false
    }
  }

  if (!signatureHeader) return false

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')

  // Constant-length comparison to prevent timing attacks
  if (expected.length !== signatureHeader.length) return false

  const expectedBuf = new Uint8Array(Buffer.from(expected, 'hex'))
  const receivedBuf = new Uint8Array(Buffer.from(signatureHeader, 'hex'))

  if (expectedBuf.length !== receivedBuf.length) return false

  return timingSafeEqual(expectedBuf, receivedBuf)
}
