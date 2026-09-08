# Font audit

Findings from a read of `src/app/(app)/globals.css` and `src/app/(app)/layout.tsx`.
Verified by reading the files, not from memory. Nothing here has been changed.

The headline item is #1. The rest are worth fixing while you are in there.

---

## 1. Poppins is declared twice, and one of them silently does nothing

`globals.css:50`

```css
--font-sans: 'Poppins', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

`globals.css:53`

```css
--font-body: var(--font-poppins), system-ui, sans-serif;
```

Line 53 is correct. **Line 50 is dead.**

`next/font` does not register the family under the name you asked for. It
self-hosts the files and generates an obfuscated family name, something like
`__Poppins_a1b2c3`, and it exposes that name **only** through the CSS variable
declared in the loader:

```ts
// layout.tsx:26
const poppins = Poppins({ …, variable: '--font-poppins' })
```

So `font-family: 'Poppins'` matches no registered family, and the stack falls
straight through to `-apple-system`. Anything reading `--font-sans` renders in
the **system font**. Anything reading `--font-body` renders in **real Poppins**.

That is two different typefaces on the same page. It looks almost right, which
is exactly why it survives review.

### Why this happened

The comment at `layout.tsx:17` explains the migration:

> Self-hosted at build time by next/font. This replaces the CSS @import of
> fonts.googleapis.com in globals.css, which was render-blocking…

When the `@import` from Google was removed, `'Poppins'` **was** a real registered
family name and line 50 worked. After the migration it stopped working, and
nothing errors when a font-family lookup fails. `--font-body` was updated to the
variable; `--font-sans` was missed.

### The fix

```css
--font-sans: var(--font-poppins), -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

Then check the two call sites of `var(--font-sans)` and the one call site of
`--font-family-sans` actually want Poppins. Usage counts today:

| Token | Call sites |
|---|---|
| `--font-heading` | 8 |
| `--font-body` | 6 |
| `--font-sans` | 2 |
| `--font-family-sans` | 1 |

### The rule to carry forward

**A font loaded through `next/font` can only ever be referenced through its
`variable`.** If you see a quoted family name in CSS for a font that is loaded
in `layout.tsx`, it is broken. Grep for quoted family names and check each one
against the loader.

---

## 2. `--font-heading` is Soleil, loaded a different way

`globals.css:52`

```css
--font-heading: 'Soleil', system-ui, sans-serif;
```

This one **is** correct, and it is worth understanding why, because it looks
identical to the broken line above.

Soleil is not a `next/font` font. It is declared with hand-written `@font-face`
rules starting at `globals.css:12`, pointing at `/fonts/soleil/*.woff2`. Those
register the literal family name `Soleil`, so a quoted lookup resolves.

The files are present, all four weights:

```
SoleilBold.otf    SoleilBold.woff2
SoleilBook.otf    SoleilBook.woff2
SoleilLight.otf   SoleilLight.woff2
SoleilRegular.otf SoleilRegular.woff2
```

So: two loading mechanisms in one stylesheet, with opposite rules for how you
reference them. Quoted name for `@font-face`, variable for `next/font`. That
inconsistency is the trap.

---

## 3. A blanket `letter-spacing` on every heading

`globals.css`, in the base layer

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  letter-spacing: 1px;
  font-size: auto;
  font-weight: auto;
}
```

Three problems in four lines.

**`letter-spacing: 1px` on all headings.** Invisible at 16-24px, visibly wrong at
display sizes. It is also the wrong direction: large type generally wants
*negative* tracking, so this is backwards at exactly the sizes where tracking is
noticeable. Every large heading needs `tracking-normal` to undo it, and nobody
remembers.

In the BrandBloom clone this made a 60px hero headline measurably wrong against
the reference design, and it took a computed-style comparison to find.

**`font-size: auto` is not valid CSS.** `font-size` does not accept `auto`. The
declaration is dropped.

**`font-weight: auto` is not valid CSS either.** Same, dropped.

Both are inert. They suggest someone intended to reset something and it never
took effect. Decide what was meant rather than preserving them.

---

## 4. `--font-family-serif` points at a sans

`globals.css:56`

```css
--font-family-serif: var(--font-heading);
```

`--font-heading` is Soleil, a sans. Anything reaching for a serif silently gets a
sans. Either point it at a real serif or delete the token.

Also worth noting: `--font-serif` is defined somewhere in `src` and referenced
nowhere. Dead.

---

## 5. Hardcoded font names inside components

A themed system should get every font from a token. A literal family name inside
a component is a sign the file came from elsewhere, or predates the token system.

Grep `src/blocks` for quoted font names. In the BrandBloom clone the same search
turned up an inline `<style>` block in a form component using
`var(--font-sans, 'Poppins', sans-serif)`, which has the same defect as #1 in its
fallback position.

---

## 6. Not a font bug, but it looks like one

If you hit this during a build:

```
Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

It is Turbopack cache corruption, not a font configuration problem.

```bash
rm -rf .next
```

Worth knowing before anyone spends an hour rewriting the font setup.

---

## How to verify a fix

Failed font lookups are silent, so read computed styles rather than trusting the
markup. In the browser console on a rendered page:

```js
[...document.querySelectorAll('h1,h2,p,nav a')]
  .map(el => [el.tagName, getComputedStyle(el).fontFamily.split(',')[0]])
```

Every entry should show either a `__Poppins_*` obfuscated name or `Soleil`.
Anything showing `-apple-system`, `system-ui` or `Segoe UI` is falling back.
