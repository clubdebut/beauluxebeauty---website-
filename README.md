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

## ⚠️ Before you launch

Everything below is deliberately left blank rather than guessed. Placeholders appear on the page as
a **dashed tan box** (e.g. `Add phone number`) so they are impossible to miss.

### 1. Contact details
Search the HTML for `class="tbd"` and replace each one. They appear in:
- the footer of **every** page (phone, email, address)
- `contact.html` (address, phone, email, opening hours)

```powershell
Select-String -Path *.html -Pattern 'class="tbd"'
```

### 2. Booking link
All "Book a Consultation" buttons point at one variable. Edit the top of
`assets/js/main.js`:

```js
var BOOKING_URL = 'contact.html';   // ← change to your live booking URL
```

### 3. Consultation form
The form currently **sends nothing anywhere** — it validates and shows a confirmation panel only.
To make it live, give the `<form>` in `contact.html` an `action` and `method` for your provider
(Squarespace form, Formspree, Netlify Forms, your booking system):

```html
<form class="form" data-consult-form action="https://formspree.io/f/XXXXXXX" method="post">
```

Once `action` is set, `main.js` stops intercepting and the form submits normally.

### 4. Social links
Instagram and TikTok currently point at the platform home pages. Update them in the footer of each
page and in `contact.html`.

### 5. Pricing — a deliberate decision
**No prices appear anywhere on the site.** The figures in *Treatments and Services.docx* are labelled
"Proposed Pricing Structure" and "Estimated", and sit alongside internal cost and margin planning.
Publishing proposed internal pricing as live retail pricing is a business risk, so it was left out.

The treatment lists are built so a price column drops straight in — the `.titem__meta` slot on the
right of each row currently holds things like "By consultation" and is where a price would go.

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
