// src/data/testimonials.ts
// Real Google Business Profile reviews for Team Top Cleaning.
//
// WHY THIS FILE EXISTS
// TCTestimonials previously rendered four fabricated testimonials hardcoded in
// the component: "Sarah Andersen", "James Miller", "Rebecca Lynch (Ops Manager,
// TechBase)" and "Tom Hiddles", with stock avatars person1-5.jpg. That is Twilio
// 30962, deceptive marketing, and it is NON-RESUBMITTABLE for A2P 10DLC. It was
// live on the homepage. See docs/a2p-compliance-handoff.md section 4.10.
//
// RULES FOR EDITING THIS FILE
//
// 1. Every entry must be a real review that exists publicly on the Google
//    Business Profile. The compliance test is that a reviewer can search the
//    quoted text and find it. If it cannot be found, it cannot be here.
// 2. Quote text VERBATIM. Do not tidy grammar, trim, or improve it. Altering
//    the words is the deceptive part, not the quoting.
// 3. No photographs of reviewers. Using a stock face next to a real quote is
//    still deceptive, and using a real face needs their permission. The UI
//    renders a monogram instead.
// 4. Do not invent job titles or roles. The old entries had "Ops Manager,
//    TechBase" attached to a person who does not exist.
// 5. Never add Review or AggregateRating schema for these. Marking up your own
//    reviews on your own site is self-serving markup: Google will not render
//    stars and since July 2026 it carries manual-action risk. The reviews live
//    on the GBP listing and LocalBusinessSchema links to it via sameAs.
//
// Source: https://maps.app.goo.gl/Uo5cfK7XpPV3QV6Q9
// Captured 2026-08-22. Names and wording exactly as Google displays them.

export type Testimonial = {
  /** Reviewer name exactly as Google shows it. Not tidied. */
  name: string
  /** Review body, verbatim. */
  quote: string
  /** Relative age as shown on the listing when captured. */
  when: string
  /** Star rating. All current reviews are 5. */
  rating: number
  /**
   * True when Google machine-translated the review. Shown in the UI so the
   * quote is not presented as the reviewer's own English wording.
   */
  translated?: boolean
}

// Ordered longest-first: the detailed reviews carry more weight than the
// one-liners, and the section only shows the first few.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Nanette Duncan',
    quote:
      'My experience with Top Cleaning has been absolutely great! The girls are very professional and extremely polite. The work done was everything I asked for and more. The apartment feels clean and refreshing. I really enjoyed working with them and I look forward to them coming again. Thank you Geraldine and Claudia. See you next time.',
    when: '2 weeks ago',
    rating: 5,
  },
  {
    name: 'Laura Cuervo',
    quote:
      'I hired their deep cleaning service for the bathrooms and it was a complete game-changer! Excellent service, highly recommended. The staff were very punctual and professional. Thank you so much!',
    when: '4 weeks ago',
    rating: 5,
    translated: true,
  },
  {
    name: 'Ivette Sykora Rodas',
    quote:
      'This company pays close attention to the details and goes above and beyond to assist with anything. Highly highly recommend, will contact them again to clean my home.',
    when: 'a month ago',
    rating: 5,
  },
  {
    name: 'Sophia wisdom',
    quote:
      'Team Top Cleaning is the best cleaning service I’ve used so far. The staff was friendly and did a perfect job. Super satisfied!',
    when: '4 months ago',
    rating: 5,
  },
  {
    name: 'Jennifer Battaglia',
    quote: 'Very happy with the service and will hire them again',
    when: '3 weeks ago',
    rating: 5,
  },
]

/** Public listing, so a reader (or an A2P reviewer) can verify any of the above. */
export const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/Uo5cfK7XpPV3QV6Q9'

/** Initial used for the monogram avatar. */
export function initialOf(name: string): string {
  return (name.trim()[0] ?? '?').toUpperCase()
}
