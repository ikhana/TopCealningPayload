# Stage 8.3 — Push the booking confirmation email template to GHL

**Status**: `[x]` done · **Time**: ~15 min · **Changes**: 1 file added + 1 GHL template + .env entry

---

## What changed

### New file: `docs/email-templates/01-booking-confirmation.ghl.html`

GHL-ready version of the design template. Differences from the original
`design/emails/01-booking-confirmation.html`:

| What | Before | After |
|---|---|---|
| Logo path | `../assets/logo.jpg` (broken in email) | Hosted GHL Media URL |
| Service name var | `{{appointment.service_name}}` | `{{contact.service}}` |
| Date var | `{{appointment.start_date}}` | `{{contact.service_date}}` |
| Time var | `{{appointment.start_time}}` | `{{contact.service_time}}` |
| Booking # var | `{{appointment.id}}` | `{{contact.confirmation_code}}` |
| Total row | (missing) | New row using `{{contact.service_total}}` |
| Reschedule link | `{{appointment.reschedule_link}}` | Hardcoded `topcleaningteam.com/account/bookings` |
| Pre-header | (missing) | Hidden div: "Booking #{{contact.confirmation_code}} — see details..." |
| Thumbnail SVG | (in original) | Removed (GHL doesn't use it) |

### Pushed to GHL

```
POST /emails/builder
{
  "locationId": "yI9kN6pMxVVk486ciX3N",
  "name": "Booking Confirmation",
  "subject": "Your cleaning is confirmed",
  "fromName": "Top Cleaning Team",
  "fromEmail": "Topcleaningfl@gmail.com",
  "type": "html",
  "html": "<the GHL-ready HTML>"
}
```

Returned template ID: `6a0a0b7188f5577e47a4d501`

### `.env`

```
GHL_TEMPLATE_BOOKING_CONFIRMATION=6a0a0b7188f5577e47a4d501
```

---

## Subject line + pre-header

- **Subject**: `Your cleaning is confirmed`
- **Pre-header** (inbox preview line): `Booking #{{contact.confirmation_code}} — see details and what to expect`

Both per the RESEARCH.md guidance (action-first subject, info-extending pre-header).

---

## Re-pushing if we change the template

To update the same template (instead of creating a new one):

```bash
PUT /emails/builder/{templateId}
```

Same body shape as POST. Otherwise GHL will create a duplicate.

---

## Verify

1. GHL → Marketing → Emails → Templates → "Booking Confirmation" appears
2. Click preview → renders correctly with placeholder values
3. Send test to a contact that has all 5 custom fields populated
4. Email arrives with:
   - Top Cleaning logo
   - First name in greeting
   - Service / Date / Time / Address / Total / Booking # all resolved
   - Working teal "Manage Booking" CTA

---

## Unlocks

- **Stage 9** — workflow setup. Now that the template exists, we wire a workflow:
  - Trigger: Contact Tag Added = `booking-confirmed`
  - Action: Send Email = "Booking Confirmation"
  - Allow Re-entry: Off

---

## When done

1. Verify in GHL UI (template appears + preview correct)
2. Send test email to yourself
3. Commit: `Stage 8.3: push booking confirmation email template to GHL`
4. Move to Stage 9
