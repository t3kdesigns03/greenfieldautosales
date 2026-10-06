# Greenfield Auto Sales

Website for **Greenfield Auto Sales**, Luke Daughenbaugh's family-owned used car and truck lot at 503 NE 6th St, Greenfield, Iowa. It has been selling since July 2008.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · no CMS · deploys on Vercel.

**Phase 1.** This site handles the brand, the mobile shopping experience and leads (calls, texts, trade-ins). The inventory system of record stays on **Carsforsale** (https://www.greenfieldautosales.net). Each vehicle page links back to its original listing.

> This site is **not** live on greenfieldautosales.net yet. That domain still points to Carsforsale. See [Cutover](#cutover-pointing-the-domain-here).

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (what Vercel runs)
```

## Where things live

| What | File |
|---|---|
| Phone, text line, address, hours, map pin, tagline, nav | `content/site.ts` |
| Vehicles (one file per car) | `content/vehicles/*.ts`, listed in `content/inventory.ts` |
| Vehicle photos (generated) | `public/inventory/<slug>/01.webp…` + `content/photos.generated.ts` |
| Page copy (home proof points, reviews, about, financing) | `content/copy.ts` |
| Colors / theme tokens | top of `app/globals.css` |
| Logo | `components/Logo.tsx` (inline SVG; favicon is `app/icon.svg`) |
| Trade-in endpoint | `app/api/trade/route.ts` |

---

## Edit the business info (`content/site.ts`)

- **Phone.** `phone.display` + `phone.e164` is the lot line that every **Call** button uses. `textPhone` is the number every **Text** button uses (the one in Luke's listings). Change the display and e164 values together.
- **Hours.** Edit `hours` (24h times, `null` = closed) and keep `hoursSummary` (the footer text) in sync. The "Open now / Closed" badge uses Greenfield's time zone.
- **soldCount.** This drives the "560+ sold" stat. Bump it now and then, or set it to `null` to hide it.
- **url.** This is the canonical domain. Set `NEXT_PUBLIC_SITE_URL` in Vercel instead of editing it.

## Add a vehicle

1. Copy any file in `content/vehicles/`, e.g. `2023-toyota-tundra-sr5.ts`, to a new name such as `2014-ford-f-150-xlt.ts`.
2. Fill it in. **Only fill in what you know.** A missing field just doesn't show. The required fields are `listingId`, `year`, `make`, `model`, `body` (`truck | suv | van | car`), `price` (a number, or `"call"`), `miles` (a number, or `null`) and `status`.
   - `listingId` is the number at the end of the Carsforsale URL. A higher number counts as newer for the "Newest listed" sort and the "New arrival" badges.
   - `highlights` should be short facts Luke actually stated ("New tires", "No rust"). `caveat` is for anything he flags himself ("does have rust").
   - `origin` is the two-letter state when the listing says it came from out of state. It shows as a "From Texas" badge.
   - `carsForSaleUrl` adds the "View original listing" link.
3. Import it in `content/inventory.ts` and add it to the `inventory` list.
4. Add photos (next section).

**When it sells:** set `status: "sold"`. It disappears from inventory, its page returns 404, and it moves to the small "Sold here" strip on the home page. Delete the file whenever you like.

## Add photos

```bash
npm run photos:folders   # makes public/inventory/<slug>/raw/ for every live car
# drop that car's photos into its raw/ folder (JPG/PNG/WebP — convert iPhone HEIC to JPG first)
npm run photos           # resizes to 1600px WebP, makes blur previews, wires them in
```

- Photo order follows the filenames (01.jpg, 02.jpg… or IMG_1001, IMG_1002…). **The first one is the cover photo** on the card.
- The `raw/` folders are git-ignored. Commit the generated `01.webp…` files and `content/photos.generated.ts`.
- Cars without photos show a "Photos coming soon" placeholder, plus a link to the original listing on the detail page.
- Photo upload from a dashboard (the backend) is planned for later. The `images` field on a vehicle already takes `{ src, width, height }`, so uploaded URLs drop straight in.

## Getting trade leads to the lot

`/trade` (and the empty-search state on `/inventory`) posts to `/api/trade`. That endpoint validates the lead, logs it, and shows the customer "Luke will call you".

- **Where leads go right now:** Netlify → Site → **Logs → Functions** (the `/api/trade` function), search `[trade-lead]`. Nothing emails Luke yet.
- **To forward leads (recommended before launch):** set `TRADE_WEBHOOK_URL` in Netlify → Site configuration → Environment variables, pointed at a Zapier/Make webhook that texts or emails Luke. Each lead is POSTed there as JSON.
- **Simplest no-code option:** switch the form to **Netlify Forms** (add `data-netlify="true"` and a hidden `form-name` field to the trade form), and Netlify emails you every submission with no backend. Ask and I'll wire this up.

## Deploy to Netlify

1. In Netlify, **Add new site → Import from Git**, pick `t3kdesigns03/greenfieldautosales`. The build command (`npm run build`) and the Next.js runtime come from `netlify.toml`.
2. Environment variables (Site configuration → Environment variables):
   - `NEXT_PUBLIC_SITE_URL`: the public URL with no trailing slash (e.g. `https://greenfieldautosales.netlify.app` for now). Canonicals, the sitemap and JSON-LD use it.
   - `TRADE_WEBHOOK_URL`: optional (see above).
   - `NEXT_PUBLIC_ALLOW_INDEXING`: **leave unset** for now. The whole site is hidden from Google until this is `"true"` — on purpose, so a pre-launch demo never shows up in search.
3. Deploy. To share the demo privately, use the Netlify deploy URL (or turn on password protection under Site configuration → Access & security).

## Cutover: going live on the real domain

Do this only when Luke is on board and ready to stop sending people to the Carsforsale site.

1. **Before you switch:** every `carsForSaleUrl` points to `www.greenfieldautosales.net/details/...`. Once the domain moves here, those links would loop back to this site. Update them to wherever Carsforsale serves the listings after cutover (ask the Carsforsale rep for the dealer-page URL), or remove them.
2. Add the redirects listed in the comment at the top of `next.config.ts` (`/cars-for-sale` → `/inventory`, the body-type pages, `/home` → `/`, etc.). On Netlify these can also go in `netlify.toml` as `[[redirects]]`.
3. In Netlify → Domain management, add `greenfieldautosales.net` and `www.greenfieldautosales.net`.
4. At the domain registrar, point DNS at Netlify (either move the nameservers to Netlify DNS, or add the `A`/`CNAME` records Netlify shows). Use the values on Netlify's domain screen.
5. Set `NEXT_PUBLIC_SITE_URL` to the live URL **and** `NEXT_PUBLIC_ALLOW_INDEXING="true"`, then redeploy. Remove the `X-Robots-Tag` block from `netlify.toml`.
6. In Google Business Profile, confirm the website link and hours.

## Ground rules for content

- No invented awards, financing rates, monthly payments, "guaranteed approval", staff or reviews.
- Reviews on the home page are **paraphrased public sentiment**, shown without quotation marks or names. Add a name only if it's already public on the original review.
- `--rust` (the red-brown) is only for **sold** and **alerts**.

## Checks

- Built 375px-first: no horizontal scroll at 320/375/768/1280, tap targets of 44px or more, and a sticky call/text bar under 768px.
- `prefers-reduced-motion` turns off the logo draw-in, the reveals and the shimmer.
- Fonts (Saira for headlines, Source Sans 3 for body) are self-hosted from `app/fonts` under the SIL Open Font License. The logo letters are Saira too, outlined to paths.
- Logo art lives in `components/brand/` (`brandPaths.ts` is generated by `scripts/brand/gen.py` — see its header; `brandSvg.ts` assembles it). Change colors/motion there.
