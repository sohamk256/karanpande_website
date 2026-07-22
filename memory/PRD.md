# Karan Pande Photography — PRD

## Original Problem Statement
Portfolio website for Karan Pande, a wedding / pre-wedding / cinematic photographer
from Sambhaji Nagar (Aurangabad). Must feel premium, unique, editorial — NOT dark theme.
Homepage features a background video. Three galleries: Wedding, Pre-Wedding, Cinematic.
Admin panel to add / edit / delete media. No visitor login.

## User Choices (verbatim)
- Admin: simple username/password (visitors are NOT asked to log in).
- Media: placeholders for now; real assets to be provided later.
- Palette: Cream + sage green + copper accents.
- Contact: phone / email / WhatsApp / Instagram links (no forms).
- Cinematic section: direct video upload (URL-based for now).

## Art Direction
Editorial photography-magazine aesthetic — Awwwards-level.
Cormorant Garamond serif + Manrope sans. Cream #F4F1EB base,
Sage #7A8B7A, Copper #B87333, Ink #1A1A18. Lenis smooth scroll +
Framer Motion masked reveal hero + one editorial marquee + numbered chapters.

## Architecture
- Backend: FastAPI + Motor (MongoDB). JWT-protected admin routes. Media CRUD by category.
- Frontend: React 19 + Tailwind + Framer Motion + Lenis + react-fast-marquee.
- Routes: `/`, `/wedding`, `/pre-wedding`, `/cinematic`, `/contact`, `/admin/login`, `/admin`.

## Implemented (v1)
- Backend: admin login (JWT), media models, list/create/update/delete endpoints, seed on startup.
- Frontend: kinetic hero with bg video + masked line reveal, marquee, numbered chapters,
  asymmetric featured grid, three gallery pages, cinematic video lightbox, contact page,
  admin login + dashboard with per-category CRUD.

## Backlog (P1+)
- Real file uploads (S3 / cloud storage) instead of pasted URLs.
- Booking inquiry form option.
- Blog / journal section for shoots.
- Instagram feed embed.
