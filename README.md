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

### 1. Domain

The site uses `https://www.miamiaisolutions.com` for canonical URLs, Open Graph
tags, JSON-LD and the sitemap. Absolute URLs have to be in the HTML for SEO, so
instead of editing them by hand, change the domain in one command:

```bash
node set-domain.js www.yourdomain.com
```

That rewrites the five pages plus `sitemap.xml` and `robots.txt`, and updates its
own constant so it stays runnable. Delete the script once the real domain is set.

### 2. Contact email

`contact.html` shows `hello@miamiaisolutions.com` inside a dashed **Placeholder**
callout. Replace it with your real inbox and delete the surrounding
`<div class="placeholder">…</div>` wrapper so the callout disappears.

### 3. Founder bio

`about.html` has a **Placeholder** block under "Who's behind it". Write two to
four sentences, add a headshot if you want one, and remove the placeholder
wrapper.

### 4. Contact form backend

The form's `action` is the literal string `REPLACE_WITH_YOUR_FORM_ENDPOINT`. While
it is still there, submitting shows the visitor an honest "this form isn't
connected yet" message and logs a warning in the console — it never pretends to
send. See the next section to wire it up.

## Wiring the contact form

Client-side validation, the honeypot field and the status region already work.
You only need to point the form at a backend.

### Option A — Formspree (works on any host)

1. Create a form at <https://formspree.io> and copy your form ID.
2. In `contact.html`, replace the action:

   ```html
   <form class="form" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="post" novalidate>
   ```

3. Add Formspree to the CSP in **both** `_headers` and `vercel.json` — the browser
   blocks the POST otherwise:

   ```
   form-action 'self' https://formspree.io;
   ```

   (If you switch to Formspree's AJAX endpoint instead of a normal POST, add it to
   `connect-src` as well.)

### Option B — Netlify Forms (Netlify only)

1. In `contact.html`, change the opening tag to:

   ```html
   <form class="form" id="contact-form" action="/thank-you.html" method="post" novalidate
         name="contact" data-netlify="true" netlify-honeypot="company-website">
   ```

2. Add a hidden field as the first child of the form so Netlify can identify it:

   ```html
   <input type="hidden" name="form-name" value="contact">
   ```

3. Create a small `thank-you.html` for the redirect (copy any page and swap the
   content), and deploy. Netlify picks the form up at build time; submissions show
   up under **Forms** in the site dashboard.

Netlify Forms posts to your own origin, so the existing `form-action 'self'`
already covers it. The `netlify-honeypot` attribute reuses the honeypot field that
is already in the markup.

Either way, once a backend is live, delete the `REPLACE_WITH_YOUR_FORM_ENDPOINT`
branch check in `js/main.js` only if you want to — it is a no-op as soon as the
action no longer contains the placeholder string.

## Security headers

`_headers` (Netlify) and `vercel.json` (Vercel) ship the same set:
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` (geolocation, camera and microphone disabled),
`Strict-Transport-Security`, and a `Content-Security-Policy` that allows only
Google Fonts as an external origin.

**Remember:** `connect-src` and `form-action` need your form backend's domain
added once the contact form is wired up (see above). On a host other than Netlify
or Vercel, set the same headers in that host's own configuration.

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
