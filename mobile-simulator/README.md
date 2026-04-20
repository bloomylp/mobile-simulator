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
npm run test:run  # Vitest single run (535+ tests)
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
| `/help-centre` | HelpCentrePage |
| `/promotions` | PromotionsPage (Hamburger menu only when Dynamic Island controls visible) |

Top-up renders as a bottom-sheet overlay on `/home`.

## Features

- iPhone + Android (Pixel 10) device shells — toggle at top of frame
- iOS: full app routes + Dynamic Island side-controls (low balance / push notification)
- Android: standalone Littlobus transit-pass flow with fare-cap progress bar
- Concession enrolment flow (group select → SheerID → card link → review)
- Top-up bottom sheet with Card / Apple Pay tabs
- EN/ES language toggle
- Notifications centre with unread badge

## Project Layout

See `CLAUDE.md` (root) for the full file map, state model, and design rules.

## Deploy

Express server at `server.js` serves `dist/` with SPA fallback. Elastic Beanstalk Node.js platform runs `npm start`.
