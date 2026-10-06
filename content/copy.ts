/**
 * content/copy.ts — words on the pages. Small-town professional: plain,
 * friendly, business voice ("we"). No names, no invented awards, no rates.
 */

export const home = {
  heroEyebrow: "Greenfield, Iowa",
  heroTitle: "Find your next vehicle at Greenfield Auto Sales",
  heroSub: "Quality used cars, trucks and SUVs on NE 6th Street. Browse what's on the lot, then call, text or stop by.",
  heroCtaPrimary: "See what's on the lot",
  heroCtaSecondary: "Call us",

  proofPoints: [
    {
      title: "Family-owned since 2008",
      body: "Locally owned and selling used cars and trucks in Greenfield since July 2008.",
      icon: "home",
    },
    {
      title: "Out-of-state cars",
      body: "A lot of our vehicles come from out of state, so you'll see a lot less rust than the usual Iowa winter car.",
      icon: "map",
    },
    {
      title: "Trade-ins wanted",
      body: "Got something to trade? Tell us about it and we'll get back to you with a straight answer.",
      icon: "swap",
    },
  ] as const,

  reviewsTitle: "What folks say about the lot",
  reviewsNote: "Paraphrased from public customer reviews.",
  /**
   * Real public sentiment only. These are paraphrased, not quotes, so they
   * render without quotation marks. Only add `attribution` if the name is
   * already public on the original review (and add `href` to link to it).
   */
  reviews: [
    {
      headline: "Straightforward to deal with.",
      body: "Honest about each vehicle, and no runaround on the price.",
    },
    {
      headline: "Worth the drive from Missouri.",
      body: "Buyers have come up from Missouri for a vehicle here and said the trip was worth it.",
    },
    {
      headline: "No pressure.",
      body: "When the right vehicle wasn't on the lot, buyers were pointed elsewhere instead of being pushed into something that wasn't a fit.",
    },
    {
      headline: "Family lot. Limited rust.",
      body: "A small family operation, and the out-of-state vehicles hold up with less rust than you'd expect around here.",
    },
  ] as { headline: string; body: string; attribution?: string; href?: string }[],

  tradeTitle: "Have something to trade?",
  tradeBody:
    "Tell us the year, make, model and miles. We'll look it over and get back to you. No obligation, no pressure.",
};

export const about = {
  title: "About Greenfield Auto Sales",
  intro: [
    "Greenfield Auto Sales is a family-owned used car and truck lot at 503 NE 6th Street in Greenfield, Iowa, selling since July 2008.",
    "Many of our vehicles come from out of state, where the roads see less salt. That means less rust underneath than most vehicles that have spent their life in Iowa.",
    "Looking for something we don't have right now? Call or text and tell us what you're after.",
  ],
  howTitle: "How buying works here",
  how: [
    {
      title: "Come look",
      body: "Stop by during open hours, or call first to make sure it's still here. Take your time looking it over.",
    },
    {
      title: "Bring a mechanic",
      body: "You're welcome to bring your own mechanic or take it to one. A good used car can stand up to a second opinion.",
    },
    {
      title: "Pay how you pay",
      body: "Cash, or a loan through your own bank or credit union. We don't run credit applications or offer pre-approvals here.",
    },
    {
      title: "Drive it home",
      body: "Call ahead and ask what to bring for the paperwork, so there's no second trip.",
    },
  ],
};

export const financing = {
  title: "Paying for a car here",
  intro:
    "We keep this simple. Most people pay one of two ways, and neither one runs through us.",
  options: [
    {
      title: "Cash or check",
      body: "Ask us what form of payment works for the vehicle you're buying before you come in.",
    },
    {
      title: "Your own bank or credit union",
      body: "Get a loan from the bank or credit union you already use. They'll usually want the year, make, model, miles and price, which you can get from the listing or from us. Many people call their lender first so they know their budget before they shop.",
    },
  ],
  notTitle: "What we don't do",
  nots: [
    "We don't do in-house financing or buy-here-pay-here.",
    "We don't take credit applications online.",
    "We don't advertise rates or promise approval. That's between you and your lender.",
  ],
  closer:
    "Not sure what your bank will need from us? Give us a call and ask.",
};
