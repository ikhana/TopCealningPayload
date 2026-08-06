// src/data/serviceContent.ts
// Static, server-rendered content for the /services/[slug] pages.
// Each entry feeds: hero (AboutSplit), what's included (TCWhatsIncluded),
// the universal TCWhyTop section (reused), and the FAQ (Faq block, light theme).
//
// Adding a service:
//   1. Add a new key here following the ServiceContent shape
//   2. The /services/[slug] route will pick it up automatically via
//      generateStaticParams.

export type ServiceSlug =
  | 'residential'
  | 'deep-cleaning'
  | 'move-in-out'
  | 'commercial'
  | 'airbnb'
  | 'post-construction'
  | 'handyman'

export type ServiceContent = {
  slug: ServiceSlug
  meta: {
    title: string
    description: string
  }
  hero: {
    kicker: string
    title: string
    body: string
    ctaText: string
    ctaHref: string
    image: string
    imageAlt: string
  }
  whatsIncluded: {
    ghostKicker: string
    mainLine: string
    secondaryLine: string
    intro: string
    sections: Array<{
      title: string
      items: string[]
    }>
  }
  faq: {
    eyebrow: string
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  }
  related: ServiceSlug[]
}

export const SERVICES = {
  'post-construction': {
    slug: 'post-construction',
    meta: {
      title: 'Post Construction Cleaning Fort Lauderdale | Top Cleaning Team',
      description:
        'Post construction cleaning in Fort Lauderdale and across Broward County. We handle drywall dust, paint splatter, fixture polishing, and window detail.',
    },
    hero: {
      kicker: 'POST CONSTRUCTION',
      title: 'Move-In Ready After the Build.',
      body:
        'A detailed, top-to-bottom service designed to transform newly built or renovated spaces into pristine, move-in ready properties — every speck of construction dust gone, every fixture polished, every surface inspected.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/post-construction-cleaning.jpg',
      imageAlt: 'Post construction cleaning crew detailing a newly renovated South Florida home',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Every Surface',
      secondaryLine: 'covered.',
      intro:
        'Our Post-Construction Cleaning is a complete checklist for new builds and renovations. Every line below is included in the base scope — no upsell surprises.',
      sections: [
        {
          title: 'Dust & Debris Removal',
          items: [
            'Full removal of construction dust and fine debris from all surfaces',
            'Vacuuming and mopping all flooring with attention to edges and corners',
            'Cleaning of light fixtures, switches, vents, and hard-to-reach areas',
          ],
        },
        {
          title: 'Walls, Trims & Storage',
          items: [
            'Deep cleaning of walls, baseboards, doors, trims, and fixtures',
            'Cleaning inside closets, cabinets, and storage areas',
            'Removal of paint splatter, stickers, adhesive residue, and light construction marks',
          ],
        },
        {
          title: 'Kitchen Detail',
          items: [
            'Countertops, backsplash, and exterior + interior of cabinets',
            'Appliance cleaning — exterior surfaces wiped, polished, and detailed',
            'Sink and faucet sanitized',
          ],
        },
        {
          title: 'Bathrooms, Glass & Final Inspection',
          items: [
            'Intensive bathroom sanitization — showers, tubs, toilets, mirrors, and fixtures',
            'Professional window, glass, and track cleaning for a crystal-clear finish',
            'Final quality inspection to ensure a spotless, dust-free, ready-to-use space',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'How soon after construction can you start?',
          answer:
            'As soon as the contractors are out and the site is safe to enter. We typically schedule the morning after the final walkthrough so you can move in spotless the same week.',
        },
        {
          question: 'Do I need to provide cleaning supplies?',
          answer:
            'No. We bring HEPA vacuums, microfiber cloths, eco-friendly degreasers, and every tool required for fine dust extraction. You provide the keys, we handle everything else.',
        },
        {
          question: "What if there's still some construction happening?",
          answer:
            'We can do a "rough clean" mid-project to clear the worst of the debris and return for the full detail clean once work is complete. Two visits, two quotes — common on larger renovations.',
        },
        {
          question: 'How long does it take?',
          answer:
            'Depends on square footage and finish level. A 1,500 sq ft renovation usually takes 4–6 hours; a 4,000 sq ft new build can run 1–2 days. We give you a firm estimate during the walkthrough.',
        },
        {
          question: 'Do you handle exterior cleanup too?',
          answer:
            'Driveways, walkways, and ground-level exterior windows — yes. Roofs and second-floor exteriors require a specialty contractor; we can refer one we trust.',
        },
        {
          question: 'Will dust come back after you leave?',
          answer:
            'Post-construction dust often re-settles for 1–2 days as the HVAC system pushes it through the ducts. We offer a discounted 48-hour touch-up clean if you want a second pass before move-in.',
        },
      ],
    },
    related: ['deep-cleaning', 'move-in-out'],
  },

  // ─── RESIDENTIAL (Regular Cleaning) ─────────────────────────────
  residential: {
    slug: 'residential',
    meta: {
      // Primary keyword is "house cleaning service", not "residential cleaning".
      // "Residential" is how the industry talks; customers search "house cleaning"
      // and "maid service". See 02-keyword-map.md.
      title: 'House Cleaning Service Fort Lauderdale | Top Cleaning Team',
      description:
        'House cleaning and maid service in Fort Lauderdale and Broward County. Recurring or one-time visits, eco-friendly products, and a satisfaction guarantee.',
    },
    hero: {
      kicker: 'RESIDENTIAL',
      title: 'Cleaning That Fits Your Routine.',
      body:
        'Custom-tailored residential cleaning that keeps your home consistently fresh. Eco-friendly products, background-checked crews, and a quality check before we leave — every visit.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/residential1.jpg',
      imageAlt: 'Freshly cleaned dining and living area in a South Florida home',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Every Room',
      secondaryLine: 'covered.',
      intro:
        'Our Regular Cleaning is built for ongoing maintenance — a consistent baseline so your home never feels behind. Every visit covers the rooms below from top to bottom.',
      sections: [
        {
          title: 'Whole House / General',
          items: [
            'Vacuum all carpets and rugs',
            'Sweep and mop all hard floors',
          ],
        },
        {
          title: 'Kitchen',
          items: [
            'Clean outside refrigerator',
            'Clean outside of microwave',
            'Wipe down countertops and backsplash',
            'Clean and sanitize sink and faucet',
            'Sweep and mop kitchen floor',
            'Clean stove',
          ],
        },
        {
          title: 'Bathrooms',
          items: [
            'Scrub toilet (inside and out)',
            'Scrub tub and shower walls',
            'Clean sink and faucet',
            'Clean mirrors and any glass',
            'Wipe counters and shelves',
            'Clean outside of cabinets and drawers',
            'Mop bathroom floor',
          ],
        },
        {
          title: 'Bedrooms',
          items: [
            'Wipe down tables, nightstands, dressers',
            'Clean mirrors and windows',
            'Vacuum or sweep the floor',
            'Mop where necessary',
            'Ventilate for air circulation',
            'Dust furniture, shelves, and picture frames',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'How often should I book a regular cleaning?',
          answer:
            'Most clients land on weekly or bi-weekly visits — that pace keeps maintenance minimal and the home consistently fresh. Monthly works for smaller spaces or lower-traffic homes.',
        },
        {
          question: 'Do I need to be home during the cleaning?',
          answer:
            'No. Many of our recurring clients give us a key, code, or smart-lock access and run errands during the visit. Whatever feels right for you.',
        },
        {
          question: 'Are your products safe for kids and pets?',
          answer:
            "Yes. We use eco-friendly, non-toxic products on every visit and can swap to fragrance-free options on request. Just let us know if anyone in the home has allergies or sensitivities.",
        },
        {
          question: 'What if I want to skip a week?',
          answer:
            'No problem — recurring schedules can be paused or rescheduled with at least 24 hours notice. No cancellation fees for plan members.',
        },
        {
          question: 'Do you bring your own supplies?',
          answer:
            "Yes. We come fully equipped — vacuums, mops, microfiber cloths, eco-friendly cleaners, everything. You don't need to provide anything.",
        },
        {
          question: 'What if I am not satisfied with the result?',
          answer:
            "Tell us within 24 hours and we will return to re-clean the area at no additional cost. Our satisfaction guarantee covers every visit.",
        },
      ],
    },
    related: ['deep-cleaning', 'move-in-out'],
  },

  // ─── DEEP CLEANING ──────────────────────────────────────────────
  'deep-cleaning': {
    slug: 'deep-cleaning',
    meta: {
      title: 'Deep Cleaning Service Fort Lauderdale | Top Cleaning Team',
      description:
        'Deep cleaning in Fort Lauderdale and Broward County. Baseboards, interior windows, heavy stovetop scrub, and intensive bathroom work. Ideal for first visits.',
    },
    hero: {
      kicker: 'DEEP CLEANING',
      title: "When Surface Clean Isn't Enough.",
      body:
        'Recommended for first visits, post-illness recovery, or whenever the home needs a reset. Every corner, every crevice, every overlooked surface — sanitized and refreshed.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/deep-cleaning1.jpg',
      imageAlt: 'Polished granite countertop gleaming after a Top Cleaning deep clean',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Beyond the',
      secondaryLine: 'baseline.',
      intro:
        'Deep Cleaning covers everything in Regular Cleaning, plus heavy-scrub items, interior windows (up to 10), baseboards, and detailed cabinet exteriors. Recommended for first visits or post-renovation refreshes.',
      sections: [
        {
          title: 'Whole House / General',
          items: [
            'Vacuum all carpets and rugs',
            'Sweep and mop all hard floors',
            'Clean exposed baseboards and wall marks',
            'Heavy scrub of stovetop',
            'Clean interior windows (up to 10)',
          ],
        },
        {
          title: 'Kitchen — Detailed',
          items: [
            'Clean outside of refrigerator',
            'Clean outside of microwave',
            'Wipe down countertops and backsplash',
            'Wipe down exterior of cabinets',
            'Clean and sanitize sink and faucet',
            'Sweep and mop kitchen floor',
            'Heavy scrub of kitchen tile and grout',
          ],
        },
        {
          title: 'Bathrooms — Intensive',
          items: [
            'Scrub toilet inside and out',
            'Scrub tub and shower walls',
            'Clean sink and faucet',
            'Clean mirrors and any glass',
            'Wipe counters and shelves',
            'Clean outside of cabinets and drawers',
            'Mop bathroom floor',
          ],
        },
        {
          title: 'Bedrooms',
          items: [
            'Wipe down tables, nightstands, dressers',
            'Clean mirrors and windows',
            'Vacuum or sweep the floor',
            'Mop where necessary',
            'Ventilate for air circulation',
            'Dust furniture, shelves, and picture frames',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: "How is Deep Cleaning different from Regular Cleaning?",
          answer:
            "Deep cleaning adds heavy-scrub items, baseboards, exterior cabinet wiping, interior windows, and kitchen tile + grout work. Regular cleaning covers daily maintenance; deep cleaning resets the baseline.",
        },
        {
          question: 'How long does a deep clean take?',
          answer:
            "Typically 4-8 hours for an average 2-3 bedroom home, depending on condition. We give you a firm time estimate during the walkthrough or booking.",
        },
        {
          question: 'Do you recommend a deep clean as the first visit?',
          answer:
            "Yes — for most homes, a deep clean as the first visit gets us to a true baseline. Recurring regular cleans after that can keep the home there with much less effort.",
        },
        {
          question: 'Do you clean inside the oven or fridge?',
          answer:
            "Interior of appliances is not part of the standard deep clean — that's included in our Move In / Move Out service. We can quote it as an add-on if you want it on a deep clean visit.",
        },
        {
          question: 'What products do you use?',
          answer:
            "Eco-friendly, non-toxic cleaners safe for kids and pets, paired with HEPA vacuums and microfiber. We adjust to fragrance-free or hypoallergenic on request.",
        },
        {
          question: 'Is there a satisfaction guarantee?',
          answer:
            "Yes. If anything is not up to standard, tell us within 24 hours and we return to re-clean the area at no additional cost.",
        },
      ],
    },
    related: ['residential', 'move-in-out'],
  },

  // ─── MOVE IN / MOVE OUT ──────────────────────────────────────────
  'move-in-out': {
    slug: 'move-in-out',
    meta: {
      title: 'Move In / Move Out Cleaning Fort Lauderdale | Top Cleaning Team',
      description:
        'Move in and move out cleaning in Fort Lauderdale and Broward County. Interior of appliances, cabinets and garage, built to secure your full deposit back.',
    },
    hero: {
      kicker: 'MOVE IN / MOVE OUT',
      title: 'Spotless Handoff, Both Directions.',
      body:
        'Whether you are starting fresh or leaving spotless, our move cleaning covers every interior surface — fridge, oven, cabinets, closets, garage — so you hand off a property that passes any inspection.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/move-in-out1.jpg',
      imageAlt: 'Spotless kitchen cleaned and ready for move-in in a South Florida home',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Every Square',
      secondaryLine: 'inch detailed.',
      intro:
        'Our Move In / Move Out Cleaning is our most thorough service. Includes everything in a deep clean plus interior of all appliances, full cabinet interiors, and garage / basement sweep.',
      sections: [
        {
          title: 'Whole House / General',
          items: [
            'Vacuum all carpets and rugs',
            'Sweep and mop all hard floors',
            'Clean exposed baseboards and wall marks',
            'Heavy scrub of stovetop',
            'Clean interior windows (up to 10)',
          ],
        },
        {
          title: 'Kitchen — Inside + Out',
          items: [
            'Clean outside AND inside refrigerator',
            'Clean outside of microwave',
            'Clean outside AND inside oven',
            'Wipe down countertops and backsplash',
            'Clean exterior AND interior of cabinets',
            'Clean and sanitize sink and faucet',
            'Sweep and mop kitchen floor',
            'Heavy scrub of kitchen tile and grout',
          ],
        },
        {
          title: 'Bathrooms + Bedrooms',
          items: [
            'Scrub toilet, tub, shower walls',
            'Clean sink, faucet, mirrors, glass',
            'Wipe counters and shelves',
            'Cabinet exteriors detailed',
            'Bedrooms: dust, vacuum, mop, ventilate',
            'Dust furniture, shelves, and picture frames',
          ],
        },
        {
          title: 'Garage + Basement',
          items: [
            'Garage swept',
            'Basement swept',
            'Final walkthrough for missed corners',
            'Inspection-ready handoff',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'Will this help me get my full deposit back?',
          answer:
            "That is exactly what this service is designed for. Our move-out cleaning is inspection-ready — we have years of experience with what landlords and property managers look for, and we cover every inch.",
        },
        {
          question: 'How long does a move cleaning take?',
          answer:
            "Depends on size and condition. A 1-bedroom apartment typically takes 4-6 hours; a 3-4 bedroom home can run 6-10 hours. We give you a firm estimate during booking.",
        },
        {
          question: 'Do you do this for landlords and property managers?',
          answer:
            "Yes — we work with several South Florida landlords and property managers on turnover cleans between tenants. We can invoice directly if needed.",
        },
        {
          question: 'Do you clean inside cabinets and the oven?',
          answer:
            "Yes — interior of all cabinets, interior of the oven and refrigerator are all part of the standard move cleaning scope. No upsells.",
        },
        {
          question: 'Can you do this same-day after the movers leave?',
          answer:
            "Often yes, depending on availability. We recommend booking at least 48 hours in advance, but we keep some same-day slots open for tight handoffs.",
        },
        {
          question: 'What about the walls and ceilings?',
          answer:
            "Wall marks and scuffs are included up to standard cleaning intensity. Patching, painting, and repairs are not part of cleaning scope, but they are part of our Handyman Services — book both and we will schedule the crews back to back.",
        },
      ],
    },
    related: ['deep-cleaning', 'post-construction'],
  },

  // ─── COMMERCIAL ──────────────────────────────────────────────────
  commercial: {
    slug: 'commercial',
    meta: {
      title: 'Commercial Cleaning Service Fort Lauderdale | Top Cleaning Team',
      description:
        'Commercial, office and janitorial cleaning in Fort Lauderdale and Broward County. Flexible scheduling, industry compliance, and full liability coverage.',
    },
    hero: {
      kicker: 'COMMERCIAL',
      title: 'Workspace Cleanliness, On Your Schedule.',
      body:
        'Reliable commercial cleaning that fits around your operations — early mornings, evenings, weekends. We handle restrooms, breakrooms, high-touch sanitization, and the daily details that keep your team comfortable and your clients impressed.',
      ctaText: 'Request a Quote',
      ctaHref: '/booking',
      image: '/images/services/commercial.jpg',
      imageAlt: 'Top Cleaning team disinfecting a South Florida commercial office space',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Office Standard',
      secondaryLine: 'every visit.',
      intro:
        'A consistent commercial cleaning checklist designed to keep workspaces professional, healthy, and inspection-ready. Customizable to your office layout and traffic patterns.',
      sections: [
        {
          title: 'Common Areas',
          items: [
            'Dust desks, tables, and accessible surfaces',
            'Vacuum carpets and rugs',
            'Sweep and mop hard floors',
            'Organize common areas',
            'Spot clean walls and fingerprints',
            'Dust window sills and ledges',
          ],
        },
        {
          title: 'Restrooms + Sanitation',
          items: [
            'Clean and sanitize restrooms',
            'Refill soap, paper towels, and toilet paper (if provided)',
            'Disinfect high-touch areas (door handles, light switches, railings)',
            'Empty trash bins and replace liners',
          ],
        },
        {
          title: 'Breakroom + Kitchen',
          items: [
            'Clean breakroom and kitchen areas',
            'Wipe countertops, sinks, and appliance exteriors',
            'Clean glass doors and interior glass surfaces',
            'Empty kitchen trash and replace liners',
          ],
        },
        {
          title: 'Final Quality Check',
          items: [
            'Walkthrough inspection of every cleaned area',
            'Restock confirmation',
            'Reset of common areas to opening condition',
            'Logbook entry or photo report on request',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'Can you clean outside of business hours?',
          answer:
            "Yes — early mornings, evenings, and weekend slots are available. Most of our commercial clients prefer after-hours so the office is fresh when staff arrives.",
        },
        {
          question: 'Are you insured for commercial work?',
          answer:
            "Yes. We carry full liability and worker's compensation coverage. Certificates of insurance can be provided to property managers or landlords on request.",
        },
        {
          question: 'How is pricing structured?',
          answer:
            "Commercial pricing is custom-quoted based on square footage, frequency, and scope. We walk through the space, give you a transparent monthly price, and lock it for the contract term.",
        },
        {
          question: 'Do you handle medical, dental, or food-service spaces?',
          answer:
            "Yes — we have crews trained in OSHA / bloodborne pathogen protocols for medical and dental offices, and food-service safe sanitation for restaurants and cafés. Mention your industry when you book.",
        },
        {
          question: 'Can we customize the checklist for our office?',
          answer:
            "Absolutely. The default scope above is a starting point. We adjust based on your traffic patterns, priority areas, and any specialty needs (conference rooms, server rooms, lobbies).",
        },
        {
          question: 'Do you provide supplies?',
          answer:
            "Yes — we bring all standard cleaning supplies. For restroom restock items (soap, paper, etc.), we can either supply them at cost or use yours, whichever you prefer.",
        },
      ],
    },
    related: ['residential', 'airbnb'],
  },

  // ─── AIRBNB / SHORT-TERM RENTAL ──────────────────────────────────
  airbnb: {
    slug: 'airbnb',
    meta: {
      title: 'AirBnB Turnover Cleaning Fort Lauderdale | Top Cleaning Team',
      description:
        'AirBnB turnover and vacation rental cleaning in Fort Lauderdale and Broward County. Fresh linens, restocking, damage inspection, and photos after every clean.',
    },
    hero: {
      kicker: 'AIRBNB / SHORT TERM',
      title: 'Turnovers Built for 5-Star Reviews.',
      body:
        'Reliable, fast turnovers between guests so your listing stays spotless and your ratings stay high. Fresh linens, restocked essentials, damage inspection, and a photo report after every clean — so you always know what we left behind.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/airbnb-cleaning1.jpg',
      imageAlt: 'Guest-ready bedroom prepared for an AirBnB turnover in South Florida',
    },
    whatsIncluded: {
      ghostKicker: "What's Included",
      mainLine: 'Guest-Ready',
      secondaryLine: 'every time.',
      intro:
        'A complete turnover checklist designed for AirBnB, VRBO, and other short-term rental hosts. Every line below is included in the base turnover fee — laundry, restock, photos, all of it.',
      sections: [
        {
          title: 'Complete Property Cleaning',
          items: [
            'Make all beds with fresh linens',
            'Replace used towels with clean towels',
            'Dust all furniture and surfaces',
            'Vacuum carpets, rugs, and upholstery',
            'Sweep and mop floors',
            'Clean and sanitize bathrooms',
            'Clean mirrors and glass surfaces',
            'Clean kitchen countertops and backsplash',
            'Wash and sanitize sink',
          ],
        },
        {
          title: 'Linen + Laundry Service',
          items: [
            'Fresh linen and towel change every turnover',
            'Used linens and towels laundered for next stay',
            'Inventory check to flag stained or damaged items',
          ],
        },
        {
          title: 'Restocking + Inspection',
          items: [
            'Essential supply restocking (toilet paper, paper towels, soap, dish detergent)',
            'Property damage inspection on every visit',
            'Issues flagged with photos before next guest arrives',
          ],
        },
        {
          title: 'Photo Report',
          items: [
            'Detailed photos after every cleaning',
            'Bed setup, bathroom, kitchen, and common-area shots',
            'Sent directly to you so you know what your guests will walk into',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'How fast can you turn a property between guests?',
          answer:
            "Standard turnovers take 2-4 hours depending on size. For tight checkout-to-checkin windows we can prioritize and dispatch a 2-person team to compress the time further. Let us know your window when you book.",
        },
        {
          question: 'Do you supply linens and towels?',
          answer:
            "We launder yours by default. If you want us to maintain a backup linen set (or rent linens through us), we can quote that separately so you always have a clean swap ready.",
        },
        {
          question: 'What happens if a guest damages something?',
          answer:
            "Every turnover includes a damage inspection. Anything missing, broken, or stained gets photographed and reported to you before the next guest arrives so you can claim against the Airbnb resolution center if needed.",
        },
        {
          question: 'Do you coordinate directly with the calendar?',
          answer:
            "Yes — we can sync with your Airbnb / VRBO / Hospitable / Hostfully calendar so turnovers auto-schedule the day a guest checks out. No more last-minute texts.",
        },
        {
          question: 'Will my Superhost rating be safer with you?',
          answer:
            "That is the goal. We work with several South Florida hosts who have maintained Superhost status while using our service. Consistent turnover quality is the single biggest factor.",
        },
        {
          question: 'Do you do mid-stay cleans?',
          answer:
            "Yes — for longer stays we can quote a mid-stay refresh. Common on stays of 7+ nights and often included in higher-tier listings.",
        },
      ],
    },
    related: ['move-in-out', 'commercial'],
  },

  // ─── HANDYMAN SERVICES ──────────────────────────────────────────
  // The booking wizard has sold this since the Geraldine revisions (Step 2,
  // "Handyman Services") with no page behind it — no ranking surface, no
  // schema, no entry in the GBP services list. The scope below mirrors
  // HANDYMAN_SERVICES in Step03Property.tsx exactly; do not add capabilities
  // here that the form does not offer, or the page promises what we cannot book.
  handyman: {
    slug: 'handyman',
    meta: {
      title: 'Handyman Services Fort Lauderdale | Top Cleaning Team',
      description:
        'Handyman services in Fort Lauderdale and Broward County. TV mounting, furniture assembly, drywall and door repairs, minor plumbing, and painting touch-ups.',
    },
    hero: {
      kicker: 'HANDYMAN',
      title: 'The Small Jobs, Finally Done.',
      body:
        'The shelf that never went up. The door that sticks. The drywall patch behind the sofa. We handle the backlog of small repairs most contractors will not take on, with the same vetted, insured crews that clean thousands of South Florida homes.',
      ctaText: 'Get Your Quote',
      ctaHref: '/booking',
      image: '/images/services/handyman.jpg',
      imageAlt: 'Handyman mounting a wall fixture in a Fort Lauderdale home',
    },
    whatsIncluded: {
      ghostKicker: 'What We Handle',
      mainLine: 'Small Jobs',
      secondaryLine: 'done right.',
      intro:
        'Send a few photos when you book and we will come with the right tools and a firm price. No hourly meter running while someone drives to the hardware store.',
      sections: [
        {
          title: 'Mounting & Assembly',
          items: [
            'TV mounting on drywall, plaster, and concrete, with cable management',
            'Flat-pack furniture assembly — beds, wardrobes, desks, shelving units',
            'Hanging mirrors, artwork, floating shelves, and curtain rods',
          ],
        },
        {
          title: 'Repairs & Fixes',
          items: [
            'Drywall repair — holes, cracks, anchor damage, sanded and ready for paint',
            'Doors that stick, drag, or will not latch, plus hinge and lock replacement',
            'Minor plumbing — leaking faucets, running toilets, shower heads, P-traps',
          ],
        },
        {
          title: 'Finishing Touches',
          items: [
            'Painting touch-ups to match existing walls and trim',
            'Re-caulking around tubs, sinks, and backsplashes',
            'Baseboard and trim reattachment',
          ],
        },
        {
          title: 'How We Quote',
          items: [
            'Photos of the job go in with your booking, so we arrive prepared',
            'A firm price before any work starts — no hourly surprises',
            'Fully insured crews, background checked, same as our cleaning teams',
          ],
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions',
      items: [
        {
          question: 'Why do you ask for photos when I book?',
          answer:
            'Because it is the difference between one visit and two. A photo of the wall, the fixture, or the leak tells us what anchors, parts, and tools to load before we leave the shop. It is also how we give you a firm price up front instead of an hourly estimate that drifts.',
        },
        {
          question: 'What is outside your scope?',
          answer:
            'Anything requiring a licensed specialist — panel work and new electrical circuits, re-piping, roofing, structural changes, or permitted work. We will tell you straight away if a job crosses that line, and we can refer trades we have worked with.',
        },
        {
          question: 'Can you come the same day?',
          answer:
            'Often, yes. Flag it as urgent when you book and we will tell you honestly whether we can reach you that day rather than holding the slot and cancelling.',
        },
        {
          question: 'Someone already tried to fix it and made it worse. Is that a problem?',
          answer:
            'Not at all, and it helps to know. There is a checkbox for it when you book. A previous attempt usually means stripped screws, oversized holes, or a part that no longer seats properly, and knowing in advance means we bring what is needed to undo it.',
        },
        {
          question: 'Can you do handyman work and a cleaning on the same visit?',
          answer:
            'Yes, and it is a common request after a renovation or before a move. Book the cleaning as your service and note the repairs in the special instructions, or book them separately and we will schedule the crews back to back.',
        },
        {
          question: 'How is it priced?',
          answer:
            'By the job, not the hour, once we have seen your photos. You get the number before we start. Nothing is charged at booking.',
        },
      ],
    },
    related: ['residential', 'move-in-out'],
  },
} satisfies Partial<Record<ServiceSlug, ServiceContent>>

export type AvailableServiceSlug = keyof typeof SERVICES

export function getService(slug: string): ServiceContent | null {
  if (slug in SERVICES) {
    return SERVICES[slug as AvailableServiceSlug]
  }
  return null
}

export function listServiceSlugs(): AvailableServiceSlug[] {
  return Object.keys(SERVICES) as AvailableServiceSlug[]
}
