# Sentryx

Marketing site for Sentryx — private property oversight and estate management for second-home and estate owners (Rockland, Westchester & Orange Counties, NY).

Static HTML/CSS/JS. No build step, no framework, no dependencies to install.

## Local preview

From this folder, run a static file server and open the printed URL:

```
python -m http.server 5500
```

(Any static server works — `npx serve`, VS Code Live Server, etc. Opening the HTML files directly via `file://` will break the root-relative `/css`, `/js`, and nav links, so use a server.)

## Deployment

This repo is connected to Vercel and configured to auto-deploy on push to `main`. No build command or output directory is needed — Vercel serves the static files as-is.

## Structure

```
index.html          Home
services.html        Services (Property Oversight, Home Visit Prep, Vendor Coordination, Emergency Response, Owner Representation)
how-it-works.html    Step-by-step process
about.html            Brand story, approach, service area
contact.html          Contact form + info
404.html              Custom not-found page
css/styles.css        Shared design system
js/main.js             Nav toggle, scroll reveal, contact form handling
favicon.svg           Wordmark-style "S" mark
robots.txt / sitemap.xml
```

## Known placeholders / follow-ups

- **Contact form is not wired to a backend.** `js/main.js` currently just shows a client-side success message. Before launch, connect it to a real endpoint (e.g. Formspree, a Vercel serverless function, or a mailto integration) so submissions actually reach `team@sentryxestates.com`.
- **Address / office details** on the contact page use a generic Rockland/Westchester/Orange County service-area description rather than a specific street address — add one if the business has a public office location.
- **Logo**: header/footer currently use a text wordmark ("Sentryx") per brand direction (wording only, no circular badge). Swap in the finalized logo files from the brand drive folder if you want the exact typeset mark instead of the CSS-rendered text.
- **Pricing is intentionally omitted** from the public site — the known figures were internal planning projections, not public pricing. Add a pricing section only if/when you want that public.
