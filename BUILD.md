# Build: Miami AI Solutions website

## Project overview
Build the marketing website for **Miami AI Solutions**, a Miami, FL-based studio that designs and builds AI automation systems, AI agents, and full-stack software for businesses. Tagline: "Building AI-Powered Digital Products & Business Solutions."

**Output**: a static multi-page site — plain HTML5 + CSS + vanilla JS, no framework, no build step, no npm dependencies. It must run by opening the files directly on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages) with zero configuration. Use semantic HTML and CSS custom properties for the design tokens.

**Pages** (clean, lowercase, hyphen-free filenames):
- `index.html` — Home
- `services.html` — Services (includes FAQ section)
- `about.html` — About
- `work.html` — Work / case studies
- `contact.html` — Contact (form)

Shared `css/styles.css` and `js/main.js`. Header/nav and footer must be identical (byte-for-byte structure) across all five pages except for `aria-current="page"` on the active nav link.

## Brand assets (I will provide the files)
I have two source logo images (PNG, no transparency, white background):
1. A square lockup: circuit/skyline "M" icon above the wordmark "Miami AI Solutions".
2. A wide banner version: the same lockup plus the line "AI • Automation • Software Development" over a dark navy cityscape background.

I'll place these in `/source-assets/` in the project. From them, please generate and use:
- **Icon-only mark**: crop just the "M" icon (no wordmark) from image 1, tightly bounded, then convert the white background to transparent (threshold near-white pixels to alpha, keep a soft anti-aliased edge rather than a hard cutout). Save as `assets/icon.png` (use for the header logo — paired with real HTML text "Miami AI Solutions", not baked-in text — and for favicons).
- **Favicon set** generated from the transparent icon: `favicon.ico` (multi-size), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180×180, flatten onto a solid `#0b0f17` background since iOS doesn't respect transparency well), `android-chrome-192x192.png`, `android-chrome-512x512.png`.
- **Open Graph image** (`assets/og-image.jpg`, 1200×630): take the wide banner (image 2), crop out any plain white margins so only the dark branded content remains, then scale-to-fit (contain, not cover — don't crop off the wordmark or skyline) onto a 1200×630 canvas filled with the banner's own dark background color, so nothing gets cut off.
- Do **not** use the full lockup (icon + dark wordmark text) anywhere on the dark-themed site itself — in image 1 the wordmark text is dark charcoal and reads with very low contrast on a navy/black background. Only use the isolated icon on-site; render "Miami AI Solutions" as real text styled in CSS instead.

## Design system
Palette is derived directly from the brand mark — deep navy/black base with a brushed chrome/silver metallic accent. No added hue; the metallic gradient itself is the accent color (avoid defaulting to a neon/acid accent on black, which is a generic AI-generated-site look).

```css
--ink:        #0b0f17;  /* page background */
--surface:    #131826;  /* card / section background */
--surface-2:  #1a2032;  /* elevated surface, hover */
--line:       #262e42;  /* hairline borders */
--steel:      #626d7f;  /* muted text, small labels */
--silver:     #b7c0cc;  /* secondary body text */
--paper:      #eef1f5;  /* heading white */
--white:      #f8f9fb;  /* body text on dark */
--chrome-gradient: linear-gradient(120deg, #7c8797 0%, #eef1f5 46%, #9aa5b4 78%, #7c8797 100%);
```

**Type**: two clearly distinct families — "Space Grotesk" (headings, nav, labels — technical but warm character) and "Inter" (body copy, high legibility). Load both from Google Fonts. Avoid tracked-out ALL-CAPS eyebrow labels, avoid monospace for small data labels, avoid accenting just a single word in a headline with italics/color — the only deliberate color-as-meaning move is the metallic gradient clipped onto the word "AI" in the logotype and section eyebrows.

**Layout**: predominantly left-aligned (this is a B2B technical services site, not a centered marketing-fluff page). Max content width ~1180px. Generous section padding (`clamp()`-based, scales down gracefully to mobile).

**Hero art**: build an original inline SVG illustration that echoes the logo's circuit-board + skyline motif (silhouette buildings, a soft circle backdrop, right-angle circuit traces connecting small node circles, a few "signal" dots in a lower-corner mini network graph) — NOT a generic gradient blob. Animate the circuit traces drawing in once on page load (`stroke-dasharray`/`stroke-dashoffset`), respecting `prefers-reduced-motion` (disable/shorten the animation for users who request reduced motion).

**Components needed in `styles.css`**: sticky blurred-backdrop header with mobile hamburger menu (accessible: `aria-expanded`, `aria-controls`, closes on link click), buttons (`.btn-primary` metallic gradient, `.btn-ghost` outline), cards, a numbered 4-step process list (numbering is appropriate here — it's a genuine sequence), a proof/stats strip with vertical dividers on desktop, an accordion FAQ (single-open, animated max-height, `+`-to-`×` icon rotation), service detail blocks (two-column on desktop: name/meta left, description+checklist+example right), case-study cards, a contact form with floating validation errors, and a visibly distinct dashed-border "placeholder" callout component (amber label reading "Placeholder") for content I haven't finalized yet.

**Accessibility baseline**: visible focus rings (`:focus-visible`, not just `:focus`), a skip-to-content link, one `<h1>` per page, alt text on meaningful images (empty `alt=""` for the decorative logo icon since the wordmark is adjacent text), color contrast checked against the dark background, all interactive controls reachable and operable by keyboard.

## Real proof points — use exactly these facts, do not invent metrics, clients, or testimonials beyond them
1. **Carga** — a full-stack import-analytics platform, built end-to-end (Next.js, TypeScript, Supabase, Claude API). Currently **in pilot** with a real business (not a general-availability claim).
2. **AI SDR System** — an AI-driven sales development system (Clay, Claude, n8n, HubSpot) that generates **approximately 50 qualified B2B leads per week**.
3. **Accounting Workflow Automation** — an automated accounting workflow built with Claude CoWork, Google Sheets, and Slack.

These three appear, worded consistently, in: the Home proof strip, the Services page (as the "Example" under the most relevant service), and as full case studies on the Work page (with anchor ids `#carga`, `#ai-sdr`, `#accounting-automation` so Services can deep-link to them).

## Page-by-page content

### index.html (Home)
- **Hero**: eyebrow "AI automation & software studio — Miami, FL"; H1 "Building AI-powered digital products & business solutions."; lede "We design and build automation systems, AI agents, and full-stack software that take real work off your team's plate — systems running in production, not slideware."; two CTAs: "Start a project" → contact.html, "See our work" → work.html.
- **Proof strip** (3 columns): the three real projects above, each with a small category tag, one-line description, and its tech stack listed.
- **Services overview** (6 cards, short one-liners, each linking to its anchor on services.html): AI Automation — "End-to-end automation for the repetitive, manual work slowing your team down." · AI Agents & Chatbot Development — "Custom AI agents and chatbots that handle real tasks — from lead gen to support." · Workflow Automation — "Connect the tools you already use into automated, reliable workflows." · Custom Software Development — "Bespoke applications built around how your business actually works." · Full-Stack Web Development — "Modern, fast, maintainable web apps — frontend to database." · API Integration — "Wire your systems together: CRMs, spreadsheets, AI models, and more."
- **How We Work** (4 numbered steps): 01 Discover — "We map the workflow or problem, and find where automation or AI genuinely helps — and where it doesn't." 02 Design — "We scope a concrete system: what it does, what it touches, and how you'll know it's working." 03 Build — "We build and test against your real data and workflows, not a demo environment." 04 Operate — "We deploy it, hand over documentation, and stay involved as your business changes."
- **CTA band**: "Ready to build something real?" → Start a project (contact.html).

### services.html
- Header: eyebrow "Services"; H1 "What we build"; lede "Six connected services covering AI automation, AI agents, and custom software. Most projects combine two or three of them into one working system." (Write this as an answer-first paragraph — it should stand alone as a clean, quotable definition for AI answer engines.)
- Six `service-block` sections, each with an `id` (for anchor links), a short "what's included" checklist (3 bullets), and — where applicable — an "Example:" line citing the matching real project with a link to its Work anchor:
  1. `#ai-automation` — AI Automation. Desc: "We identify manual, repetitive processes in your business and replace them with automated systems — so your team spends time on decisions, not data entry." Bullets: process mapping & automation opportunity assessment; automated data pipelines and workflows; ongoing monitoring so automations keep working as your business changes. Example: references both AI SDR + accounting automation, links to work.html.
  2. `#ai-agents` — AI Agents & Chatbot Development. Desc: "We design and build AI agents and chatbots that do real work — qualifying leads, answering customer questions, or handling internal requests — not just scripted FAQ bots." Bullets: custom agent design around your data and tools; integration with your CRM, inbox, or messaging platform; testing and refinement against real conversations, not scripted demos. Example: AI SDR system, links to work.html#ai-sdr.
  3. `#workflow-automation` — Workflow Automation. Desc: "We connect the tools you already use — spreadsheets, Slack, email, CRMs — into automated workflows that remove manual handoffs." Bullets: audit of your current manual workflow; automation built with the tools your team already uses; handoff and documentation so your team can maintain it. Example: accounting automation, links to work.html#accounting-automation.
  4. `#custom-software` — Custom Software Development. Desc: "When an off-the-shelf tool doesn't fit how your business works, we design and build the software from scratch." Bullets: requirements and scoping around your actual workflow; full application design, build, and testing; ongoing support after launch. Example: Carga, links to work.html#carga.
  5. `#web-development` — Full-Stack Web Development. Desc: "We build modern web applications end to end — from the interface your team uses every day to the database and APIs behind it." Bullets: frontend built with modern frameworks (e.g. Next.js); backend, database, and authentication; deployment and hosting setup. Example: Carga, links to work.html#carga.
  6. `#api-integration` — API Integration. Desc: "We connect your existing systems — CRMs, spreadsheets, AI models, internal tools — so data flows between them without manual copy-pasting." Bullets: integration with common business tools and CRMs (e.g. HubSpot); AI model integration (e.g. the Claude API); custom API development where no ready-made integration exists. Example: references Claude API + Supabase + HubSpot + n8n across the shipped systems, links to work.html.
- **FAQ accordion** (id `#faq`), six Q&As, each also emitted as `FAQPage` JSON-LD:
  1. Q: "What does Miami AI Solutions do?" A: "Miami AI Solutions designs and builds AI automation systems, AI agents, and full-stack software for businesses — turning manual processes into reliable, running systems."
  2. Q: "What's the difference between AI automation and an AI agent?" A: "Automation follows a fixed set of rules to move data or trigger actions. An AI agent uses a language model to make judgment calls within a task — like qualifying a lead or drafting a reply — before handing off or acting."
  3. Q: "Do you build fully custom software, or only automations?" A: "Both. Some projects are a single automated workflow; others are a full custom application, like our Carga platform. Many projects combine automation, an AI agent, and a custom interface in one system."
  4. Q: "How does a project typically start?" A: "With a discovery conversation about the workflow or problem you want to solve, followed by a concrete scope of what we'll build and how you'll know it's working."
  5. Q: "How much does a project cost?" A: "It depends on scope — a single automated workflow costs less than a full custom application. We provide a fixed-scope quote after the discovery call, before any work begins."
  6. Q: "Is Miami AI Solutions based in Miami?" A: "Yes — Miami AI Solutions is based in Miami, FL, and works with businesses both locally and remotely."
- CTA band: "Not sure which service you need?" → contact.html.

### about.html
- Header: eyebrow "About"; H1 "A Miami-based studio for AI-powered systems."; lede "Miami AI Solutions designs and builds automation, AI agents, and custom software for businesses — systems running in production, not proofs of concept."
- "What we believe" — 4 cards: **Systems over slideware** ("We measure success by what's running in production, not by how good the pitch deck looks.") · **Right-sized automation** ("Not everything needs an AI agent. We recommend the simplest system that reliably solves the problem.") · **Built to be maintained** ("Every system we hand off comes with documentation your team can actually use.") · **Miami-based, hands-on** ("We work closely with each client rather than handing a project off to a large, anonymous team.")
- "Who's behind it" — insert a visibly marked **placeholder block** ("Add a short founder bio here — background, why you started Miami AI Solutions, and a headshot if you'd like one. Two to four sentences works well.") — do not invent a founder bio.
- "Where we work" — "Miami AI Solutions is based in Miami, FL, and works with businesses both locally and remotely."
- CTA band → contact.html.

### work.html
- Header: eyebrow "Work"; H1 "Real systems we've built."; lede "A look at systems currently in use or in pilot. No fabricated case studies — this is what's actually running."
- Three case-study articles (ids `#carga`, `#ai-sdr`, `#accounting-automation`), each with category tags, a status line (Carga: "In pilot with a real business"; AI SDR: "Actively generating leads"; Accounting: "In active use"), the description from the "Real proof points" section above, and the tech stack.
- CTA band → contact.html.

### contact.html
- Header: eyebrow "Contact"; H1 "Start a project."; lede "Tell us about the process you want to automate or the system you want built. We reply within one business day."
- Two-column layout: form on the left, contact info on the right.
- **Form fields**: Name* (text), Email* (email), Company (text, optional), Project type (select: matches the 6 services + "Not sure yet"), Project details* (textarea, min 10 chars). Plus a visually hidden honeypot field (`tabindex="-1"`, `autocomplete="off"`, off-screen via CSS not `display:none`) to catch bots.
- Client-side JS validation (name required, valid email pattern, message length) with per-field inline error text, and a `role="status" aria-live="polite"` status region for success/error after submit.
- The `<form action="...">` should point at a clearly named placeholder (e.g. `REPLACE_WITH_YOUR_FORM_ENDPOINT`) — **do not fabricate a working backend**. On submit, if the action still contains that placeholder string, show the visitor a friendly "this form isn't connected yet" status instead of pretending to send it, and log a console warning for the developer. Document in the README how to wire it to Formspree or Netlify Forms in a couple of minutes.
- Right column: Email `hello@miamiaisolutions.com` (wrapped in a visible **placeholder** callout telling me to replace it with the real inbox), Location "Miami, FL", Response time "We reply within one business day."

## Technical requirements

**SEO**: unique `<title>` and meta description per page, canonical URL per page, `robots.txt` referencing `sitemap.xml`, an XML sitemap listing all 5 pages, Open Graph + Twitter Card tags (using the generated `og-image.jpg`) on every page, clean lowercase URLs.

**Structured data (schema.org, JSON-LD)**:
- `ProfessionalService` on every page (name, url, logo, image, description, address `{"addressLocality":"Miami","addressRegion":"FL","addressCountry":"US"}`, areaServed "US"). Don't invent a phone number, email, or `sameAs` social links — omit fields I haven't given you rather than filling them with placeholders.
- `FAQPage` on services.html matching the visible FAQ accordion content exactly.
- An `ItemList` of the 6 `Service` entries on services.html.

**GEO (AI answer engine optimization)**: every page should open with a direct, self-contained, quotable definition of what the company does (no vague marketing throat-clearing before the substance). Keep the three real-project facts worded identically everywhere they appear, so an AI system parsing multiple pages converges on one consistent set of facts rather than paraphrased variants.

**Security headers**: since this is a static site, ship both a Netlify `_headers` file and a `vercel.json` with equivalent headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling geolocation/camera/microphone, `Strict-Transport-Security`, and a `Content-Security-Policy` (`default-src 'self'`, allow Google Fonts domains for `style-src`/`font-src`, `frame-ancestors 'none'`). Note inline in the README that `connect-src`/`form-action` need the chosen form backend's domain added once the contact form is wired up.

**Domain placeholder**: use `https://www.miamiaisolutions.com` as the working domain everywhere (canonical URLs, sitemap, OG tags, JSON-LD `url`/`@id`) — I haven't registered it yet, so make this a single easily-editable constant, not something hardcoded in 30 places.

## What NOT to do
- Don't invent client names, testimonials, review quotes, employee counts, founding year, or any metric beyond the three proof points given.
- Don't use a generic near-black + neon-accent template look, warm-cream-and-serif template look, or identical-rounded-SaaS-card-kit look — follow the brand's own monochrome-metallic direction instead.
- Don't ship a non-functional "fake" contact form that silently pretends to succeed — make the missing-backend state visible to the developer and honest to the visitor.
- Don't add tracked-out ALL-CAPS labels, a monospace font for data labels, or a "→" appended to every link/button as decoration.

## Deliverable
All files at the project root (`index.html`, `services.html`, `about.html`, `work.html`, `contact.html`, `css/`, `js/`, `assets/`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `_headers`, `vercel.json`), plus a short `README.md` covering: the placeholders that still need my input (domain, email, founder bio, form backend), how to wire the contact form (Formspree and Netlify Forms options), and how to preview locally (`python3 -m http.server`).
