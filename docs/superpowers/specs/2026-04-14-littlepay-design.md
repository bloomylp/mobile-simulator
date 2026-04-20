# LittlePay Traveller Wallet — Design Spec

**Date:** 2026-04-14
**Stack:** Vite + React + Tailwind CSS
**Data:** Static mocked (no backend)
**Brand:** littlepay

---

## 1. Visual Identity

### Colors
```css
--green-brand:    #2DB87E   /* logo "pay", CTAs, Active badge */
--green-dark:     #1A7A50   /* splash bg, button hover/pressed */
--green-card:     #4CC48A   /* card surface */
--green-light:    #E8F7F0   /* badge backgrounds */
--gray-bg:        #F4F6F8   /* app background */
--gray-surface:   #FFFFFF   /* panels and cards */
--text-primary:   #1A1F2E   /* headings */
--text-secondary: #6B7280   /* labels, metadata */
--red-error:      #DC2626   /* errors */
```

### Typography
- Font: **Inter** (Google Fonts)
- Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48px
- Weights: 400 body, 500 label, 600 heading, 700 display

### Motion
- Micro-interactions: 150–200ms ease-out
- Bottom sheet: slide-up 250ms ease-out
- Order success: scale+fade entrance 300ms

### Radius & Elevation
- Cards/panels: `rounded-2xl` + `shadow-sm`
- Buttons: `rounded-xl`
- Badges/pills: `rounded-full`
- Bottom sheet: `rounded-t-3xl`

---

## 2. Page Structure & Routing

```
/                 → Splash
/login            → Login
/cards            → Cards list
/home             → Dashboard (default post-login)
/order-complete   → Order success
```

Top-up is a **bottom sheet** mounted over `/home`, not a route.

### Auth
- Mock: any email + password accepted
- Session flag in `sessionStorage`
- Protected routes redirect unauthenticated users to `/login`

### Responsive
- `375px` — single column, bottom nav
- `768px` — `max-w-sm` centered container
- `1024px+` — phone shell centered on white desktop bg

---

## 3. Components

### Shared
| Component | Purpose |
|-----------|---------|
| `BottomNav` | Fixed 3-tab nav (Cards, Home, Profile). Active tab = green filled icon + label |
| `CardChip` | Green credit card visual. Shows: name, masked PAN, expiry, Active badge, littlepay logo |
| `PageShell` | White bg wrapper, `max-w-sm`, safe padding top/bottom for nav |

### Splash (`/`)
| Component | Purpose |
|-----------|---------|
| `SplashScreen` | Full green bg, transit SVG illustration, brand logo, "Proceed to Login" + "Privacy and Policy" |

### Login (`/login`)
| Component | Purpose |
|-----------|---------|
| `LoginForm` | Email + password inputs, "Sign In" submit. Mock: any creds → `sessionStorage` flag → navigate `/home` |

### Cards (`/cards`)
| Component | Purpose |
|-----------|---------|
| `CardList` | Maps cards array → `CardChip` per card |
| `CardActions` | "Show Details" toggle (reveal full PAN), "Manage" (no-op for now) |
| `OrderNewCard` | `+` row at bottom. One-click: loading spinner 1.5s → navigate `/order-complete` |

### Home (`/home`)
| Component | Purpose |
|-----------|---------|
| `SpendOverview` | Total spent + balance display, "Load Money" CTA |
| `DateRangeFilter` | From/To date inputs. Filters `TransactionList` on change |
| `TransactionList` | Grouped by date header. Renders `TransactionRow` per item |
| `TransactionRow` | Icon (bus/metro/rail) + operator + route + "Complete Trip" badge + amount |

### Top-Up Sheet (overlay on `/home`)
| Component | Purpose |
|-----------|---------|
| `TopUpSheet` | Slide-up bottom sheet. Amount input (£ prefix). Payment method tabs |
| `CardPaymentForm` | Card number (auto-format XXXX XXXX XXXX XXXX), expiry (MM/YY), CVV, name |
| `ApplePayButton` | Black pill, Apple Pay SVG logo. Mock tap → success state |
| `GooglePayButton` | White pill with border, Google Pay SVG logo. Mock tap → success state |
| `TopUpSuccess` | Animated green checkmark. "Balance updated" message. Auto-closes sheet after 2s |

### Order Complete (`/order-complete`)
| Component | Purpose |
|-----------|---------|
| `OrderSuccess` | Isometric card SVG illustration, "Order Completed" heading, "You will receive your card shortly", "Continue" → `/cards` |

---

## 4. Data Model

```typescript
interface Card {
  id: string
  name: string        // "John Smith"
  pan: string         // "122*******31230"  (masked)
  panFull: string     // "1220000031230"    (revealed)
  expiry: string      // "10/27"
  status: "active" | "frozen" | "pending"
  balance: number
  spent: number
}

interface Transaction {
  id: string
  date: string        // ISO 8601
  type: "bus" | "metro" | "rail" | "tram"
  route: string       // "Bus 42"
  operator: string    // "Bradford Bus"
  status: "complete" | "pending"
  amount: number      // negative (e.g. -1.50)
  discounted: boolean
}

interface TopUpPayload {
  amount: number
  method: "card" | "apple_pay" | "google_pay"
  cardNumber: string
  expiry: string
  cvv: string
  name: string
}
```

### Seed Data
- **3 cards:** 1 active (John Smith, 122*******31230, 10/27, £550 spent, £0 balance), 2 pending
- **20 transactions:** spread over 2 weeks, mix of Bus / Metro / Rail, amounts -£0.75 to -£3.50, some discounted

---

## 5. Key UX Rules (from ui-ux-pro-max)

- All touch targets ≥ 44×44px
- No emojis as icons — Lucide React SVG icons only
- Contrast ≥ 4.5:1 all text
- `cursor-pointer` on all interactive elements
- Hover transitions 150–200ms ease-out
- Bottom sheet dismisses on backdrop tap or swipe-down drag
- Form errors shown below field, on blur (not on keystroke)
- Card number input auto-formats with spaces every 4 digits
- Apple/Google Pay buttons follow brand guidelines (black / white respectively)
- `prefers-reduced-motion` respected: skip entrance animations

---

## 6. Out of Scope

- Real payment processing
- Real authentication / JWT
- Profile page content (tab visible, content placeholder)
- Push notifications
- Card freeze/unfreeze flow
- Multi-currency
