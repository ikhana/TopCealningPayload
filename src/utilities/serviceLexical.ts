// src/utilities/serviceLexical.ts
// Helpers that build Payload's Lexical RichText JSON from plain TS values.
// Used by the service pages so we can keep serviceContent.ts readable
// while still feeding AboutSplit / Faq blocks the Lexical shape they expect.

type LexicalText = {
  type: 'text'
  text: string
  format: number
  mode: 'normal'
  style: ''
  detail: 0
  version: 1
}

type LexicalLink = {
  type: 'link'
  children: LexicalText[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
  fields: { url: string; newTab: boolean; linkType: 'custom' }
}

type LexicalParagraph = {
  type: 'paragraph'
  children: Array<LexicalText | LexicalLink>
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
  textFormat: 0
}

type LexicalHeading = {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3'
  children: LexicalText[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
}

export type LexicalRoot = {
  root: {
    type: 'root'
    children: Array<LexicalParagraph | LexicalHeading>
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

const FORMAT_BOLD = 1

const text = (str: string, format = 0): LexicalText => ({
  type: 'text',
  text: str,
  format,
  mode: 'normal',
  style: '',
  detail: 0,
  version: 1,
})

const paragraph = (children: Array<LexicalText | LexicalLink>): LexicalParagraph => ({
  type: 'paragraph',
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  textFormat: 0,
})

const heading = (tag: 'h1' | 'h2' | 'h3', str: string): LexicalHeading => ({
  type: 'heading',
  tag,
  children: [text(str)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const link = (url: string, label: string): LexicalLink => ({
  type: 'link',
  children: [text(label)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  fields: { url, newTab: false, linkType: 'custom' },
})

const root = (children: Array<LexicalParagraph | LexicalHeading>): LexicalRoot => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

// ── Hero builder ──────────────────────────────────────────────────
// Produces the Lexical shape AboutSplit expects:
//   • First <p><strong>...</strong></p>  → teal mono kicker
//   • <h1>...</h1>                       → big navy heading
//   • <p>body text</p>                   → body paragraph
//   • <p><a href=...>label</a></p>       → teal CTA button
export function buildHeroLexical(parts: {
  kicker?: string
  title: string
  body?: string
  ctaText?: string
  ctaHref?: string
}): LexicalRoot {
  const children: Array<LexicalParagraph | LexicalHeading> = []

  if (parts.kicker) {
    children.push(paragraph([text(parts.kicker, FORMAT_BOLD)]))
  }
  children.push(heading('h1', parts.title))

  if (parts.body) {
    children.push(paragraph([text(parts.body)]))
  }
  if (parts.ctaText && parts.ctaHref) {
    children.push(paragraph([link(parts.ctaHref, parts.ctaText)]))
  }
  return root(children)
}

// ── Plain paragraph builder ──────────────────────────────────────
// Wraps a plain string in a single-paragraph Lexical doc.
// Used for FAQ answers, CTA descriptions, etc.
export function buildPlainLexical(str: string): LexicalRoot {
  return root([paragraph([text(str)])])
}
