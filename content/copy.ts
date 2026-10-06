/**
 * content/copy.ts — words on the pages. Plain language, Luke's voice.
 * Rules: no invented awards, no financing rates, no staff who don't exist.
 */

export const home = {
  heroEyebrow: "Family-owned in Greenfield, Iowa",
  // The hero headline is the one sentence in site.tagline (reused in the footer).
  heroSub: "A small used car and truck lot on NE 6th Street. Come look, ask questions, take your time.",
  heroCtaPrimary: "See what's on the lot",
  heroCtaSecondary: "Call Luke",

  proofPoints: [
    {
      title: "Family-owned since 2008",
      body: "Luke has run this lot himself since July 2008. Same name on the sign, same guy on the phone.",
      icon: "home",
    },
    {
      title: "Out-of-state cars",
      body: "A lot of our vehicles come from out of state, so you'll see a lot less rust than the usual Iowa winter car.",
      icon: "map",
    },
    {
      title: "Trade-ins wanted",
      body: "Got something to trade? Tell us about it. Luke will call you with a straight answer.",
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
      headline: "Luke is straightforward.",
      body: "Tells you what a car is and what it isn't. No runaround on the price.",
    },
    {
      headline: "Worth the drive from Missouri.",
      body: "Buyers have come up from Missouri for a vehicle here and said the trip was worth it.",
    },
    {
      headline: "He sent me down the street.",
      body: "When Luke didn't have the right vehicle, he pointed the buyer to another lot instead of pushing something that wasn't a fit.",
    },
    {
      headline: "Family lot. Limited rust.",
      body: "A small family operation, and the out-of-state vehicles hold up with less rust than you'd expect around here.",
    },
  ] as { headline: string; body: string; attribution?: string; href?: string }[],

  tradeTitle: "Have something to trade?",
  tradeBody:
    "Tell us the year, make, model and miles. Luke looks it over and calls you back. No obligation, no pressure.",
};

export const about = {
  title: "A small lot with one name on it",
  intro: [
    "Greenfield Auto Sales is Luke Daughenbaugh's lot on NE 6th Street in Greenfield. He's been selling used cars and trucks here since July 2008. It's a family operation, not a franchise.",
    "Luke buys a lot of his vehicles out of state, where the roads don't see as much salt. That means less rust underneath than most cars that have spent their life in Iowa.",
    "If he doesn't have what you need, he'll tell you so. He has sent buyers down the street to another lot when that's where the right vehicle was.",
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
      body: "Call ahead and ask Luke what to bring for the paperwork, so there's no second trip.",
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
      body: "Ask Luke what form of payment works for the vehicle you're buying before you come in.",
    },
    {
      title: "Your own bank or credit union",
      body: "Get a loan from the bank or credit union you already use. They'll usually want the year, make, model, miles and price, which you can get from the listing or from Luke. Many people call their lender first so they know their budget before they shop.",
    },
  ],
  notTitle: "What we don't do",
  nots: [
    "We don't do in-house financing or buy-here-pay-here.",
    "We don't take credit applications online.",
    "We don't advertise rates or promise approval. That's between you and your lender.",
  ],
  closer:
    "Not sure what your bank will need from us? Call Luke and ask.",
};
