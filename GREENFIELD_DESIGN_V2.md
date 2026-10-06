# Greenfield Auto Sales — design pass for V1

Date: 2026-10-06
Live legacy: https://www.greenfieldautosales.net/
V1: https://greenfieldautosales.t3kdesigns.app/
Repo: https://github.com/t3kdesigns03/greenfieldautosales
Reference looked at: https://www.ancira.com/

This is a design direction for the site that already exists. Do not rebuild the app.

## What each site actually is

Legacy Carsforsale is a dealer template. Trade banner, phone, address, a featured grid that repeats, make and body pages that still list sold units, contact page with no hours. It is the inventory system of record. Keep deep links to its vehicle pages until photos live here.

V1 is a real Next.js App Router app (TypeScript, Tailwind, content files, `/api/trade`). Nav is Inventory, Trade-in, Financing, About, Contact, plus call `(641) 329-6186`. Text line on the page is `(641) 743-2700`. Hours badge uses Greenfield time. Homepage is a headline, a keyword search, body counts (Trucks 4, SUVs 2, Vans 4, Cars 1), then 8 of 11 cards, proof points, paraphrased reviews, a sold strip, trade teaser, address, hours. Inventory already filters: search, body, 4x4/AWD, under $15k, under 100k miles, diesel, and sort. Trade form posts year, miles, make, model, condition, name, phone, note. Customer-facing home and trade copy no longer uses the owner's first name. README and the trade success string still do. Every card says photos coming soon.

Ancira is a 15-rooftop group homepage, not a single-lot app. First screen is welcome, New / Used / CPO, keyword search, filter search, body style, then a list of stores. Worth stealing: search is the first action, body style is visual, inventory is the product. Not worth stealing: store picker, franchise logo wall, certified chrome, AI chat, commercial/fleet, anything that implies a group.

## Same page, or not

Partly. The five-point Ancira list overfits a group site onto an 11-car lot.

Agree:

- The homepage should open on discovery, not on a sentence.
- Body type should be a shape with a count, not only a word.
- Cards should carry the photo, the price, and one or two facts. Price stays put.
- Call and text stay reachable while scrolling. V1 already has this under 768px. Do not add a second floating button on top of that bar.
- Filters that exist must keep working. This pass is visual and a tighter mobile layout, not a new information architecture.

Do not do:

- Year, then make, then model comboboxes. Eleven cars. Most makes have one unit. Empty dropdowns feel broken.
- A monochrome OEM logo grid. That reads franchise. This lot is mixed used.
- An auto-scrolling review marquee or overlapping masonry of quotes. That is the tacky layer. Three short static lines, labeled as paraphrased public reviews.
- Frosted glass over a dark red hero. The current dark treatment already drifts toward aftermarket. Go light.
- A sold counter. `soldCount` drives "560+ and counting." Hide it. A short "Recently sold" row of real units is enough, with no total.
- The owner's first name anywhere a customer can read, including trade success, about, footer, and metadata.

## Visual target

Independent lot, 2026, quiet. Paper and asphalt, not nightclub and not Bootstrap dealer blue.

- Paper `#F6F1E7`, card `#FFFcf7`, ink `#141816`, field green `#1F4D32`, wheat hairline `#C4A15A`, sold only `#8C3A2F`.
- Header is asphalt, wordmark in the existing SVG, call as a green pill not a red one.
- Hero is a short line — "Used trucks, SUVs and cars in Greenfield." — then a solid paper search panel: keyword, max price, body. Result count updates as they type. Body row is four outlined silhouettes with counts.
- Cards: real cover when a photo exists. Carousel only if that vehicle has two or more photos. No carousel of placeholders. If no photo, one calm placeholder and a text link to the Carsforsale listing. Badges only from data: New arrival, Diesel, drivetrain, origin if `origin` is set. Price pinned bottom left in field green.
- Below the inventory: three proof points, trade panel, hours and map. No stat row.

Mobile, 390 wide, is the acceptance view. One search field. Silhouettes in a 4-across row. Cards full width. Bottom bar is Call, Text, Trade. No horizontal scroll. Tap targets 44px. `prefers-reduced-motion` already in the repo stays on.

## Opus 5.5 prompt

Paste into Claude in the `t3kdesigns03/greenfieldautosales` repo.

```text
Upgrade the visual design of the existing Greenfield Auto Sales Next.js app. Do not rebuild routing, content files, or the trade API. Repo is already the V1 site deployed at https://greenfieldautosales.t3kdesigns.app/. Inventory system of record stays Carsforsale. Vehicle pages keep carsForSaleUrl.

Tone: professional independent lot. Not tacky, not franchise, not dark aftermarket. No owner's first name anywhere customer-facing. Search the repo and remove those strings from about, trade success, footer, metadata, and README examples. Success copy is "We'll call you back about this."

Kill the sold counter. Set soldCount so "560+" does not render. A recently sold row may stay, with no total and no "and counting."

Brand tokens, in app/globals.css, and use them. Do not introduce a blue dealer palette.
- paper #F6F1E7
- card #FFFcf7
- ink #141816
- field #1F4D32
- wheat #C4A15A as a 1px hairline only
- sold #8C3A2F only on sold state
Header asphalt #141816, wordmark unchanged. Call pill is field green, not red.

Homepage
- Replace the essay hero with a discovery hero. One line: "Used trucks, SUVs and cars in Greenfield." Subline stays factual: NE 6th Street, call or text.
- Search panel is a paper card on the hero, not glassmorphism. Fields: keyword, max price, and the existing body filter. Typing filters the live inventory rail on this page. Show "N on the lot" from the filtered set.
- Body types are outlined SVG silhouettes (truck, SUV, van, car) with the live count. They set the same filter the inventory page already uses. No OEM logo grid. No year/make/model dependent selects.
- Inventory rail uses the upgraded card. Keep the existing vehicle data.

Card
- Cover image if photos exist. Inline carousel only when that vehicle has 2+ photos: swipe, buttons, dots, no autoplay. One photo: no dots. No photos: a single placeholder and a link "Photos on the original listing" to carsForSaleUrl. Do not fake a carousel.
- Badges from data only: new arrival, diesel, drivetrain, origin if set. No marketing badges.
- Price pinned to the bottom of the card in field green. Whole card links to /inventory/[slug].

Rest of the page
- Three static proof points. Do not marquee or masonry the reviews.
- Trade panel links to /trade.
- Hours and address stay. Open/closed badge stays on America/Chicago.
- Sticky mobile bar under 768px: Call tel:6413296186, Text sms:6417432700, Trade /trade. Do not add a second floating button.

Inventory page
- Same card and same tokens. Filters and sort already work. Restyle them as a quiet toolbar. On a phone, filters open in a bottom sheet. Selected filters stay visible as removable chips. Empty state points at /trade.

Check
- 390px and 1280px. No horizontal scroll at 320, 375, 390, 768, 1280.
- Tap targets 44px. prefers-reduced-motion still disables motion.
- Do not invent prices, miles, origins, awards, rates, or payments.
- Do not change vehicle facts in content/vehicles.
```
