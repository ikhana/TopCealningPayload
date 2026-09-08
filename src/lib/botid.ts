// src/lib/botid.ts
import { checkBotId } from 'botid/server'

/**
 * One place for the bot screen, shared by every public form endpoint.
 *
 * WHY THIS EXISTS AS A MODULE
 * The screen used to be copy-pasted into each route. That is how the two copies
 * came to differ in the thing that matters most: neither logged anything when it
 * rejected. A rejected submission returns `{ ok: true }` — the caller is told it
 * worked — so a false positive is INVISIBLE. Nothing errors, nothing 4xxs, the
 * enquiry simply never arrives, and the first sign of trouble is Geraldine
 * noticing the contact form has gone quiet.
 *
 * That is not hypothetical: the same setup on BrandBloomPayload was sending
 * effectively every submission to quarantine. Silent-and-wrong is the worst
 * possible combination for a lead form, so the screen now always leaves a trace.
 */

/** The library's own verdict vocabulary. */
type Verdict = 'HUMAN' | 'BAD-BOT' | 'GOOD-BOT' | 'ALLOWED'

const VERDICTS: readonly string[] = ['HUMAN', 'BAD-BOT', 'GOOD-BOT', 'ALLOWED']

/**
 * Forces a verdict so the reject path can actually be exercised.
 *
 * `checkBotId()` returns `isBot: false` unconditionally outside production, so
 * without this there is NO way to test what happens when a submission is
 * rejected — you would be shipping a branch that has never once run. Set
 * BOTID_DEV_VERDICT=BAD-BOT to make every request look like a bot.
 *
 * Ignored in production two ways over: this function returns undefined when
 * NODE_ENV is 'production', and the library itself only honours
 * `developmentOptions` when it believes it is in development. Belt and braces,
 * because an env var that silently disabled the real check on the live site
 * would be worse than having no check at all.
 */
function devVerdict(): Verdict | undefined {
  if (process.env.NODE_ENV === 'production') return undefined
  const raw = process.env.BOTID_DEV_VERDICT?.trim().toUpperCase()
  if (!raw) return undefined
  if (!VERDICTS.includes(raw)) {
    console.warn(`[botid] ignoring BOTID_DEV_VERDICT="${raw}" — expected one of ${VERDICTS.join(', ')}`)
    return undefined
  }
  return raw as Verdict
}

/**
 * Screens one request. `true` means "do not process this".
 *
 * @param label  route name, so the log line says which form was hit
 * @param who    something identifying in the payload (email/phone). Logged so a
 *               real person who reports "I filled the form and heard nothing"
 *               can be found in the logs and confirmed as a false positive.
 */
export async function isBotRequest(label: string, who: string): Promise<boolean> {
  const bypass = devVerdict()

  try {
    // No advancedOptions: that is Basic mode, which is what we want. Deep
    // Analysis is opt-in via advancedOptions.checkLevel = 'deepAnalysis' and is
    // a paid tier — do not switch it on here, this project is on Hobby.
    const { isBot } = await checkBotId(bypass ? { developmentOptions: { bypass } } : undefined)

    if (isBot) {
      // The one line that makes a false positive findable. Kept at warn, not
      // error, because a genuine bot being turned away is normal traffic — it
      // is the RATE that is diagnostic. All-quarantined means the challenge is
      // not reaching the browser, not that everyone is suddenly a bot.
      console.warn(
        `[botid] REJECTED ${label} — submission dropped, caller told it succeeded`,
        { who, forced: bypass ?? null },
      )
      return true
    }

    if (bypass) console.warn(`[botid] ${label} allowed with forced verdict ${bypass}`)
    return false
  } catch (err) {
    // Never let the detector's own failure block a submission. If Vercel's
    // endpoint is unreachable or the challenge did not load, the right outcome
    // is an unscreened enquiry, not a lost one.
    console.warn(`[botid] check unavailable on ${label}, allowing:`, err)
    return false
  }
}
