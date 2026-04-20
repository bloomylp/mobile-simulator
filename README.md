# mobile-simulator

LittlePay Traveller Wallet — iOS + Android device simulator.

Mobile-responsive React SPA demo — digital card issuance, spend dashboard, transit transaction history, top-up flow, concession enrolment, and an Android (Pixel 10) platform view with Littlobus transit-pass flow.

Fully mocked — no backend. Auth accepts any email/password via `sessionStorage`.

## Stack

- Vite 8 + React 19 + React Router 7
- Tailwind CSS 3
- Lucide React (icons)
- Vitest + jsdom + @testing-library/react
- Express (SPA fallback for Elastic Beanstalk deploy)

## Scripts

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build → dist/
npm run preview   # preview built app
npm run lint      # ESLint (flat config)
npm run test      # Vitest watch mode
npm run test:run  # Vitest single run (558 tests)
npm start         # serve dist/ via Express (EB / prod)
```

## Routes

| Path | Page |
|------|------|
| `/` | SplashPage |
| `/login` | LoginPage |
| `/home` | HomePage (default post-login) |
| `/cards` | CardsPage |
| `/order-complete` | OrderCompletePage |
| `/concession` | ConcessionPage |
| `/enrolment` → `/enrolment/complete` | Concession enrolment wizard (Intro + 4 steps + complete) |
| `/profile` | ProfilePage |
| `/promotions` | PromotionsPage (HamburgerMenu only when Dynamic Island controls visible) |

Top-up renders as a bottom-sheet overlay on `/home`.

## Features

- **iPhone + Android (Pixel 10)** device shells — toggle above the frame when Dynamic Island / punch-hole is tapped
- **iOS:** full app routes, HamburgerMenu navigation (Home / Cards / Concession / Profile / Promotions), Dynamic Island side-controls (low-balance toast + push notification)
- **Android:** standalone Littlobus transit-pass flow — add pass, fare-cap progress bar, recent activity, payment issue banner
- **Concession enrolment wizard** — group select → SheerID identity verification (TEST MODE banner autofills form) → card assign (inline "Add a new card" form with auto-formatting) → review → complete
- **Multi-concession support** — each completed enrolment appends to the list; ConcessionPage shows `Active (N)` with one card per enrolment
- **Card ordering** — digital (iOS Add-to-Wallet flow + US transit card selection) or physical; deduplication via store subscription
- **Top-up bottom sheet** — Card / Apple Pay / Google Pay tabs; persists top-up transactions per card
- **Per-card transaction history** — date-range filter, grouped by date
- **EN/ES language toggle**
- **Notifications centre** — unread badge, low-balance + promotion notification types
- **Full demo reset** — JR avatar on ProfilePage or Logout in HamburgerMenu wipes all state and returns to login

## Project Layout

See `CLAUDE.md` (root) for the full file map, state model, and design rules.

## Deploy

Express server at `server.js` serves `dist/` with SPA fallback. Elastic Beanstalk Node.js platform runs `npm start`.
