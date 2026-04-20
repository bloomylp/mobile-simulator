# LittlePay Traveller Wallet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-responsive React web app for the littlepay Traveller Wallet — digital card issuance, spend dashboard, top-up with card/Apple Pay/Google Pay, and public transport history with date filter.

**Architecture:** Vite + React SPA with React Router for client-side routing. All data is statically mocked in `src/data/`. No backend. Auth state lives in `sessionStorage`. Top-up is a bottom sheet component mounted in `HomePage`, not a route.

**Tech Stack:** Vite 5, React 18, React Router 6, Tailwind CSS 3, Lucide React (icons)

---

## File Map

```
littlepay-wallet/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                          # React root mount
│   ├── App.jsx                           # Router + auth guard
│   ├── index.css                         # Tailwind + CSS custom properties
│   ├── data/
│   │   ├── cards.js                      # Mocked cards array (3 cards)
│   │   └── transactions.js               # Mocked transactions array (20 items)
│   ├── utils/
│   │   ├── auth.js                       # sessionStorage helpers
│   │   ├── formatCard.js                 # Card number formatter (XXXX XXXX XXXX XXXX)
│   │   └── filterTransactions.js         # Date range filter pure function
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx             # Fixed 3-tab nav
│   │   │   └── PageShell.jsx             # max-w-sm centered wrapper
│   │   ├── ui/
│   │   │   ├── Button.jsx                # Reusable button (primary/secondary/ghost)
│   │   │   └── Badge.jsx                 # Pill badge (active/pending/frozen)
│   │   ├── card/
│   │   │   ├── CardChip.jsx              # Green credit card visual
│   │   │   └── CardActions.jsx           # Show Details toggle + Manage link
│   │   ├── transaction/
│   │   │   ├── DateRangeFilter.jsx       # From/To date inputs
│   │   │   ├── TransactionList.jsx       # Grouped by date, renders TransactionRow
│   │   │   └── TransactionRow.jsx        # Icon + operator + badge + amount
│   │   └── topup/
│   │       ├── TopUpSheet.jsx            # Slide-up bottom sheet container
│   │       ├── CardPaymentForm.jsx       # Card number / expiry / CVV / name
│   │       ├── ApplePayButton.jsx        # Black pill, Apple Pay SVG
│   │       └── GooglePayButton.jsx       # White pill, Google Pay SVG
│   └── pages/
│       ├── SplashPage.jsx                # Full green, transit SVG, "Proceed to Login"
│       ├── LoginPage.jsx                 # Email + password, mock auth
│       ├── CardsPage.jsx                 # Card list + Order New Card
│       ├── HomePage.jsx                  # Spend overview + transactions + top-up sheet
│       └── OrderCompletePage.jsx         # Success illustration + Continue
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `littlepay-wallet/package.json`
- Create: `littlepay-wallet/vite.config.js`
- Create: `littlepay-wallet/tailwind.config.js`
- Create: `littlepay-wallet/postcss.config.js`
- Create: `littlepay-wallet/index.html`
- Create: `littlepay-wallet/src/index.css`
- Create: `littlepay-wallet/src/main.jsx`

- [ ] **Step 1: Scaffold project**

```bash
cd /Users/a./Documents/AI_Projects/Issuance
npm create vite@latest littlepay-wallet -- --template react
cd littlepay-wallet
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom lucide-react
```

- [ ] **Step 2: Configure Tailwind**

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2DB87E',
          dark:    '#1A7A50',
          card:    '#4CC48A',
          light:   '#E8F7F0',
        },
        surface: '#FFFFFF',
        'gray-bg': '#F4F6F8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Write CSS custom properties + Tailwind base**

Replace `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --green-brand:   #2DB87E;
  --green-dark:    #1A7A50;
  --green-card:    #4CC48A;
  --green-light:   #E8F7F0;
  --gray-bg:       #F4F6F8;
  --text-primary:  #1A1F2E;
  --text-secondary:#6B7280;
  --red-error:     #DC2626;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--gray-bg);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Write main.jsx**

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Write index.html**

Replace `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2DB87E" />
    <title>Traveller Wallet — littlepay</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server running at `http://localhost:5173`. Browser shows default Vite + React page.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + Tailwind project"
```

---

## Task 2: Mocked Data

**Files:**
- Create: `src/data/cards.js`
- Create: `src/data/transactions.js`

- [ ] **Step 1: Write cards data**

```js
// src/data/cards.js
export const cards = [
  {
    id: 'card-001',
    name: 'John Smith',
    pan: '122*******31230',
    panFull: '1220 0000 0031 230',
    expiry: '10/27',
    status: 'active',
    balance: 0,
    spent: 550,
  },
  {
    id: 'card-002',
    name: 'John Smith',
    pan: '456*******78901',
    panFull: '4560 0000 0789 01',
    expiry: '03/28',
    status: 'pending',
    balance: 0,
    spent: 0,
  },
  {
    id: 'card-003',
    name: 'John Smith',
    pan: '789*******12345',
    panFull: '7890 0000 0123 45',
    expiry: '07/29',
    status: 'pending',
    balance: 0,
    spent: 0,
  },
]
```

- [ ] **Step 2: Write transactions data**

```js
// src/data/transactions.js
export const transactions = [
  { id: 't01', date: '2024-01-11T07:54:00', type: 'bus',   route: 'Bus 42',     operator: 'Bradford Bus',       status: 'complete', amount: -1.50, discounted: false },
  { id: 't02', date: '2024-01-11T09:12:00', type: 'metro', route: 'Yellow Line', operator: 'Tyne & Wear Metro',  status: 'complete', amount: -0.75, discounted: true  },
  { id: 't03', date: '2024-01-11T17:30:00', type: 'bus',   route: 'Bus 19',      operator: 'Bradford Bus',       status: 'complete', amount: -1.50, discounted: false },
  { id: 't04', date: '2024-01-10T08:05:00', type: 'rail',  route: 'Northern',    operator: 'Northern Rail',      status: 'complete', amount: -3.50, discounted: false },
  { id: 't05', date: '2024-01-10T18:22:00', type: 'metro', route: 'Green Line',  operator: 'Tyne & Wear Metro',  status: 'complete', amount: -0.75, discounted: true  },
  { id: 't06', date: '2024-01-09T07:45:00', type: 'bus',   route: 'Bus 67',      operator: 'First Leeds',        status: 'complete', amount: -2.00, discounted: false },
  { id: 't07', date: '2024-01-09T12:00:00', type: 'tram',  route: 'Blue Line',   operator: 'Metrolink',          status: 'complete', amount: -1.20, discounted: false },
  { id: 't08', date: '2024-01-09T19:10:00', type: 'bus',   route: 'Bus 42',      operator: 'Bradford Bus',       status: 'complete', amount: -1.50, discounted: false },
  { id: 't09', date: '2024-01-08T08:30:00', type: 'rail',  route: 'TransPennine', operator: 'TPE',               status: 'complete', amount: -3.50, discounted: false },
  { id: 't10', date: '2024-01-08T17:55:00', type: 'metro', route: 'Red Line',    operator: 'Tyne & Wear Metro',  status: 'complete', amount: -0.75, discounted: true  },
  { id: 't11', date: '2024-01-07T07:50:00', type: 'bus',   route: 'Bus 72',      operator: 'Arriva',             status: 'complete', amount: -2.00, discounted: false },
  { id: 't12', date: '2024-01-07T18:40:00', type: 'tram',  route: 'Purple Line', operator: 'Metrolink',          status: 'complete', amount: -1.20, discounted: false },
  { id: 't13', date: '2024-01-06T09:00:00', type: 'rail',  route: 'Northern',    operator: 'Northern Rail',      status: 'complete', amount: -3.50, discounted: false },
  { id: 't14', date: '2024-01-06T17:00:00', type: 'bus',   route: 'Bus 19',      operator: 'Bradford Bus',       status: 'complete', amount: -1.50, discounted: false },
  { id: 't15', date: '2024-01-05T08:15:00', type: 'metro', route: 'Yellow Line', operator: 'Tyne & Wear Metro',  status: 'complete', amount: -0.75, discounted: true  },
  { id: 't16', date: '2024-01-05T17:20:00', type: 'bus',   route: 'Bus 42',      operator: 'Bradford Bus',       status: 'complete', amount: -1.50, discounted: false },
  { id: 't17', date: '2024-01-04T07:35:00', type: 'tram',  route: 'Orange Line', operator: 'Metrolink',          status: 'complete', amount: -1.20, discounted: false },
  { id: 't18', date: '2024-01-04T18:00:00', type: 'rail',  route: 'Northern',    operator: 'Northern Rail',      status: 'complete', amount: -3.50, discounted: false },
  { id: 't19', date: '2024-01-03T08:00:00', type: 'bus',   route: 'Bus 67',      operator: 'First Leeds',        status: 'complete', amount: -2.00, discounted: false },
  { id: 't20', date: '2024-01-03T17:45:00', type: 'metro', route: 'Green Line',  operator: 'Tyne & Wear Metro',  status: 'complete', amount: -0.75, discounted: true  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add mocked cards and transactions data"
```

---

## Task 3: Utility Functions

**Files:**
- Create: `src/utils/auth.js`
- Create: `src/utils/formatCard.js`
- Create: `src/utils/filterTransactions.js`

- [ ] **Step 1: Write auth helpers**

```js
// src/utils/auth.js
const KEY = 'lp_authed'

export function login() {
  sessionStorage.setItem(KEY, '1')
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export function isAuthenticated() {
  return sessionStorage.getItem(KEY) === '1'
}
```

- [ ] **Step 2: Write card number formatter**

```js
// src/utils/formatCard.js
// Formats a raw digit string into "XXXX XXXX XXXX XXXX"
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

// Formats expiry input into "MM/YY"
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2)
  }
  return digits
}
```

- [ ] **Step 3: Write date range filter**

```js
// src/utils/filterTransactions.js
// Returns transactions between fromDate and toDate (inclusive).
// fromDate and toDate are ISO date strings "YYYY-MM-DD" or empty string.
export function filterTransactions(transactions, fromDate, toDate) {
  return transactions.filter((t) => {
    const txDate = t.date.slice(0, 10) // "YYYY-MM-DD"
    if (fromDate && txDate < fromDate) return false
    if (toDate   && txDate > toDate)   return false
    return true
  })
}

// Groups a sorted transactions array by date label ("11 Jan 2024")
export function groupByDate(transactions) {
  const groups = {}
  for (const t of transactions) {
    const label = new Date(t.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    if (!groups[label]) groups[label] = []
    groups[label].push(t)
  }
  return groups // { "11 Jan 2024": [...], "10 Jan 2024": [...] }
}
```

- [ ] **Step 4: Test filter logic manually in browser console (no test runner)**

Start dev server, open browser console:
```js
import('/src/utils/filterTransactions.js').then(m => {
  const txs = [
    { date: '2024-01-10T08:00:00', id: 'a' },
    { date: '2024-01-11T08:00:00', id: 'b' },
    { date: '2024-01-12T08:00:00', id: 'c' },
  ]
  console.assert(m.filterTransactions(txs, '2024-01-10', '2024-01-11').length === 2, 'range filter')
  console.assert(m.filterTransactions(txs, '', '2024-01-10').length === 1, 'to-only filter')
  console.assert(m.filterTransactions(txs, '2024-01-11', '').length === 2, 'from-only filter')
  console.log('All assertions passed')
})
```

Expected: "All assertions passed" with no assertion errors.

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add auth, card formatter, and transaction filter utils"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Badge.jsx`
- Create: `src/components/layout/PageShell.jsx`
- Create: `src/components/layout/BottomNav.jsx`

- [ ] **Step 1: Write Button component**

```jsx
// src/components/ui/Button.jsx
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3.5 text-base transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-[#2DB87E] hover:bg-[#1A7A50] text-white focus-visible:ring-[#2DB87E]',
    secondary: 'bg-white border border-[#2DB87E] text-[#2DB87E] hover:bg-[#E8F7F0] focus-visible:ring-[#2DB87E]',
    ghost:     'bg-transparent text-[#6B7280] hover:bg-gray-100 focus-visible:ring-gray-400',
    danger:    'bg-[#DC2626] hover:bg-red-700 text-white focus-visible:ring-red-500',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Write Badge component**

```jsx
// src/components/ui/Badge.jsx
export function Badge({ status }) {
  const styles = {
    active:  'bg-[#E8F7F0] text-[#1A7A50]',
    pending: 'bg-yellow-50 text-yellow-700',
    frozen:  'bg-blue-50 text-blue-700',
  }
  const labels = {
    active: 'Active',
    pending: 'Pending',
    frozen: 'Frozen',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status === 'active' && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill="#2DB87E" />
          <path d="M3.5 6l1.5 1.5L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {labels[status]}
    </span>
  )
}
```

- [ ] **Step 3: Write PageShell component**

```jsx
// src/components/layout/PageShell.jsx
export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex justify-center">
      <div className={`w-full max-w-sm flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write BottomNav component**

```jsx
// src/components/layout/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Home, User } from 'lucide-react'

const tabs = [
  { label: 'Cards', icon: CreditCard, path: '/cards' },
  { label: 'Home',  icon: Home,       path: '/home'  },
  { label: 'Profile', icon: User,     path: '/profile' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 z-40 safe-pb"
      aria-label="Main navigation"
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
              active ? 'text-[#2DB87E]' : 'text-[#6B7280]'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.75}
              fill={active ? '#E8F7F0' : 'none'}
              aria-hidden="true"
            />
            <span className={`text-xs font-medium ${active ? 'text-[#2DB87E]' : 'text-[#6B7280]'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add Button, Badge, PageShell, BottomNav shared components"
```

---

## Task 5: CardChip + CardActions

**Files:**
- Create: `src/components/card/CardChip.jsx`
- Create: `src/components/card/CardActions.jsx`

- [ ] **Step 1: Write CardChip**

```jsx
// src/components/card/CardChip.jsx
export function CardChip({ card }) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #4CC48A 0%, #2DB87E 60%, #1A7A50 100%)',
        minHeight: '160px',
      }}
      aria-label={`${card.status} card ending ${card.pan.slice(-5)}`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-6">
        <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
          Traveller Wallet
        </span>
        {/* littlepay logo wordmark */}
        <span className="text-white font-bold text-sm tracking-tight">
          little<span className="text-[#E8F7F0]">pay</span>
        </span>
      </div>

      {/* Cardholder name */}
      <div className="relative mb-3">
        <p className="text-white font-semibold text-lg leading-tight">{card.name}</p>
      </div>

      {/* PAN + Expiry row */}
      <div className="relative flex items-end justify-between">
        <p className="text-white/90 font-mono text-sm tracking-widest">{card.pan}</p>
        <p className="text-white/80 text-xs font-medium">{card.expiry}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write CardActions**

```jsx
// src/components/card/CardActions.jsx
import { useState } from 'react'
import { Eye, EyeOff, Settings } from 'lucide-react'

export function CardActions({ card, onShowDetails }) {
  const [revealed, setRevealed] = useState(false)

  function handleToggle() {
    setRevealed((prev) => !prev)
    onShowDetails?.(!revealed)
  }

  return (
    <div className="flex items-center justify-between px-1 py-2">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-[#2DB87E] text-sm font-medium cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded"
        aria-label={revealed ? 'Hide card details' : 'Show card details'}
      >
        {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        {revealed ? 'Hide Details' : 'Show Details'}
      </button>

      {revealed && (
        <p className="text-[#1A1F2E] font-mono text-xs tracking-widest">{card.panFull}</p>
      )}

      <button
        className="flex items-center gap-1.5 text-[#6B7280] text-sm font-medium cursor-pointer hover:text-[#1A1F2E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
        aria-label="Manage card"
      >
        Manage <Settings size={13} />
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/card/
git commit -m "feat: add CardChip and CardActions components"
```

---

## Task 6: Splash Page

**Files:**
- Create: `src/pages/SplashPage.jsx`

- [ ] **Step 1: Write SplashPage**

```jsx
// src/pages/SplashPage.jsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'

// Inline SVG transit scene — subway passengers
function TransitIllustration() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs" aria-hidden="true">
      {/* Train floor */}
      <rect x="20" y="150" width="280" height="10" rx="2" fill="#1A7A50" opacity="0.5" />
      {/* Handrail */}
      <rect x="40" y="60" width="240" height="4" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole left */}
      <rect x="80" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole center */}
      <rect x="158" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole right */}
      <rect x="236" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />

      {/* Person 1 — seated left */}
      <ellipse cx="70" cy="148" rx="20" ry="5" fill="#1A7A50" opacity="0.3" />
      <rect x="52" y="108" width="36" height="40" rx="6" fill="#1DB87E" opacity="0.7" />
      <circle cx="70" cy="98" r="12" fill="#E8F7F0" opacity="0.9" />
      <rect x="62" y="110" width="16" height="3" rx="1.5" fill="#1A7A50" opacity="0.4" />

      {/* Person 2 — standing center */}
      <rect x="140" y="80" width="40" height="70" rx="6" fill="#E8F7F0" opacity="0.7" />
      <circle cx="160" cy="68" r="14" fill="#E8F7F0" opacity="0.9" />
      {/* Raised arm to handrail */}
      <rect x="158" y="62" width="6" height="20" rx="3" fill="#E8F7F0" opacity="0.8" />

      {/* Person 3 — seated right */}
      <ellipse cx="250" cy="148" rx="20" ry="5" fill="#1A7A50" opacity="0.3" />
      <rect x="232" y="108" width="36" height="40" rx="6" fill="#1DB87E" opacity="0.7" />
      <circle cx="250" cy="98" r="12" fill="#E8F7F0" opacity="0.9" />
      {/* Phone in hand */}
      <rect x="255" y="115" width="10" height="16" rx="2" fill="#1A7A50" opacity="0.5" />

      {/* Window frames */}
      <rect x="30" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
      <rect x="130" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
      <rect x="230" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
    </svg>
  )
}

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-between px-6 py-12"
      style={{ background: 'linear-gradient(180deg, #2DB87E 0%, #1A7A50 100%)' }}
    >
      {/* Top — logo + tagline */}
      <div className="flex flex-col items-center gap-3 mt-8">
        {/* App icon */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
          <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden="true">
            <rect x="4" y="10" width="32" height="22" rx="4" fill="white" opacity="0.9" />
            <rect x="4" y="16" width="32" height="5" fill="#2DB87E" />
            <rect x="8" y="24" width="10" height="3" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold text-center">Welcome to<br />Traveller Wallet</h1>
        <p className="text-white/70 text-sm text-center">
          Powered by <span className="text-white font-semibold">little<span className="text-[#E8F7F0]">pay</span></span>
        </p>
      </div>

      {/* Middle — illustration */}
      <TransitIllustration />

      {/* Bottom — CTAs */}
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full bg-white text-[#1A7A50] border-0 hover:bg-white/90"
          onClick={() => navigate('/login')}
        >
          Proceed to Login
        </Button>
        <button className="text-white/70 text-sm text-center underline underline-offset-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
          Privacy and Policy
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SplashPage.jsx
git commit -m "feat: add SplashPage with transit illustration"
```

---

## Task 7: Login Page + App Router

**Files:**
- Create: `src/pages/LoginPage.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Write LoginPage**

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'
import { login } from '../utils/auth.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    // Mock 800ms auth delay
    setTimeout(() => {
      login()
      navigate('/home')
    }, 800)
  }

  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F2E]">
            little<span className="text-[#2DB87E]">pay</span>
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Sign in to your Traveller Wallet</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#1A1F2E]">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-gray-200 rounded-xl px-4 py-3 text-[#1A1F2E] text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow duration-150"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#1A1F2E]">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-200 rounded-xl px-4 py-3 text-[#1A1F2E] text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow duration-150"
            />
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="text-[#DC2626] text-xs font-medium">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write App.jsx with router + auth guard**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { SplashPage }        from './pages/SplashPage.jsx'
import { LoginPage }         from './pages/LoginPage.jsx'
import { CardsPage }         from './pages/CardsPage.jsx'
import { HomePage }          from './pages/HomePage.jsx'
import { OrderCompletePage } from './pages/OrderCompletePage.jsx'

function ProfilePage() {
  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center">
      <p className="text-[#6B7280] text-sm">Profile — coming soon</p>
    </div>
  )
}

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<SplashPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/cards"          element={<RequireAuth><CardsPage /></RequireAuth>} />
        <Route path="/home"           element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/order-complete" element={<RequireAuth><OrderCompletePage /></RequireAuth>} />
        <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Verify login flow in browser**

```bash
npm run dev
```

1. Open `http://localhost:5173` — should show green splash
2. Click "Proceed to Login" — should navigate to `/login`
3. Submit any email + password — should navigate to `/home` (which 404s for now, that's fine)
4. Navigate directly to `/cards` while unauthenticated — should redirect to `/login`

- [ ] **Step 4: Commit**

```bash
git add src/pages/LoginPage.jsx src/App.jsx
git commit -m "feat: add login page and router with auth guard"
```

---

## Task 8: Cards Page

**Files:**
- Create: `src/pages/CardsPage.jsx`
- Create: `src/pages/OrderCompletePage.jsx`

- [ ] **Step 1: Write CardsPage**

```jsx
// src/pages/CardsPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { PageShell }   from '../components/layout/PageShell.jsx'
import { BottomNav }   from '../components/layout/BottomNav.jsx'
import { CardChip }    from '../components/card/CardChip.jsx'
import { CardActions } from '../components/card/CardActions.jsx'
import { Badge }       from '../components/ui/Badge.jsx'
import { cards }       from '../data/cards.js'

export function CardsPage() {
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)

  function handleOrderNew() {
    setOrdering(true)
    setTimeout(() => {
      setOrdering(false)
      navigate('/order-complete')
    }, 1500)
  }

  return (
    <PageShell className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-[#1A1F2E] text-lg font-bold">Your Cards ({cards.length})</h1>
        <button
          className="text-[#2DB87E] text-sm font-semibold cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded"
          aria-label="Add new card"
        >
          + Add New
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-4 px-5">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <Badge status={card.status} />
            </div>
            <CardChip card={card} />
            <CardActions card={card} />
          </div>
        ))}

        {/* Order New Card row */}
        <button
          onClick={handleOrderNew}
          disabled={ordering}
          className="flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 py-4 text-[#6B7280] text-sm font-medium cursor-pointer hover:border-[#2DB87E] hover:text-[#2DB87E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] disabled:opacity-60"
          aria-label="Order a new card"
        >
          {ordering
            ? <Loader2 size={16} className="animate-spin text-[#2DB87E]" />
            : <Plus size={16} />}
          {ordering ? 'Ordering…' : 'Order New Card'}
        </button>
      </div>

      <BottomNav />
    </PageShell>
  )
}
```

- [ ] **Step 2: Write OrderCompletePage**

```jsx
// src/pages/OrderCompletePage.jsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'

function CardSuccessIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto mx-auto" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="132" rx="55" ry="6" fill="#1A1F2E" opacity="0.08" />

      {/* Card back (tilted) */}
      <g transform="rotate(-8, 100, 80)">
        <rect x="30" y="50" width="110" height="68" rx="8" fill="#4CC48A" />
        <rect x="30" y="66" width="110" height="14" fill="#2DB87E" />
        <rect x="38" y="88" width="40" height="6" rx="3" fill="white" opacity="0.4" />
      </g>

      {/* Card front */}
      <rect x="58" y="30" width="110" height="70" rx="8" fill="url(#cardGrad)" />
      <rect x="58" y="48" width="110" height="14" fill="#1A7A50" opacity="0.6" />
      <rect x="66" y="70" width="50" height="5" rx="2.5" fill="white" opacity="0.5" />
      <rect x="66" y="82" width="30" height="5" rx="2.5" fill="white" opacity="0.4" />
      {/* Chip */}
      <rect x="66" y="38" width="18" height="13" rx="2" fill="#E8F7F0" opacity="0.7" />

      {/* Coins */}
      <ellipse cx="42" cy="116" rx="12" ry="6" fill="#2DB87E" opacity="0.5" />
      <ellipse cx="42" cy="113" rx="12" ry="6" fill="#4CC48A" />
      <ellipse cx="164" cy="120" rx="10" ry="5" fill="#2DB87E" opacity="0.5" />
      <ellipse cx="164" cy="117" rx="10" ry="5" fill="#4CC48A" />

      <defs>
        <linearGradient id="cardGrad" x1="58" y1="30" x2="168" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CC48A" />
          <stop offset="1" stopColor="#1A7A50" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function OrderCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center px-6">
      {/* Country selector (top right) */}
      <div className="absolute top-4 right-4">
        <select className="text-sm text-[#1A1F2E] bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2DB87E]" aria-label="Country">
          <option>US</option>
          <option>GB</option>
          <option>AU</option>
        </select>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-6">
        {/* Brand */}
        <p className="text-[#1A1F2E] text-lg font-bold">
          little<span className="text-[#2DB87E]">pay</span>
        </p>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-[#1A1F2E] text-xl font-bold mb-1">Order Completed</h1>
          <p className="text-[#6B7280] text-sm">You will receive your card shortly</p>
        </div>

        <CardSuccessIllustration />

        <Button className="w-full" onClick={() => navigate('/cards')}>
          Continue
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

1. Navigate to `/cards` — card list shows 3 cards with green CardChip visuals
2. Click "Order New Card" — shows spinner for 1.5s, then navigates to `/order-complete`
3. Click "Continue" on order complete — returns to `/cards`

- [ ] **Step 4: Commit**

```bash
git add src/pages/CardsPage.jsx src/pages/OrderCompletePage.jsx
git commit -m "feat: add CardsPage with card list and OrderCompletePage"
```

---

## Task 9: Transaction Components

**Files:**
- Create: `src/components/transaction/DateRangeFilter.jsx`
- Create: `src/components/transaction/TransactionRow.jsx`
- Create: `src/components/transaction/TransactionList.jsx`

- [ ] **Step 1: Write DateRangeFilter**

```jsx
// src/components/transaction/DateRangeFilter.jsx
export function DateRangeFilter({ fromDate, toDate, onChange }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-gray-100">
      <div className="flex flex-col gap-0.5 flex-1">
        <label htmlFor="from-date" className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">From</label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(e) => onChange({ fromDate: e.target.value, toDate })}
          className="text-sm text-[#1A1F2E] border-0 p-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
        />
      </div>
      <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
      <div className="flex flex-col gap-0.5 flex-1">
        <label htmlFor="to-date" className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">To</label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) => onChange({ fromDate, toDate: e.target.value })}
          className="text-sm text-[#1A1F2E] border-0 p-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
        />
      </div>
      {(fromDate || toDate) && (
        <button
          onClick={() => onChange({ fromDate: '', toDate: '' })}
          className="text-xs text-[#6B7280] hover:text-[#1A1F2E] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded px-1"
          aria-label="Clear date filter"
        >
          Clear
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write TransactionRow**

```jsx
// src/components/transaction/TransactionRow.jsx
import { Bus, Train, Tram, Zap } from 'lucide-react'

const TYPE_ICON = {
  bus:   Bus,
  metro: Zap,
  rail:  Train,
  tram:  Tram,
}

const TYPE_LABEL = {
  bus: 'Bus', metro: 'Metro', rail: 'Rail', tram: 'Tram',
}

export function TransactionRow({ transaction: t }) {
  const Icon = TYPE_ICON[t.type] ?? Bus
  const time = new Date(t.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const amount = `−£${Math.abs(t.amount).toFixed(2)}`

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <Icon size={16} className="text-[#2DB87E]" strokeWidth={2} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[#1A1F2E] text-sm font-medium truncate">{t.operator}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[#6B7280] text-xs">{time} · {TYPE_LABEL[t.type]}</span>
          {t.discounted && (
            <span className="text-[10px] font-semibold text-[#1A7A50] bg-[#E8F7F0] px-1.5 py-0.5 rounded-full">Discounted</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="text-right flex-shrink-0">
        <p className="text-[#1A1F2E] text-sm font-semibold tabular-nums">{amount}</p>
        <span className="text-[10px] font-medium text-[#2DB87E] bg-[#E8F7F0] px-1.5 py-0.5 rounded-full">
          Complete Trip
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write TransactionList**

```jsx
// src/components/transaction/TransactionList.jsx
import { groupByDate } from '../../utils/filterTransactions.js'
import { TransactionRow } from './TransactionRow.jsx'

export function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
        <p className="text-[#6B7280] text-sm font-medium">No transactions found</p>
        <p className="text-[#6B7280] text-xs mt-1">Try adjusting the date range</p>
      </div>
    )
  }

  const grouped = groupByDate(transactions)

  return (
    <div>
      {Object.entries(grouped).map(([dateLabel, txs]) => (
        <section key={dateLabel}>
          <h2 className="px-5 py-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F4F6F8] border-b border-gray-100">
            {dateLabel}
          </h2>
          {txs.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/transaction/
git commit -m "feat: add DateRangeFilter, TransactionRow, TransactionList components"
```

---

## Task 10: Top-Up Bottom Sheet

**Files:**
- Create: `src/components/topup/TopUpSheet.jsx`
- Create: `src/components/topup/CardPaymentForm.jsx`
- Create: `src/components/topup/ApplePayButton.jsx`
- Create: `src/components/topup/GooglePayButton.jsx`

- [ ] **Step 1: Write ApplePayButton**

```jsx
// src/components/topup/ApplePayButton.jsx
export function ApplePayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3.5 rounded-xl cursor-pointer hover:bg-gray-900 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
      aria-label="Pay with Apple Pay"
    >
      {/* Apple Pay logo */}
      <svg viewBox="0 0 60 26" fill="white" className="h-5" aria-hidden="true">
        <path d="M11.05 3.42c-.7.84-1.83 1.5-2.96 1.4-.14-1.13.41-2.33 1.05-3.07C9.84.9 11.07.28 12.06.22c.12 1.16-.34 2.3-1.01 3.2zm1 1.59c-1.64-.1-3.04.93-3.82.93-.8 0-2-.88-3.3-.86C3.18 5.1 1.4 6.05.56 7.6-1.16 10.72.1 15.4 1.76 17.96c.82 1.2 1.8 2.52 3.1 2.48 1.24-.05 1.72-.8 3.2-.8 1.5 0 1.93.8 3.22.77 1.34-.02 2.18-1.2 3-2.4.94-1.36 1.32-2.68 1.34-2.75-.03-.02-2.57-1-2.6-3.96-.02-2.48 2.02-3.66 2.12-3.73-.82-1.22-2.1-1.56-2.59-1.56zM21.16 1.68v18.6h2.88v-6.36h3.99c3.66 0 6.23-2.52 6.23-6.14s-2.53-6.1-6.15-6.1h-6.95zm2.88 2.46h3.32c2.51 0 3.94 1.34 3.94 3.66s-1.43 3.68-3.96 3.68h-3.3V4.14zm16.07 16.27c1.82 0 3.5-.92 4.27-2.38h.06v2.23h2.67V10.9c0-2.68-2.14-4.41-5.44-4.41-3.06 0-5.33 1.76-5.41 4.17h2.6c.22-1.15 1.28-1.9 2.73-1.9 1.76 0 2.75.82 2.75 2.33v1.02l-3.6.22c-3.35.2-5.16 1.57-5.16 3.94 0 2.4 1.86 3.98 4.53 3.98zm.77-2.2c-1.53 0-2.51-.74-2.51-1.88 0-1.17.94-1.85 2.74-1.95l3.2-.2v1.04c0 1.75-1.48 2.99-3.43 2.99zm11.13 7.13c2.8 0 4.12-1.07 5.27-4.32l5.05-14.16h-2.93l-3.38 10.93h-.06L52.6 6.86h-3l4.88 13.52-.26.82c-.44 1.4-1.15 1.93-2.43 1.93-.22 0-.66-.02-.84-.05v2.22c.18.06.94.09 1.16.09z"/>
      </svg>
    </button>
  )
}
```

- [ ] **Step 2: Write GooglePayButton**

```jsx
// src/components/topup/GooglePayButton.jsx
export function GooglePayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-white text-[#1A1F2E] font-semibold py-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2DB87E]"
      aria-label="Pay with Google Pay"
    >
      {/* Google Pay logo */}
      <svg viewBox="0 0 80 34" className="h-5" aria-hidden="true">
        <path d="M38.4 16.4v9.7h-3.1V3h8.2c2 0 3.7.7 5.1 2s2 2.9 2 4.8c0 1.9-.7 3.5-2 4.8-1.4 1.3-3.1 1.9-5.1 1.9l-5.1-.1zm0-10.5v7.7h5.2c1.2 0 2.2-.4 3-1.2.8-.8 1.2-1.8 1.2-3 0-1.1-.4-2.1-1.2-2.9-.8-.8-1.8-1.2-3-1.2l-5.2.6zm19.3 3.8c2.2 0 3.9.6 5.2 1.7 1.3 1.1 1.9 2.7 1.9 4.7v9.4h-2.9v-2.1h-.1c-1.2 1.7-2.8 2.6-4.8 2.6-1.7 0-3.1-.5-4.3-1.5-1.2-1-1.7-2.3-1.7-3.8 0-1.6.6-2.9 1.8-3.8 1.2-.9 2.8-1.4 4.9-1.4 1.7 0 3.2.3 4.2.9v-.7c0-1-.4-1.9-1.2-2.6-.8-.7-1.7-1-2.8-1-1.6 0-2.9.7-3.8 2l-2.7-1.7c1.5-2.1 3.6-3.2 6.3-3.2zm-3.8 11.5c0 .8.3 1.4 1 1.9.7.5 1.4.7 2.3.7 1.2 0 2.3-.5 3.3-1.4 1-.9 1.4-2 1.4-3.2-.9-.7-2.1-1.1-3.7-1.1-1.1 0-2.1.3-2.8.8-.9.5-1.5 1.3-1.5 2.3zm18-10.9L66.8 26h-3.2L59 10.3h3.3l3.3 9.5 3.7-9.5h3l3.7 9.5 3.3-9.5H79l-5.6 15.7H70l-4.1-9.7z" fill="#3C4043"/>
        <path d="M10.9 13.5v3.2H18c-.2 1.6-.8 2.8-1.7 3.7-1.1 1.1-2.7 2.2-5.4 2.2-4.3 0-7.6-3.5-7.6-7.8s3.3-7.8 7.6-7.8c2.3 0 4 .9 5.2 2.1l2.3-2.3C16.6 5.2 14.2 4 10.9 4 5 4 0 8.8 0 14.8s5 10.8 10.9 10.8c3.2 0 5.6-1 7.5-3 1.9-1.9 2.5-4.6 2.5-6.8 0-.7-.1-1.3-.2-1.8l-9.8.5z" fill="#4285F4"/>
      </svg>
    </button>
  )
}
```

- [ ] **Step 3: Write CardPaymentForm**

```jsx
// src/components/topup/CardPaymentForm.jsx
import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { formatCardNumber, formatExpiry } from '../../utils/formatCard.js'

export function CardPaymentForm({ amount, onSuccess }) {
  const [fields, setFields] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    const digits = fields.cardNumber.replace(/\s/g, '')
    if (digits.length < 13) errs.cardNumber = 'Enter a valid card number'
    if (!/^\d{2}\/\d{2}$/.test(fields.expiry)) errs.expiry = 'Enter expiry as MM/YY'
    if (fields.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV'
    if (!fields.name.trim()) errs.name = 'Enter cardholder name'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Card number */}
      <div className="flex flex-col gap-1">
        <label htmlFor="card-number" className="text-sm font-medium text-[#1A1F2E]">Card Number</label>
        <input
          id="card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          value={fields.cardNumber}
          onChange={(e) => update('cardNumber', formatCardNumber(e.target.value))}
          className={`border rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.cardNumber ? 'border-[#DC2626]' : 'border-gray-200'}`}
        />
        {errors.cardNumber && <p className="text-[#DC2626] text-xs" role="alert">{errors.cardNumber}</p>}
      </div>

      {/* Expiry + CVV */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="expiry" className="text-sm font-medium text-[#1A1F2E]">Expiry</label>
          <input
            id="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={fields.expiry}
            onChange={(e) => update('expiry', formatExpiry(e.target.value))}
            className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.expiry ? 'border-[#DC2626]' : 'border-gray-200'}`}
          />
          {errors.expiry && <p className="text-[#DC2626] text-xs" role="alert">{errors.expiry}</p>}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="cvv" className="text-sm font-medium text-[#1A1F2E]">CVV</label>
          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={fields.cvv}
            onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.cvv ? 'border-[#DC2626]' : 'border-gray-200'}`}
          />
          {errors.cvv && <p className="text-[#DC2626] text-xs" role="alert">{errors.cvv}</p>}
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="card-name" className="text-sm font-medium text-[#1A1F2E]">Name on Card</label>
        <input
          id="card-name"
          type="text"
          autoComplete="cc-name"
          placeholder="John Smith"
          value={fields.name}
          onChange={(e) => update('name', e.target.value)}
          className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.name ? 'border-[#DC2626]' : 'border-gray-200'}`}
        />
        {errors.name && <p className="text-[#DC2626] text-xs" role="alert">{errors.name}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing…' : `Pay £${amount.toFixed(2)}`}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Write TopUpSheet**

```jsx
// src/components/topup/TopUpSheet.jsx
import { useState, useEffect } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { CardPaymentForm } from './CardPaymentForm.jsx'
import { ApplePayButton }  from './ApplePayButton.jsx'
import { GooglePayButton } from './GooglePayButton.jsx'

const PRESET_AMOUNTS = [10, 20, 50, 100]

export function TopUpSheet({ onClose }) {
  const [amount, setAmount] = useState(20)
  const [customAmount, setCustomAmount] = useState('')
  const [tab, setTab] = useState('card') // 'card' | 'apple' | 'google'
  const [success, setSuccess] = useState(false)

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSuccess() {
    setSuccess(true)
    setTimeout(onClose, 2000)
  }

  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : amount

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Top up your card"
      >
        <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl max-h-[90dvh] overflow-y-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" aria-hidden="true" />
          </div>

          <div className="px-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between py-4">
              <h2 className="text-[#1A1F2E] text-lg font-bold">Top Up</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]" aria-label="Close">
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <CheckCircle2 size={56} className="text-[#2DB87E]" strokeWidth={1.5} />
                <p className="text-[#1A1F2E] font-bold text-lg">Balance Updated!</p>
                <p className="text-[#6B7280] text-sm">£{displayAmount.toFixed(2)} added to your card</p>
              </div>
            ) : (
              <>
                {/* Amount presets */}
                <div className="mb-5">
                  <p className="text-sm font-medium text-[#1A1F2E] mb-3">Select amount</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {PRESET_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustomAmount('') }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
                          amount === a && !customAmount
                            ? 'bg-[#2DB87E] text-white border-[#2DB87E]'
                            : 'bg-white text-[#1A1F2E] border-gray-200 hover:border-[#2DB87E]'
                        }`}
                        aria-pressed={amount === a && !customAmount}
                      >
                        £{a}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#2DB87E]">
                    <span className="text-[#6B7280] text-sm mr-2">£</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }}
                      className="flex-1 text-sm text-[#1A1F2E] focus:outline-none bg-transparent"
                      aria-label="Custom top-up amount"
                    />
                  </div>
                </div>

                {/* Payment method tabs */}
                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'card',   label: 'Card' },
                    { id: 'apple',  label: 'Apple Pay' },
                    { id: 'google', label: 'Google Pay' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
                        tab === id
                          ? 'bg-[#E8F7F0] text-[#1A7A50] border-[#2DB87E]'
                          : 'bg-white text-[#6B7280] border-gray-200 hover:border-[#2DB87E]'
                      }`}
                      aria-pressed={tab === id}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Payment content */}
                {tab === 'card' && (
                  <CardPaymentForm amount={displayAmount} onSuccess={handleSuccess} />
                )}
                {tab === 'apple' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[#6B7280] text-sm text-center">
                      Confirm £{displayAmount.toFixed(2)} top-up with Apple Pay
                    </p>
                    <ApplePayButton onClick={handleSuccess} />
                  </div>
                )}
                {tab === 'google' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[#6B7280] text-sm text-center">
                      Confirm £{displayAmount.toFixed(2)} top-up with Google Pay
                    </p>
                    <GooglePayButton onClick={handleSuccess} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/topup/
git commit -m "feat: add TopUpSheet with card payment, Apple Pay, and Google Pay"
```

---

## Task 11: Home Page

**Files:**
- Create: `src/pages/HomePage.jsx`

- [ ] **Step 1: Write HomePage**

```jsx
// src/pages/HomePage.jsx
import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { PageShell }         from '../components/layout/PageShell.jsx'
import { BottomNav }         from '../components/layout/BottomNav.jsx'
import { DateRangeFilter }   from '../components/transaction/DateRangeFilter.jsx'
import { TransactionList }   from '../components/transaction/TransactionList.jsx'
import { TopUpSheet }        from '../components/topup/TopUpSheet.jsx'
import { Button }            from '../components/ui/Button.jsx'
import { cards }             from '../data/cards.js'
import { transactions }      from '../data/transactions.js'
import { filterTransactions } from '../utils/filterTransactions.js'

const activeCard = cards.find((c) => c.status === 'active') ?? cards[0]

export function HomePage() {
  const [showTopUp, setShowTopUp] = useState(false)
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })

  const filtered = filterTransactions(transactions, dateRange.fromDate, dateRange.toDate)

  return (
    <PageShell className="pb-20">
      {/* Welcome header */}
      <div
        className="px-5 pt-10 pb-8"
        style={{ background: 'linear-gradient(160deg, #2DB87E 0%, #1A7A50 100%)' }}
      >
        <p className="text-white/80 text-sm font-medium mb-1">Welcome to Traveller Wallet</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-medium mb-0.5">Active · little<span className="text-[#E8F7F0]">pay</span></p>
            <h1 className="text-white text-2xl font-bold">{activeCard.name}</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet size={22} className="text-white" />
          </div>
        </div>

        {/* Spend summary */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Total Spent</p>
            <p className="text-white text-3xl font-bold mt-0.5">
              £{activeCard.spent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Balance</p>
            <p className="text-white text-xl font-bold mt-0.5">
              £{activeCard.balance.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-5 w-full bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm"
          onClick={() => setShowTopUp(true)}
        >
          Load Money
        </Button>
      </div>

      {/* Transactions section */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[#1A1F2E] text-base font-bold">Transactions</h2>
          <span className="text-[#6B7280] text-xs">{filtered.length} trips</span>
        </div>

        <DateRangeFilter
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
          onChange={setDateRange}
        />

        <TransactionList transactions={filtered} />
      </div>

      {/* Top-up bottom sheet */}
      {showTopUp && <TopUpSheet onClose={() => setShowTopUp(false)} />}

      <BottomNav />
    </PageShell>
  )
}
```

- [ ] **Step 2: Verify full app flow in browser**

```bash
npm run dev
```

Test each flow:
1. Splash → Login (any creds) → Home ✓
2. Home: "Load Money" opens top-up sheet ✓
3. Top-up: preset amounts update payment button label ✓
4. Top-up → Card tab: fill form, submit → success checkmark → sheet closes ✓
5. Top-up → Apple Pay tab: click button → success ✓
6. Top-up → Google Pay tab: click button → success ✓
7. Date filter: set From/To, transaction list filters ✓
8. Date filter: clear button resets list ✓
9. Bottom nav → Cards: card list shows ✓
10. Cards → "Order New Card" → spinner → Order Complete ✓
11. Order Complete → Continue → Cards ✓

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomePage.jsx
git commit -m "feat: add HomePage with spend overview, transactions, and top-up sheet"
```

---

## Task 12: Responsive Polish + Desktop Shell

**Files:**
- Modify: `src/index.css` (desktop shell styles)
- Modify: `src/components/layout/PageShell.jsx` (desktop frame)

- [ ] **Step 1: Add desktop phone shell to PageShell**

Replace `src/components/layout/PageShell.jsx`:

```jsx
// src/components/layout/PageShell.jsx
export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-dvh bg-gray-100 flex justify-center items-start lg:items-center lg:py-8">
      {/* Phone shell on desktop */}
      <div className="w-full max-w-sm min-h-dvh lg:min-h-0 lg:h-[812px] lg:rounded-[40px] lg:overflow-hidden lg:shadow-2xl bg-[#F4F6F8] flex flex-col relative">
        {/* Notch (desktop only) */}
        <div className="hidden lg:flex justify-center pt-3 pb-1 absolute top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="w-24 h-5 bg-gray-900 rounded-full" aria-hidden="true" />
        </div>
        <div className={`flex flex-col flex-1 lg:pt-5 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify responsive at all breakpoints**

Open browser DevTools:
- 375px (iPhone SE) — single column, no horizontal scroll ✓
- 768px (iPad) — centered max-w-sm container ✓
- 1440px (Desktop) — phone shell visible, centered on gray bg ✓

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/PageShell.jsx
git commit -m "feat: add desktop phone shell responsive wrapper"
```

---

## Task 13: Build + Final Check

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. `dist/` folder created.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Repeat Task 11 Step 2 checks on the production build.

- [ ] **Step 3: Final pre-delivery checklist**

- [ ] No emojis used as icons (Lucide SVG only)
- [ ] All interactive elements have `cursor-pointer`
- [ ] All inputs have visible `<label>` elements
- [ ] Form errors show below field, after blur/submit
- [ ] Touch targets ≥ 44px (check bottom nav buttons, transaction rows)
- [ ] Contrast ≥ 4.5:1 on all text (white on green, dark on white)
- [ ] `prefers-reduced-motion` disables all transitions (set in `index.css`)
- [ ] Bottom nav does not cover content (PageShell has `pb-20`)
- [ ] Date filter "Clear" button appears only when filter is active
- [ ] Top-up sheet locks body scroll when open

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete littlepay Traveller Wallet web app"
```
