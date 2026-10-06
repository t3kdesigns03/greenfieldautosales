# Greenfield Auto Sales — V2 design pass (brand fix)

Date: 2026-10-06
Live legacy: https://www.greenfieldautosales.net/
V1: https://greenfieldautosales.t3kdesigns.app/
Repo: https://github.com/t3kdesigns03/greenfieldautosales
Visual: the "Greenfield Auto Sales — V2 Homepage" design canvas, with a desktop (1440) and a phone (390) artboard

## The call

Keep Grok's layout. Throw out Grok's colors. The colors come from the legacy site, so people who know the lot recognize it. The Speed Badge logo goes in the header.

| | Grok mockup | V2 |
|---|---|---|
| Page | paper #F6F1E7 | legacy light grey #ECECEC, white cards |
| Header | asphalt + old road mark | black #0B0B0C + Speed Badge + prismatic wordmark |
| Hero | plain paper | legacy oxblood band #4A0A0C with its faint diagonal texture, white search panel on top |
| Action color | field green | logo red #C8141F (white text on it is AA) |
| Price | green text | oxblood chip, the same treatment as the legacy price button |
| Type | Saira-ish headings | Saira headings (same family as the logo) + Open Sans body (the legacy body font) |
| Trade strip | none | kept: "We want your vehicle! Get the best value for your trade-in." |
| Photos | stock photos, and wrong facts (it calls the 2019 F-250 a diesel; it's flex fuel) | real listing photos only. Until we have them, one calm placeholder plus a link to the original listing |

Financing: the legacy site never mentions financing. It has no credit app, no payment estimates and no lender talk. So V2 drops the Financing page and its nav link, and redirects /financing to /about. If Luke ever confirms he offers something, it's one page to add back.

Contact matches the legacy site: phone, address, hours, an email/message form, and value my trade. Text (641) 743-2700 is added because it's on the listings.

## Claude prompt

Paste this into Claude (Cowork or Claude Code) with the `GreenfieldAutoSales` folder / `t3kdesigns03/greenfieldautosales` repo open.

```text
Restyle the existing Greenfield Auto Sales Next.js 16 app (App Router, TypeScript, Tailwind 3, tokens as CSS vars in app/globals.css, content in content/). This is a visual + homepage-layout pass. Do NOT rebuild routing, content files, filters (lib/filters.ts), the trade API, netlify.toml, or the search-engine block (robots.ts / NEXT_PUBLIC_ALLOW_INDEXING). Commit when done; do not push.

GOAL
Grok's discovery layout, in the LEGACY site's colors (greenfieldautosales.net: black header, light grey page, oxblood band, red logo, oxblood price button), with the new Speed Badge logo. Light page, dark header/hero/footer. Professional small-town lot. Not franchise, not aftermarket.

HARD RULES
- Never show the owner's name anywhere customer-facing (pages, metadata, schema, form strings, text templates). Voice is "we/us".
- Never invent prices, miles, origins, fuel types, photos, reviews, awards, rates or payments. Facts come only from content/vehicles. No stock photos.
- Keep components/brand/* (Badge, Wordmark, brandSvg, brandPaths) as is: the prismatic edge and the glint stay. Don't regenerate the art.
- Tap targets ≥ 44px. Keep prefers-reduced-motion handling. No horizontal scroll at 320/375/390/768/1280/1440.

TOKENS (app/globals.css + tailwind.config.ts)
Flip the theme from dark to light by re-keying the existing token names, then fix every component that assumed a dark page:
  --night  236 236 236  #ECECEC  page background (legacy grey)
  --panel  255 255 255  #FFFFFF  cards
  --panel-2 244 244 244 #F4F4F4  inputs, chips
  --panel-3 230 230 230 #E6E6E6  hover
  --fg     26 26 26     #1A1A1A  text
  --muted  94 94 94     #5E5E5E  secondary text (5.5:1 on #ECECEC)
  --go     200 20 31    #C8141F  primary actions, white text on it
  --leaf   179 20 28    #B3141C  red text/links on light
  --gold   (rename use to) chrome #C7CCD4, used only on dark surfaces
Add: --ink 11 11 12 #0B0B0C (header, footer, trade panel), --oxblood 74 10 12 #4A0A0C (hero band, price chip), --charcoal 38 38 38 #262626 (visit band).
Then grep for dark-theme leftovers and fix them for the light page: border-white/…, bg-white/[…], text-paper, bg-night/…, backdrop-blur on light, focus rings (red #C8141F on light, chrome on dark). Header, hero, trade panel, visit band, footer and the mobile bar are dark zones: give them explicit dark styles, white text.
Fonts: headings stay Saira (app/fonts). Swap body Source Sans 3 → Open Sans, self-hosted woff2 in app/fonts with OFL.txt (no runtime Google Fonts).

HEADER (components/Header.tsx)
1. Trade strip on top, #ECECEC, centered 14px: "We want your vehicle! Get the best value for your trade-in." + red link "Value my trade →" to /trade. On phones: "We want your vehicle! Value my trade →".
2. Black header (#0B0B0C): Logo lockup left (badge ~72px tall desktop / 50px phone, wordmark beside it), nav Inventory · Trade-in · About · Contact (active = 2px red underline), right side a stack of the phone "(641) 329-6186" (Saira 800, white) over "503 NE 6TH ST · GREENFIELD, IA" (12.5px caps, grey), then a red "Call" pill. Phones: logo + call icon + menu.
Remove Financing from the header, footer and sitemap. Delete app/financing and the financing copy, and add a permanent redirect /financing → /about in next.config.ts.

HOMEPAGE (app/page.tsx) — top to bottom
1. Hero band: background #4A0A0C with a faint 135° pinstripe (repeating-linear-gradient, white at 2.5%, 2px every 14px), white text.
   - Eyebrow: live OpenStatus + "GREENFIELD, IOWA" (caps, letter-spaced).
   - H1: "Used trucks, SUVs and cars in Greenfield." (Saira 800, ~58px desktop / 34px phone)
   - Sub: "On NE 6th Street. Asking prices and real miles. Call or text before you drive over."
   - White search panel (radius 12, real shadow, not glass): "Search the lot" keyword input, "Max price" select (Any, PRICE_STEPS from lib/filters), and a red button whose label is the live count, "Show N vehicles". Make it a small client component: filter liveVehicles() with the same logic as lib/filters as the user types/selects. Submitting goes to /inventory?q=…&max=…&body=…. On phones: just the keyword field + "Search".
   - Body tiles: 4 white tiles in one row (also 4-across on phones), outlined truck/SUV/van/car silhouettes (reuse components/VehicleArt Silhouette as an outline) + live count. Clicking toggles the body filter used by the search panel. Selected = 2px red border. Hide a type with 0 units.
2. Inventory: heading "11 ON THE LOT" (Saira caps, the number is live), "See all inventory →" on the right. Grid of the upgraded card (3 columns desktop, 2 tablet, 1 phone), first 6 vehicles (newest first). When the hero filters are active, this grid shows the filtered set and the heading becomes "N MATCH".
3. Two panels side by side (stacked on phones):
   - "WHY BUY HERE" white card, three points each under a 3px red top rule: Family-owned since 2008 / Out-of-state vehicles ("Many come from Texas, New Mexico and Florida, so less winter rust." — only name states that appear in content/vehicles origin) / Trade-ins wanted.
   - Trade panel: black card, a thin black/white checkered strip across its top (CSS conic-gradient, 14px squares), "HAVE SOMETHING TO TRADE?", "Year, make, model, miles. We'll look it over and get back to you.", red pill "Value my trade →" to /trade.
4. Visit band, charcoal #262626, three columns: VISIT THE LOT (address + Get directions), HOURS (from site.hoursSummary), REACH US (Call (641) 329-6186 · Text (641) 743-2700 · Email "Send us a message" → /contact#message).
5. Footer black: small logo lockup (animate off), "© YEAR Greenfield Auto Sales · Greenfield, Iowa", "Listings also on Carsforsale" link.
Remove from the homepage: the reviews section and the "Sold here: 560+ and counting" strip (keep their content in content/ for later, don't render them). No stat rows.

VEHICLE CARD (components/VehicleCard.tsx) — used on home + inventory
- White card, radius 12, soft shadow. Photo area 4:3 on #2A2A2C.
- If photos exist: the cover image. Carousel only when that vehicle has 2+ photos (swipe, arrows, dots, no autoplay). No photos: one calm outlined silhouette + "Photos on the original listing" text link to carsForSaleUrl (stopPropagation so it doesn't open the card). Never fake a carousel.
- Badges from data only: "New arrival" (red pill, top-left), "From <State>" (white pill, top-right) when origin is set.
- Body: title (Saira 800), "Trim · 68k mi", data chips (drivetrain, Diesel only when fuel is Diesel), hairline, then the price in an oxblood chip (#4A0A0C, white Saira 800), the same as the legacy price button, and "Details →" in red. Whole card links to /inventory/[slug].

INVENTORY PAGE + VEHICLE PAGE
- Same tokens and card. The filter toolbar sits on white. On phones, filters open in a bottom sheet. Active filters show as removable chips (red outline). Empty state points to /trade and the contact form.
- Vehicle page: price in the oxblood chip, primary "Call (641) 329-6186" red, secondary "Text about this truck". Keep the "View original listing" link. Section cards are white on the grey page.

CONTACT
- Add a "Send us a message" form on /contact (id="message"), the way the legacy site has Email Us: name, phone or email (one required), optional vehicle of interest (select from liveVehicles + "Something else"), message. Reuse the trade lead pattern: generalize app/api/trade into app/api/lead with type "trade" | "message", the same honeypot/validation/log, forwarding to LEADS_WEBHOOK_URL (fall back to TRADE_WEBHOOK_URL). Success copy: "Thanks — we'll get back to you." Update README's lead section.

MOBILE (390 is the acceptance view)
- Sticky bottom bar under 768px, black: Call (red, wider) · Text · Trade. It replaces the current Call/Text bar. The vehicle page keeps its own price + Call + Text variant in the same colors. No second floating button.
- Body padding-bottom matches the bar so nothing is covered.

CHECK BEFORE COMMITTING
- npm run build and tsc clean.
- Screenshot / and /inventory at 390 and 1440, and /inventory/2023-toyota-tundra-sr5 at 390. No horizontal scroll at 320/375/390/768/1280/1440.
- Contrast: body text ≥4.5:1, white on #C8141F and on #4A0A0C passes.
- grep the built output for the owner's first name: zero hits.
- Commit message: "feat(v2): legacy brand colors, discovery hero, light theme, contact form".
```
