# Sentryx

Marketing site for Sentryx — private property oversight and estate management for second-home and estate owners (Rockland, Westchester & Orange Counties, NY).

Static HTML/CSS/JS, plus one Vercel serverless function for the contact form. No build step, no framework, no npm dependencies.

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
api/contact.js         Serverless function that emails contact form submissions via Resend
favicon.svg           Wordmark-style "S" mark
robots.txt / sitemap.xml
```

## Contact form

Submissions POST to `/api/contact` (a Vercel serverless function), which sends the message to `team@sentryxestates.com` via [Resend](https://resend.com). Requires a `RESEND_API_KEY` environment variable set in the Vercel project (Project Settings → Environment Variables) — never commit the key to this repo.

The function currently sends from Resend's shared `onboarding@resend.dev` test address, which works out of the box but isn't ideal for deliverability long-term. To send from `@sentryxestates.com` instead, verify the domain in the Resend dashboard (adds a couple DNS records) and update `FROM_EMAIL` in `api/contact.js`.

## Known placeholders / follow-ups

- **Address / office details** on the contact page use a generic Rockland/Westchester/Orange County service-area description rather than a specific street address — add one if the business has a public office location.
- **Logo**: header/footer currently use a text wordmark ("Sentryx") per brand direction (wording only, no circular badge). Swap in the finalized logo files from the brand drive folder if you want the exact typeset mark instead of the CSS-rendered text.
- **Pricing is intentionally omitted** from the public site — the known figures were internal planning projections, not public pricing. Add a pricing section only if/when you want that public.
