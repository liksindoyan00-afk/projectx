# BridgePath — website + admin panel

Next.js 15 (App Router) · TypeScript · PostgreSQL (Prisma) · built from the BridgePath design handoff.

- **Public site** in Armenian (default, at `/`), Russian (`/ru/…`) and English (`/en/…`): Home, Services, Process, Results, About, FAQ, Contact (enquiry form), Privacy, 404.
- **Admin panel** at `/admin`: enquiries inbox, editable statistics, universities, testimonials, team access.

## Quick start (local)

```bash
cp .env.example .env            # fill DATABASE_URL, DIRECT_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate deploy        # creates the tables
npm run db:seed                  # default figures, 8 universities, first admin
npm run dev                      # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

## Deploy (Vercel + Neon)

1. Import the repo into Vercel. Add a Postgres database from the Vercel Marketplace (Neon) — it sets `DATABASE_URL`; set `DIRECT_URL` to the unpooled connection string.
2. Add the remaining variables from `.env.example` (`SITE_URL`, `AUTH_SECRET`, `ADMIN_*`, optional `RESEND_API_KEY` / `TEAM_INBOX` / `TELEGRAM_*`, `IP_HASH_SALT`).
3. Build command: `prisma migrate deploy && npm run build` (or run migrations once from your machine).
4. Run `npm run db:seed` once against production to create the first admin and default figures.

## Admin panel

| Section | What it does |
|---|---|
| Dashboard | New enquiries waiting, last 7/30 days, pipeline by status, split by service and language |
| Enquiries | Filter by status / service / language / dates, search, CSV export (UTF‑8 with BOM for Excel). Detail view: every field, context (page, language, `?service=`, consent version), status, internal notes, quick Email / WhatsApp / Telegram / Call, permanent delete for privacy requests |
| Statistics | “18 of 20” headline + dot graphic, graduate admissions count, funding range (25%–100%), the note and caveat text in HY/RU/EN. Live preview |
| Universities | “Where they went” on Results and the list on Home (per-item “On Home”), country in 3 languages, order, hide/show |
| Testimonials | Quote and first name in 3 languages, university, level, featured (Home quote + navy card), visible, order |
| Contact details | Email, phone, WhatsApp, Telegram, Instagram, LinkedIn and reply time for the footer, Contact page, WhatsApp buttons and emails; empty = hidden |
| Account & team | Add/remove people with access, change password |

Saving statistics, universities or testimonials refreshes the public pages immediately (tagged cache revalidation).

Enquiry statuses: New → Contacted → In progress → Became client / Closed, plus Spam.

## Enquiry form

- Fields, validation messages and states (errors summary, loading, success, send‑failed with WhatsApp link) follow the handoff spec, in all three languages.
- Native radio buttons / checkboxes inside `<fieldset>`/`<legend>`, `aria-invalid` + `aria-describedby`, focus moved to the error summary / success heading.
- `?service=profile-evaluation | full-admission-consulting` pre-selects the service (used by every “Request pricing” button).
- `POST /api/enquiry` validates again on the server, stores everything (incl. language, page, referrer, service param, consent version + timestamp, hashed IP), then — after responding — emails the team inbox, sends a Telegram alert, and sends the family an auto-reply in their language. Each channel is optional and only runs when its env vars are set.
- Spam: hidden honeypot field, minimum fill time, rate limit of 5 enquiries per IP per 10 minutes. Add Turnstile/hCaptcha only if spam appears.

## Content & placeholders

- All page copy: `src/content/hy.ts`, `ru.ts`, `en.ts` (one typed object per language). Process, Results, About, FAQ, Privacy and 404 in HY/RU are first translations — **send for native review before launch**.
- Contact details (email, phone, WhatsApp, Telegram, Instagram, LinkedIn, reply days) are edited in the admin under **Contact details**; `src/content/site.ts` only holds the placeholders shown until they are saved.
- Privacy policy is the handoff template — final wording must come from the client’s legal adviser.
- Photos: three slots (Home hero 4:5, About wide 21:8, About principles 4:5) render a placeholder. Pass `src` to the `<Photo>` component in `src/app/[lang]/page.tsx` and `about/page.tsx` once licensed images are available.
- Design tokens: `src/app/globals.css` (`:root`), matching `tokens.json`. Fonts are self-hosted via `next/font` (Lora, Lato, Noto Sans, Noto Sans/Serif Armenian, JetBrains Mono).

## i18n & SEO

- Middleware rewrites root URLs to the Armenian routes; `/hy/…` redirects (308) to the unprefixed URL. No redirects by IP or browser language; the language cookie is set only when the switcher is clicked.
- The switcher links to the same page in the other language. Per-page `<html lang>`, translated title/description/OG, self-referencing canonical, `hreflang` alternates + `x-default` (Armenian), one `sitemap.xml` with alternates, `robots.txt` excluding `/admin` and `/api`.

## Project structure

```
src/
  app/[lang]/…          public pages (generated for hy, ru, en)
  app/api/enquiry       form endpoint
  app/admin/…           admin panel (login, (panel)/…, actions.ts, enquiries-export)
  components/           header, footer, form, timeline, FAQ, blocks
  content/              copy per language + site settings
  lib/                  db, auth, i18n, SEO, content loader, validation, notifications
  middleware.ts         language routing + admin protection
prisma/                 schema, migrations, seed
```

Useful scripts: `npm run typecheck`, `npm run admin:create -- email "Name" 'password'` (creates or resets an admin).
