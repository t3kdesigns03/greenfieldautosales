# Greenfield Auto Sales

Website for **Greenfield Auto Sales**, a family-owned used car and truck lot at 503 NE 6th St, Greenfield, Iowa. It has been selling since July 2008.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Netlify (+ Netlify Blobs for inventory added in `/admin`).

**Phase 1.** This site handles the brand, the mobile shopping experience and leads (calls, texts, trade-ins). The inventory system of record stays on **Carsforsale** (https://www.greenfieldautosales.net). Each vehicle page links back to its original listing.

> This site is **not** live on greenfieldautosales.net yet. That domain still points to Carsforsale. See [Cutover](#cutover-pointing-the-domain-here).

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (what Netlify runs)
```

## Where things live

| What | File |
|---|---|
| Phone, text line, address, hours, map pin, tagline, nav | `content/site.ts` |
| Vehicles added/edited in the admin | Netlify Blobs store `inventory` (`vehicle:<slug>`, `photo:<slug>:<index>`), via `/admin` |
| Vehicles from git (original 11) | `content/vehicles/*.ts`, listed in `content/inventory.ts` |
| Photos for git vehicles (CLI) | `public/inventory/<slug>/01.webp…` + `content/photos.generated.ts` |
| How the two are merged | `lib/inventoryData.ts` (Blobs first, then content files) |
| Admin pages / API | `app/admin/*`, `app/api/admin/*`, photos served by `app/api/photos/*` |
| Page copy (home proof points, reviews, about, financing) | `content/copy.ts` |
| Colors / theme tokens | top of `app/globals.css` |
| Logo | `components/Logo.tsx` (inline SVG; favicon is `app/icon.svg`) |
| Trade-in endpoint | `app/api/trade/route.ts` |

---

## Edit the business info (`content/site.ts`)

- **Phone.** `phone.display` + `phone.e164` is the lot line that every **Call** button uses. `textPhone` is the number every **Text** button uses (currently the same number). Change the display and e164 values together.
- **Hours.** Edit `hours` (24h times, `null` = closed) and keep `hoursSummary` (the footer text) in sync. The "Open now / Closed" badge uses Greenfield's time zone.
- **soldCount.** This drives the "560+ sold" stat. Bump it now and then, or set it to `null` to hide it.
- **url.** This is the canonical domain. Set `NEXT_PUBLIC_SITE_URL` in Netlify instead of editing it.

## Add a vehicle (the normal way: /admin)

1. Go to **`/admin`** on the live site and sign in with `ADMIN_PASSWORD` (see Deploy). The page is not linked anywhere and is never indexed.
2. **+ New vehicle.** Fill in year, make, model, trim, body, price (or "Call for price"), miles, drivetrain, fuel, origin (two-letter state, optional), highlights (one per line), caveat, status and the Carsforsale link. Only fill in what you know.
3. The web address (slug) is made from year-make-model-trim. Edit it before the first save if you want; it's fixed after that.
4. **Photos:** drag them onto the page (or "Choose photos"), as many as you like. Each is resized in the browser to 1600px WebP before upload. Drag tiles (or use the arrows) to reorder. **The first photo is the cover.** ✕ removes one.
5. **Save vehicle.** The record goes to Netlify Blobs (`vehicle:<slug>`), the photos to `photo:<slug>:0…n`, and the home page, `/inventory` and the vehicle page refresh right away.

**When it sells:** hit **Mark sold** on the admin list. It disappears from the site (its page 404s). Sold units stay in the admin under "Sold" and can be relisted.

**Editing one of the original 11** (from `content/vehicles/`): open it in the admin and save. That writes a Blobs record with the same slug, and the Blobs record wins over the file from then on. Its specs, features and description are carried over.

Photo cards: no photos → the "Photos coming soon" placeholder plus a "Photos on original listing" link (when there's a Carsforsale link). One photo → no carousel dots. Two or more → the swipe carousel.

### Admin storage, locally

`npm run dev` / `next start` on your machine has no Netlify Blobs context, so the admin reads and writes `.data/inventory/` instead (git-ignored, never deployed). Set `ADMIN_PASSWORD` in `.env.local` to sign in. To work against the real store from your machine, set `NETLIFY_BLOBS_SITE_ID` and `NETLIFY_BLOBS_TOKEN` (a personal access token), or run `netlify dev`.

Uploaded photos are never written to git or `public/`: a Netlify function's disk isn't durable. During a save, photos sit briefly under `upload:<slug>:<id>` keys and are moved into place (and the staged copies deleted) when the vehicle is saved.

## Add a vehicle the old way (content file + CLI photos)

Still works for anything in `content/vehicles/`, and it's how the original 11 got here:

1. Copy a file in `content/vehicles/`, fill in what you know (required: `listingId`, `year`, `make`, `model`, `body`, `price` (number or `"call"`), `miles` (number or `null`), `status`), and add it to `content/inventory.ts`.
2. Photos:

```bash
npm run photos:folders   # makes public/inventory/<slug>/raw/ for every live content-file car
# drop that car's photos into its raw/ folder (JPG/PNG/WebP — convert iPhone HEIC to JPG first)
npm run photos           # resizes to 1600px WebP, makes blur previews, wires them in
```

Photo order follows filenames; the first is the cover. Commit the generated `01.webp…` files and `content/photos.generated.ts`. If a vehicle also has an admin (Blobs) record, its admin photos are used; the CLI photos show only while the admin record has none.

## Getting trade leads to the lot

`/trade` (and the empty-search state on `/inventory`) posts to `/api/trade`. That endpoint validates the lead, logs it, and shows the customer a confirmation.

- **Where leads go right now:** Netlify → Site → **Logs → Functions** (the `/api/trade` function), search `[trade-lead]`. Nothing emails the lot yet.
- **To forward leads (recommended before launch):** set `TRADE_WEBHOOK_URL` in Netlify → Site configuration → Environment variables, pointed at a Zapier/Make webhook that texts or emails the lot. Each lead is POSTed there as JSON.
- **Simplest no-code option:** switch the form to **Netlify Forms** (add `data-netlify="true"` and a hidden `form-name` field to the trade form), and Netlify emails you every submission with no backend. Ask and I'll wire this up.

## Deploy to Netlify

1. In Netlify, **Add new site → Import from Git**, pick `t3kdesigns03/greenfieldautosales`. The build command (`npm run build`) and the Next.js runtime come from `netlify.toml`.
2. Environment variables (Site configuration → Environment variables):
   - `NEXT_PUBLIC_SITE_URL`: the public URL with no trailing slash (e.g. `https://greenfieldautosales.netlify.app` for now). Canonicals, the sitemap and JSON-LD use it.
   - `ADMIN_PASSWORD`: **required for `/admin`** (8+ characters). Without it the admin is turned off. Changing it signs everyone out.
   - `ADMIN_SESSION_SECRET`: optional. A long random string used to sign admin sessions instead of the password.
   - `TRADE_WEBHOOK_URL`: optional (see above).
   - Netlify Blobs needs no setup: the store `inventory` is created on first save.
   - `NEXT_PUBLIC_ALLOW_INDEXING`: **leave unset** for now. The whole site is hidden from Google until this is `"true"` — on purpose, so a pre-launch demo never shows up in search.
3. Deploy. To share the demo privately, use the Netlify deploy URL (or turn on password protection under Site configuration → Access & security).

## Cutover: going live on the real domain

Do this only when the owner is on board and ready to stop sending people to the Carsforsale site.

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
