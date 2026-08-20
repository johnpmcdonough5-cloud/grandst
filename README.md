# Grand Street Insulation — website

A static marketing site for Grand Street Insulation, built to be hosted on GitHub Pages.
No build step, no framework, no dependencies — plain HTML, one CSS file, one JS file.

Content and brand colours are carried over from the existing Wix site
(`jgordievsky.wixsite.com/grandstinsulation`). All photography is the company's own,
selected from the supplied job-site photo library.

---

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services, why-us, process, gallery preview, reviews, FAQ, service areas |
| `attic-basement-insulation.html` | Attic, cathedral ceiling, rim joist and basement service page |
| `metal-building-insulation.html` | Metal garages, quonsets and commercial steel buildings |
| `new-construction.html` | Remodels, additions and ground-up new builds |
| `about.html` | Founder story, values, process, crew |
| `gallery.html` | Full project gallery with an accessible lightbox |
| `contact.html` | Quote form, direct contact details, service areas |
| `404.html` | Not-found page |

Supporting files: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `CNAME`, `.nojekyll`.

---

## Deploying to GitHub Pages

1. Create a repository and push the contents of this folder to its root (not inside a subfolder).

   ```bash
   git init && git add . && git commit -m "Initial site" && git branch -M main
   ```

2. Add the remote and push:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/grand-street-insulation.git && git push -u origin main
   ```

3. In the repo, go to **Settings → Pages**, set **Source** to *Deploy from a branch*,
   branch `main`, folder `/ (root)`, and save.

`.nojekyll` is included so GitHub serves the files as-is instead of running them through Jekyll.

### Custom domain

`CNAME` currently contains `grandstreetinsulation.com`. To use it:

- Point the domain's DNS at GitHub Pages (four `A` records for the apex, or a `CNAME`
  record for `www` pointing at `YOUR-USERNAME.github.io`).
- In **Settings → Pages → Custom domain**, enter the same domain and enable **Enforce HTTPS**.

**If you are not using a custom domain**, do two things:

1. Delete the `CNAME` file.
2. Edit `404.html` and change the six `/assets/...` paths to `/YOUR-REPO-NAME/assets/...`.
   Every other page uses relative paths and works at any base path — only `404.html`
   needs absolute paths, because GitHub serves it for URLs that do not exist.

### Canonical URLs

Every page has a `<link rel="canonical">`, Open Graph tags and JSON-LD pointing at
`https://grandstreetinsulation.com`. If the site ends up on a different domain,
find-and-replace that string across the `.html` files and `sitemap.xml`.

---

## The contact form

`contact.html` posts to a placeholder endpoint and has a working fallback, so it is
functional either way:

- **Right now (unconfigured):** the form validates in the browser, then opens the
  visitor's email client with all the details pre-filled and addressed to
  `sdsprayfoam@gmail.com`. Nothing is lost, but it costs the visitor an extra click.
- **Recommended:** sign up at [formspree.io](https://formspree.io) (free tier is fine),
  create a form, and replace `YOUR_FORM_ID` in the form's `action` attribute in
  `contact.html`. The JS then submits over `fetch`, the visitor stays on the page, and
  they get an inline success message.

The form includes a hidden honeypot field (`_gotcha`) that Formspree understands, plus
client-side spam rejection.

---

## Editing content

- **Phone / email:** search for `442-413-0520`, `+14424130520` and `sdsprayfoam@gmail.com`
  across the `.html` files. They appear in the header, footer, call bar, CTA bands and
  JSON-LD.
- **Social links:** the Instagram link is real (`@grandstreetsprayfoam`). The Facebook and
  Yelp links are placeholders pointing at each platform's search — replace them with the
  real profile URLs in every `.html` file and in the `sameAs` array in `index.html`.
- **Hours:** currently Mon–Sat 7am–6pm in the footer, contact page and the
  `openingHoursSpecification` in `index.html`. Update all three together.

### Images

`assets/img/` holds each photo at two widths (`-800.jpg` and `-1600.jpg`), served through
`srcset`. To swap a photo, replace both files and keep the filename — or add a new pair and
update the `src`, `srcset` and `alt` where it is used. Alt text is written per image and
describes the actual work shown; please keep that accurate if you swap photos.

---

## Design system

Defined as CSS custom properties at the top of `assets/css/styles.css`.

- **Brand amber** `#EA9D08`, carried over from the Wix site, with **ink** `#0B0B0C` and
  warm sand neutrals.
- Amber is **never** used as text on white — that pairing is only 2.25:1. On light
  surfaces the site uses `--amber-ink` (`#8A5C00`, 5.8:1); on dark it uses `--amber-400`
  (8.7:1). Amber-as-background always carries ink-black text (9:1).
- Type: **Archivo** for headings, **Inter** for body, loaded from Google Fonts with
  `display=swap`.
- Spacing follows a 4pt scale; all tokens are `--space-1` … `--space-9`.

### Accessibility and performance notes

- Every interactive element is at least 44×44px; focus rings are visible and never removed.
- Skip link, landmark regions, breadcrumbs, `aria-current` on the active nav item, and
  `aria-expanded` on the mobile menu toggle.
- All images have `width`/`height` set to reserve space (no layout shift) and everything
  below the fold is `loading="lazy"`. Hero images are preloaded with `fetchpriority="high"`.
- `prefers-reduced-motion` disables all transitions and reveal animations.
- The FAQ uses native `<details>`, so it works with JS disabled. The gallery lightbox uses
  native `<dialog>` and degrades to a plain non-clickable grid.
- Contrast was audited programmatically across the rendered pages: 0 failures against
  WCAG AA.

---

## Decisions worth reviewing

These were judgement calls made while building. Change any of them freely.

1. **San Diego only.** The Wix homepage sells San Diego County and Orange County, but the
   Attic and Metal Garage pages describe jobs in Connecticut and Massachusetts. This site
   targets San Diego throughout, and the New England project stories were rewritten without
   naming a state. If both markets are still active, the service pages need a second
   service-area section and the second phone number added back.
2. **One phone number.** `442-413-0520` (the San Diego number from the homepage) is used
   everywhere. The Connecticut number `860-670-1700` from the older pages is not on the site.
3. **One email.** `sdsprayfoam@gmail.com`, from the current homepage. The Wix "Schedule a
   Free Estimate" button used `info@grandstreetinsulation.com` instead — if that inbox is
   the live one, swap it.
4. **No testimonial quotes.** The Wix reviews page shows review *screenshots*, so there was
   no quotable text to carry over and none was invented. The reviews section links out to
   Google, Yelp, Instagram and Facebook instead. If you have real review text with
   permission to publish it, adding a testimonial section with `Review` schema would be a
   meaningful SEO gain.
5. **Star ratings.** No `aggregateRating` is included in the structured data, because there
   is no verified rating to cite. Do not add one without real review data behind it — it is
   a Google penalty risk.
6. **Hours** (Mon–Sat, 7am–6pm) were not stated anywhere on the Wix site and are a
   placeholder. Please confirm or correct them.
