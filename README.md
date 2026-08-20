# San Diego Spray Foam — website

A static marketing site for San Diego Spray Foam, built to be hosted on GitHub Pages.
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

`CNAME` currently contains `sandiegosprayfoam.com`. To use it:

- Point the domain's DNS at GitHub Pages (four `A` records for the apex, or a `CNAME`
  record for `www` pointing at `YOUR-USERNAME.github.io`).
- In **Settings → Pages → Custom domain**, enter the same domain and enable **Enforce HTTPS**.

**If you are not using a custom domain**, delete the `CNAME` file. While it exists, GitHub
Pages serves the site at that domain and redirects the `github.io` URL to it — which fails
until the DNS records are live.

Every page uses relative asset paths, so the site works unchanged at a domain root or at a
project subpath like `/grandst/`. Nothing else needs editing for the path.

### Canonical URLs

Every page has a `<link rel="canonical">`, Open Graph tags and JSON-LD pointing at
`https://sandiegosprayfoam.com`. If the site lives somewhere else, replace that string
everywhere — from the repo root:

```bash
grep -rl "https://sandiegosprayfoam.com" --include="*.html" --include="*.xml" --include="*.txt" . | xargs sed -i 's|https://sandiegosprayfoam.com|https://YOUR-USERNAME.github.io/YOUR-REPO|g'
```

Note the `github.io` form has no trailing slash before the page name, so
`.../YOUR-REPO/about.html` comes out correct. Point canonicals at wherever the site is
actually reachable — a canonical aimed at a domain that does not resolve will keep the
pages from being indexed at all.

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
- **Social links:** Facebook and Instagram are real profile URLs. The Yelp link is still a
  placeholder pointing at Yelp's search — replace it in every `.html` file once the profile
  exists, and add it to the `sameAs` array in `index.html` at that point. It is deliberately
  **not** in `sameAs` today, because pointing `sameAs` at a search page rather than a real
  profile is worse than omitting it.
  - Note the Instagram handle is still `@grandstreetsprayfoam`, from the previous name. If
    that account gets renamed, update the link and the `sameAs` entry together.
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

Confirmed by the owner:

- **Business name:** San Diego Spray Foam (renamed from Grand Street Insulation).
- **Phone:** 442-413-0520 · **Email:** sdsprayfoam@gmail.com
- **Facebook:** https://www.facebook.com/profile.php?id=61592294806452

Still judgement calls — change any of them freely:

1. **Domain is an assumption.** Every canonical URL, Open Graph tag, JSON-LD `@id` and the
   `CNAME` file use `sandiegosprayfoam.com`, chosen to match the new name. Nobody has
   confirmed this domain is registered. If it is wrong, fix it everywhere in one pass:

   ```bash
   grep -rl "sandiegosprayfoam.com" --include="*.html" --include="*.xml" --include="*.txt" --include="*.webmanifest" . CNAME | xargs sed -i 's|sandiegosprayfoam\.com|THE-REAL-DOMAIN.com|g'
   ```

   Deploying to `username.github.io/<repo>` instead? Delete `CNAME` and point the canonicals
   at that URL — a canonical aimed at a domain that does not resolve keeps the pages out of
   the index entirely.
2. **San Diego only.** The Wix homepage sold San Diego County and Orange County, but its
   Attic and Metal Garage pages described jobs in Connecticut and Massachusetts. This site
   targets San Diego throughout, and those project stories were rewritten without naming a
   state. The Connecticut number `860-670-1700` from the older pages is not on the site. If
   both markets are still active, the service pages need a second service-area section and
   that number added back.
3. **A second email may exist.** The old Wix "Schedule a Free Estimate" button pointed at
   `info@grandstreetinsulation.com`, not the Gmail address. That inbox is not referenced
   anywhere on this site — worth checking whether it still receives leads.
4. **No testimonial quotes.** The Wix reviews page showed review *screenshots*, so there was
   no quotable text to carry over and none was invented. The reviews section links out to
   Google, Yelp, Instagram and Facebook instead. If you have real review text with
   permission to publish it, adding a testimonial section with `Review` schema would be a
   meaningful SEO gain.
5. **Star ratings.** No `aggregateRating` is included in the structured data, because there
   is no verified rating to cite. Do not add one without real review data behind it — it is
   a Google penalty risk.
6. **Hours** (Mon–Sat, 7am–6pm) were not stated anywhere on the Wix site and are a
   placeholder. Please confirm or correct them.
7. **The logo is hand-authored SVG**, not a raster export — `assets/img/logo-emblem.svg`
   (full badge), `logo-mark.svg` (header/compact) and `favicon.svg`. The wordmark uses live
   text in Arial Black with `textLength`, so it always fits the banner regardless of which
   font a viewer has. If you ever want it as a PNG, render it with
   `chrome --headless --screenshot=logo.png --window-size=1000,1000 <path-to-svg>`.
