# Enquiries: stored first, quarantined when suspect

Ported from BrandBloomPayload (2026-10-09). Admin: **Leads → Enquiries**.

## What changed

Before, `/api/ghl/lead-capture` (booking step 1) and `/api/ghl/form-submit` (contact form and
job application) wrote straight to GoHighLevel and kept nothing.

- A submission the bot screen flagged was answered "ok" and **dropped**. A false positive was invisible.
- If GoHighLevel was down, rate limited or its token expired, the lead was **lost**.

Now every submission is **stored first** in the `enquiries` collection, then synced:

| Outcome | Sync status | In GoHighLevel? | Can be recovered? |
|---|---|---|---|
| Looks automated | Quarantined (reason shown) | No | Yes, release it |
| GoHighLevel failed | Failed (reason in "Sync attempts") | No | Yes, set Pending to retry |
| GHL_LOCATION_ID not set | Skipped | No | Yes, set Pending |
| Fine | Synced (contact id shown) | Yes | n/a |

The visitor is told "ok" whenever the lead was stored, because it was.

## The three spam signals (`src/lib/leads/spam.ts`)

None of them rejects anything; each only adds a reason to the quarantine.

1. **Honeypot**: a hidden field named `fax` (`src/components/Honeypot`). Present on the contact form and the Join Our Team form. Not on booking step 1, which is not a `<form>`.
2. **Fill time**: under 2 seconds on screen. The browser sends a *duration* (`fillMs`), not a timestamp. BrandBloomPayload compares a client timestamp to the server clock, so a visitor whose clock runs fast could be quarantined by mistake. A duration has no such problem. (Worth backporting.)
3. **Vercel BotID** (`src/lib/botid.ts`): the browser challenge. Basic mode. It reports not-a-bot in development; use `BOTID_DEV_VERDICT=BAD-BOT` to force the quarantine path.

## Releasing a lead

Open the row, read **Why it was quarantined**, set **Sync status** to **Pending**, save. The sync runs a few
seconds *after* the save (reload to see Synced or Failed). Picking "Synced" by hand is read as a request to
send: the field cannot record an outcome the sync did not produce.

A released lead keeps its **original** consent timestamp, IP and wording version. Those are captured on the server at submission and stored on the row, so the evidence is never re-stamped at release.

## Known limits

- **Resume files** are uploaded to GoHighLevel during the live submission and are not kept on the row. A job application that is quarantined and released later has no resume; the filename is recorded so the applicant can be asked again.
- **Opportunities** are created once per row (the id is stored), so a retry cannot duplicate one.
- **No automatic retry.** There is no job queue or cron here (BrandBloomPayload has one). A Failed row waits until someone sets it to Pending. A Vercel cron hitting a small endpoint would close that gap.
- **GoHighLevel custom fields.** `getGhlFields()` swallows a lookup failure and carries on with no custom fields, so a CRM hiccup at that moment can create a contact without its consent fields and the row will say Synced. The consent evidence is still on the row here.
- **The final booking submit (`/api/bookings/submit`) is not covered.** See the warning in `src/instrumentation-client.ts`.

## Tested 2026-10-09 (CRM pointed at a dead address, so nothing reached the live account)

Normal, honeypot, too-fast, both, careers-with-resume, booking step 1 twice for one draft (one row), invalid input (400), forced BotID verdict, release from quarantine, manual "Synced" converted to Pending, GoHighLevel not configured (Skipped), and deletion of every test row.

**Not tested:** a real browser clicking through the forms; and the live GoHighLevel round trip (a real contact with its custom fields).

## Found while building it

The first version of the release hook ran the sync inside the save's own database transaction. The sync then wrote to the same row from another connection, which waited for the lock the save still held: a deadlock that ended with Postgres killing the connection. The sync now runs after the save commits. BrandBloomPayload's hook runs its job queue inside the hook and may have the same problem; not verified there.
