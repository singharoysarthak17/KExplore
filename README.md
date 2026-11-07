# K Explore — Premium Event Discovery & Management

A premium event discovery platform that combines the **simplicity of Luma**, the **visual storytelling of Fever** and the **functionality of Eventbrite**.

Built for the task: *Design and Develop a Responsive Event Management Website*.

## ✨ Overview

**K Explore** lets users:

- **Explore** upcoming events through a striking hero, category browsing and a full event grid.
- **Discover** events by category, venue, city or free-text search.
- **Register** for events via a validated registration form (name, email, phone, event) with an instant confirmation and local ticket code.
- **Experience** event details with meta information and live countdown timers.

## 🎯 Features

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
- Fully responsive: desktop (3–4 col grid), tablet (2 col), mobile (1 col)

## 🎨 Design system

- **Background:** deep navy (`#0a0e1a`) or off-white (`#fafaf7`)
- **Accent:** electric violet (`#7c3aed`) + orange (`#f4511e`)
- **Typography:** Plus Jakarta Sans (display), Manrope (headings), Inter (body)
- **Cards:** rounded corners, gradient media areas, smooth hover effects

## 📁 Folder structure

```
KExplore/
├── index.html          # Markup: header, hero, categories, events, about, footer, modal
├── css/
│   └── style.css       # Design tokens, components, responsive rules
├── js/
│   └── app.js          # Data, rendering, filters, modal, registration logic
├── assets/
│   └── favicon.svg     # Brand mark
├── README.md
└── .gitignore
```

## 🛠 Tech stack

- HTML5, CSS3, JavaScript (vanilla — no framework required; optional Tailwind CSS / React were allowed by the task)
- Google Fonts (self-hosted via CDN link)
- Local `localStorage` for registrations + theme preference

## 🚀 Run locally

Because this is a static site, no build step is required.

```bash
# from the project root
npx serve .
# or
python -m http.server 8080
```

Then open the served URL (e.g. http://localhost:8080).

## 📦 Deployment

The production build is static and can be deployed to:

- **GitHub Pages** — push to `main`, enable Pages from the repository root.
- **Vercel / Netlify** — import the repository, no build command needed (`npm run build` not required; static output).

## 📝 Submission checklist

- [x] GitHub repository link
- [x] Deployed website link (Vercel / Netlify / GitHub Pages)
- [x] README explaining the project and implementation
- [ ] Event photos / real imagery (placeholders used in UI)

## 👩‍💻 Author

**Sarthak** — `singharoysarthak17`
