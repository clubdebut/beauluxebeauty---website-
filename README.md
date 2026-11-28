# Beau Luxe Beauty — Website

A static, seven-page website built from the **Beau Luxe Beauty Website Description** (page
content), the **Beau Luxe Beauty Branding Sheet** (palette and aesthetic direction) and the
photo/video assets in this project.

No build step, no framework, no dependencies. Open `index.html` in a browser, or upload the whole
`site/` folder to any host.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, the four pillars, the BioBeauty journey, gallery |
| `about.html` | The BioBeauty Approach — philosophy, four disciplines, how a plan is built |
| `aesthetic-artistry.html` | Injectable Artistry + PMU Artistry, treatment list, Q&A |
| `skin-regeneration.html` | BioSkin Renewal Program + Precision Plasma, pathway, Q&A |
| `body-optimization.html` | Beauty Systems, Body Refinement, Recovery & Renewal, Q&A |
| `laser-treatments.html` | Laser hair removal + tattoo removal (Oregon), Q&A |
| `contact.html` | Consultation request form, visiting info, what to expect |

All Q&A copy is taken verbatim from the Website Description document.

---

## Still outstanding before launch

Contact details are now live on the site (see *Change log* below). These remain:

### 1. Booking link
All "Book a Consultation" buttons point at one variable. Edit the top of `assets/js/main.js`:

```js
var BOOKING_URL = 'contact.html';   // ← change to the Aesthetic Record / EMR booking URL
```

### 2. Consultation form
The form **sends nothing anywhere**. It validates and shows a confirmation, but enquiries are
discarded. To make it live, give the `<form>` in `contact.html` an `action` and `method`:

```html
<form class="form" data-consult-form action="https://formspree.io/f/XXXXXXX" method="post">
```

Once `action` is set, `assets/js/main.js` stops intercepting and the form submits normally.

### 3. TikTok
Removed rather than left pointing at the TikTok home page. Add it back to the footer and the
contact page once the account URL is confirmed.

### 4. Black Friday promotion
Not built. Needs the final approved offer and the checkout link.

### 5. Pricing — a deliberate decision
**No prices appear anywhere on the site.** The figures in *Treatments and Services.docx* are
labelled "Proposed Pricing Structure" and "Estimated", and sit alongside internal cost and margin
planning. The treatment rows are built so a price drops straight in.

---

## What was deliberately excluded

`Treatments and Services.docx` is an internal strategy document. The following was **not** published:

- cost of goods, gross margins and revenue projections
- equipment costs, vendor names and vendor disputes
- staff names, roles, compensation models and partnership negotiations
- multi-location rollout plans and outstanding business decisions

Only client-facing treatment information was used.

### 🔒 One security note
`Beau Luxe Beauty Branding Sheet.docx` contains **plaintext Canva and Squarespace logins and
passwords**. None of it is in this website, but that document is worth moving into a password
manager and removing from any shared folder.

---

## Design system

Taken from the Branding Sheet. All tokens live at the top of `assets/css/styles.css`.

| Token | Hex | Role |
|---|---|---|
| Cream | `#EDE9E4` | Page background |
| Sand | `#B29D8B` | Accents, rules, eyebrow labels |
| Onyx | `#252525` | Text, dark bands, buttons |
| White | `#FFFFFF` | Cards, light text |
| Sage Green | `#99A58F` | Main accent |
| Forrest | `#46645A` | Secondary accent, focus rings |
| Teal | `#287476` | Third accent |

**Type** — *Cormorant Garamond* (display serif, echoing the logo's high-contrast letterforms) with
*Jost* (geometric sans with wide tracking, echoing the `BEAU LUXE BEAUTY` wordmark). Both load from
Google Fonts with system fallbacks.

**Motifs** — the signature white orchid, snake plant and olive tree from the brand guide appear in
the video content and in the "Our signatures" section of `about.html`.

**Layout** — wide-screen by default. Content runs full width minus a `clamp(20px, 4.4vw, 76px)`
gutter and only caps at `--maxw: 1760px`, so on any display up to about 1760px the page is edge to
edge rather than a centred column. The header shares `--maxw`, which keeps the logo aligned with the
headline below it at every width. Display type and section spacing step up again above 1600px.
Long-form text keeps a capped measure so line lengths stay readable as containers grow.

---

## Assets

Everything in `assets/` was generated from the source files in this project — originals untouched.

- **Logos** — cropped from the 6000×6000 brand PNGs, transparency preserved, plus white versions for
  dark backgrounds and favicons.
- **Photos** — 14 images converted from PNG to JPEG and fitted to 1600px (58–106 KB each).
- **Video** — three clips transcoded from iPhone HEVC `.MOV` (which browsers cannot play) to H.264
  MP4, muted and web-optimised: reception (hero), orchid, plasma treatment. 0.3–1.1 MB each.

Background videos pause automatically when scrolled off-screen, and every one has a poster image so
the page looks right before video loads.

---

## Accessibility & behaviour

- Skip link, landmarks, visible focus rings, `aria-current` on the active nav item
- Accordions are real buttons with `aria-expanded`; mobile drawer closes on `Esc`
- `prefers-reduced-motion` disables animation and the marquee
- Scroll reveals have a backstop sweep, so content can never get stuck invisible — and with
  JavaScript off, everything is visible by default
- Verified: no horizontal overflow at 375px on any page

---

## Going live (GitHub Pages + GoDaddy)

The site is published from this repository:
`https://github.com/clubdebut/beauluxebeauty---website-`

### 1. Turn on GitHub Pages
Repository → **Settings** → **Pages** → under *Build and deployment* set
**Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`** → **Save**.

The `CNAME` file in this repo already contains `www.beauluxebeauty.com`, so the Custom domain
field fills in by itself. Leave **Enforce HTTPS** unticked until the certificate is issued
(usually minutes, occasionally up to 24 hours), then tick it.

### 2. DNS at GoDaddy
GoDaddy → your domain → **DNS** → **Manage Zones**.

First **delete** any existing `A` record on `@` and any `CNAME` on `www` (GoDaddy adds parking
records by default — they will block the HTTPS certificate if left in place).

Then add:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | clubdebut.github.io | 1 hour |

The four A records make the bare `beauluxebeauty.com` work; the CNAME serves
`www.beauluxebeauty.com`, which is the canonical address used throughout the site.

Check propagation with:

```
nslookup beauluxebeauty.com
```

It should return the four addresses above. DNS can take up to 24 hours, though GoDaddy is
usually much faster.

### 3. Publishing changes afterwards
Everything in this folder is the live site. To publish an edit:

```
git add -A
git commit -m "Describe the change"
git push
```

GitHub Pages redeploys within about a minute.

---

## Local preview

Opening `index.html` directly works. For a local server (so video and fonts behave exactly as in
production):

```powershell
npx serve "C:\Users\hello\Documents\Beau Luxe Beauty Website\site"
```

---

## Medical disclaimer

Every page footer carries a disclaimer stating that content is educational rather than medical
advice, that treatments follow consultation and assessment, that results vary, and that laser
services are Oregon-only. **Have this reviewed against your state's advertising rules for medical
spas before launch.**

---

## Change log

### 28 November 2026 — launch pass (from *Website Modifications/Changes List.docx*)

1. **Homepage cover video** — replaced with the newly edited, smoother reception clip
   (`VIDEO 01`). Headline and buttons unchanged.
2. **Homepage philosophy** — the white-orchid paragraph was removed and replaced with the
   *Our Aesthetic Philosophy* copy. The orchid footage beside it was kept, since removing it
   would have left an empty column and the brief said no redesign was needed at this stage.
3. **Laser Treatments media** — the page hero image became the laser hair removal video
   (`VIDEO 02`). The two optional clips were also used: the device clip now sits beside
   *Laser Hair Removal* and the tattoo clip beside *Tattoo Removal*.
4. **Laser "What to expect"** — "Consultation & patch test" is now "Consultation".
5. **Footer contact** — all placeholders removed. The footer gained a fifth column so both
   locations show in full, with phone and email as tap-to-call / tap-to-email links.
6. **Social links** — Instagram now points at `@beauluxebeautyusa`, with `@beauluxebeautygrantspass`
   alongside it. TikTok was removed rather than left pointing at the platform home page.
7. **Contact page** — placeholders replaced with both addresses, phone and email. Addresses link
   to Google Maps. The opening-hours row was removed since no hours were supplied; "Consultations
   are by appointment" remains.

Not done, pending information: booking/checkout URL, form endpoint, TikTok URL, Black Friday
promotion.
