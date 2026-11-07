# K Explore — Premium Event Discovery & Management

A premium event discovery platform that blends the simplicity of Luma, the visual storytelling of Fever and the functionality of Eventbrite.

Built for the task: *Design and Develop a Responsive Event Management Website*.

## Overview

K Explore lets users:

- **Explore** upcoming events through a striking hero, category browsing and a full event grid.
- **Discover** events by category, venue, city or free-text search.
- **Register** for events via a validated registration form (name, email, phone, event) with an instant confirmation and local ticket code.
- **Experience** event details with meta information and live countdown timers.

## Features

- Responsive event management UI (HTML5 + CSS3 + vanilla JavaScript)
- Hero section with live event search
- Event cards: image area, category badge, date badge, venue, price, attendees
- Category filter chips + category cards
- Sort by date (soonest/latest) or popularity
- Event detail modal with full details, tags and countdown
- Registration form with client-side validation and confirmation flow
- Registrations persisted in `localStorage`
- Dark / light theme with persisted choice
- Skeleton loading state while events render
- Scroll-reveal animations, hover transitions
- Fully responsive: desktop (3-4 col grid), tablet (2 col), mobile (1 col)

## Design system

- **Light mode:** warm off-white background (`#F7F7F2`), soft sage secondary (`#E7EEE3`), sage accent (`#8FAE91`), forest green secondary (`#164C32`)
- **Dark mode:** deep charcoal green background (`#101A16`), dark forest secondary (`#17271F`), sage accent (`#A5C9A8`), soft mint secondary (`#C4E2C5`)
- **Typography:** Plus Jakarta Sans (display), Manrope (headings), Inter (body)
- **Cards:** rounded corners, gradient media areas, smooth hover effects

## Folder structure

```
KExplore/
├── index.html          # Main markup: header, hero, categories, events section, about, footer, modal
├── css/
│   └── style.css       # Design tokens, components, responsive rules (sage/forest palette, theme switching)
├── js/
│   └── app.js          # Data (12 events), rendering logic, filters, modal, registration with validation
├── assets/
│   ├── favicon.svg     # Brand mark
│   └── event-night.svg # Animated event poster SVG (replaces real photography)
├── README.md
└── .gitignore
```

## Tech stack

- HTML5, CSS3, JavaScript (vanilla — no framework required; optional Tailwind CSS / React were allowed by the task)
- Google Fonts (self-hosted via CDN link)
- Local `localStorage` for registrations + theme preference

## Run locally

Because this is a static site, no build step is required.

```bash
# from the project root
npx serve .
# or
python -m http.server 8080
```

Then open the served URL (e.g. http://localhost:8080).

## Deployment

The production build is static and can be deployed to:

- **GitHub Pages** — push to `main`, enable Pages from the repository root.
- **Vercel / Netlify** — import the repository, no build command needed (`npm run build` not required; static output).

Author

**Sarthak** — `singharoysarthak17`