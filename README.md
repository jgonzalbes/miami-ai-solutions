# Miami AI Solutions — website

Static marketing site: plain HTML5, CSS and vanilla JS. No framework, no build
step, no npm dependencies. Drop the folder on any static host (Netlify, Vercel,
GitHub Pages, Cloudflare Pages) and it works with zero configuration.

```
index.html              Home
services.html           Services + FAQ
work.html               Case studies (#carga, #ai-sdr, #accounting-automation)
about.html              About
contact.html            Contact form
css/styles.css          Design system + every component
js/main.js              Nav, FAQ accordion, form validation
assets/icon.png         Isolated "M" mark, transparent background
assets/og-image.jpg     1200×630 social preview
favicon.*, apple-touch-icon.png, android-chrome-*.png, site.webmanifest
robots.txt, sitemap.xml
_headers                Security headers for Netlify
vercel.json             The same headers for Vercel
set-domain.js           One-command domain rename (dev utility, see below)
source-assets/          The two original logo PNGs the assets were derived from
```

## Preview locally

Any static server works. From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` straight from the file
system mostly works too, but a server matches how the site actually behaves.)

## What still needs your input

### 1. Domain — migration checklist

The real domain is not connected yet. The site runs at
`https://miami-ai-solutions-two.vercel.app`, and every absolute URL — canonical
tags, Open Graph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt` — points
there. **None of the steps below are done.** Do them in this order:

- [ ] **1. Connect the real domain in Vercel.** Project → Settings → Domains,
      add the domain and follow the DNS instructions.

- [ ] **2. Redirect the `.vercel.app` entry to the real domain.** Settings →
      Domains → edit the `.vercel.app` entry → **Redirect to**, and pick the real
      domain. Vercel does *not* do this on its own: without it the `.vercel.app`
      subdomain keeps serving the whole site in parallel, indefinitely.

- [ ] **3. Rewrite the absolute URLs.** Run:

      ```bash
      node set-domain.js <real-domain>
      ```

      It rewrites all 7 files that carry the origin — `index.html`,
      `services.html`, `about.html`, `work.html`, `contact.html`, `sitemap.xml`
      and `robots.txt` — and updates its own `CURRENT_ORIGIN` so it stays
      runnable. Commit and deploy the result.

- [ ] **4. Remove the noindex block from `vercel.json`.** The second entry in
      the `headers` array sends `X-Robots-Tag: noindex` for the host
      `miami-ai-solutions-two.vercel.app`. It is there on purpose while there is
      no real domain — but once the domain is connected and redirecting, that
      block has to go, or the site will not be indexed. Leave the first entry
      (the security headers) alone: it applies to every host.

- [ ] **5. Submit the sitemap to Google Search Console** under the property for
      the real domain: `https://<real-domain>/sitemap.xml`.

`set-domain.js` does not touch this README, so update the origin named here at
step 3 too. The script can be deleted once the real domain is in place.

### 2. Contact email — done

`contact.miamiaisolutions@gmail.com` is live on `contact.html` and in the
`ProfessionalService` JSON-LD on all five pages. Change it in one pass with:

```bash
grep -rl "contact.miamiaisolutions@gmail.com" *.html
```

### 3. Founder bio — done

`about.html` carries the founder bio under "The founder". A headshot can still be
added there if you want one.

### 4. Contact form backend — done

The form posts to Formspree and is live in production. Nothing left to wire up.

## Contact form

`contact.html` posts to a Formspree endpoint and is working in production on
Vercel. Submissions arrive in the Formspree dashboard; `vercel.json` allows
`https://formspree.io` in the CSP's `connect-src` and `form-action`, which the
browser requires for the POST to go through.

Client-side validation, the off-screen honeypot and the `role="status"` live
region all run before the POST, in `js/main.js`. That file still carries a branch
that checks for the old `REPLACE_WITH_YOUR_FORM_ENDPOINT` string; it is a no-op
now that the action is a real endpoint, and it is only worth keeping as a guard in
case the action is ever reset.

One caveat if the site ever moves off Vercel: `_headers` (the Netlify equivalent)
still has the original `connect-src 'self'; form-action 'self'` and has not had
the Formspree origin added, so the form would be blocked there until it matches
`vercel.json`.

## Security headers

`_headers` (Netlify) and `vercel.json` (Vercel) ship the same set:
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` (geolocation, camera and microphone disabled),
`Strict-Transport-Security`, and a `Content-Security-Policy` whose only external
origins are Google Fonts and — in `vercel.json` — Formspree.

Both files carry the identical policy, including `https://formspree.io` in
`connect-src` and `form-action` so the contact form can POST. Keep them in step:
Vercel reads `vercel.json` and ignores `_headers`, so a change made in only one of
them will not surface until the site is deployed somewhere else. On a host other
than Netlify or Vercel, set the same headers in that host's own configuration.

## Brand assets

Both were generated from `source-assets/` and can be regenerated if the logo
changes:

- `assets/icon.png` — the "M" mark cropped out of `Logo.png` with the white
  background converted to alpha (soft edge, not a hard cutout). The favicons and
  `apple-touch-icon.png` are derived from it; the Apple icon is flattened onto
  `#0b0f17` because iOS ignores transparency.
- `assets/og-image.jpg` — `Banner.png` with its white margins cropped away, scaled
  to fit (not cropped) inside 1200×630 on the banner's own dark background.

The site never uses the full lockup image: the header shows the isolated mark next
to real HTML text ("Miami **AI** Solutions"), so the wordmark stays legible on the
dark theme and remains selectable, translatable and indexable.

## Accessibility

Skip link, one `<h1>` per page, `:focus-visible` rings on every interactive
control, `aria-expanded`/`aria-controls` on the mobile menu and FAQ, a
`role="status"` live region for form feedback, and a `prefers-reduced-motion`
branch that disables the hero animation. The logo image uses `alt=""` because the
adjacent text already names the company.
