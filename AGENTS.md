# LittlePay Traveller Wallet

## Agent Rules

- Do NOT take screenshots to verify work unless the user explicitly asks for it.

Mobile-responsive React SPA — digital card issuance, spend dashboard, transit transaction history, top-up flow.

## Working Directory

App lives in `littlepay-wallet/`. All dev commands run from there.

```bash
cd littlepay-wallet
npm run dev      # starts Vite dev server
npm run build
npm run lint
npm run test     # Vitest watch
npm run test:run # Vitest single run
```

## Stack

- Vite 8 + React 19 + React Router 7
- Tailwind CSS 3
- Lucide React (icons only — no emoji icons)
- Static mocked data — no backend
- Auth: `sessionStorage` mock (any email/password accepted)
- Testing: Vitest + jsdom + @testing-library/react

## Routes

| Path | Page |
|------|------|
| `/` | SplashPage |
| `/login` | LoginPage |
| `/cards` | CardsPage |
| `/home` | HomePage (default post-login) |
| `/order-complete` | OrderCompletePage |
| `/profile` | ProfilePage |
| `/concession` | ConcessionPage |
| `/enrolment` | EnrolmentIntroPage |
| `/enrolment/step-1` | EnrolmentStep1Page |
| `/enrolment/step-2` | EnrolmentStep2Page |
| `/enrolment/step-3` | EnrolmentStep3Page |
| `/enrolment/step-4` | EnrolmentStep4Page |
| `/enrolment/complete` | EnrolmentCompletePage |

Top-up is a **bottom sheet overlay** on `/home`, not a route.
`/promotions` → PromotionsPage (shown in HamburgerMenu only when Dynamic Island `showControls` is true)

## Brand Colors (Tailwind custom tokens)

```
brand.DEFAULT  #2DB87E   CTAs, active badge
brand.dark     #1A7A50   splash bg, hover states
brand.card     #4CC48A   card surface
brand.light    #E8F7F0   badge backgrounds
gray-bg        #F4F6F8   app background
```

Deactivated card gradient: `#9CA3AF → #6B7280 → #4B5563` (gray).

Font: Inter (Google Fonts). Icons: Lucide React SVG only. Currency: `$` (USD).

## File Map

```
littlepay-wallet/src/
├── App.jsx                      # Router + auth guard + ConcessionProvider
├── index.css                    # Tailwind + CSS custom props
├── data/
│   ├── cards.js                 # seed card — name: John Rotterwood, id: card-001
│   └── transactions.js          # 10 seed transactions, all cardId: 'card-001'
├── utils/
│   ├── auth.js                  # sessionStorage helpers
│   ├── formatCard.js            # XXXX XXXX XXXX XXXX formatter + expiry
│   ├── filterTransactions.js    # date range filter + groupByDate
│   └── cardsStore.js            # subscribable store (useSyncExternalStore): extraCards, balances,
│                                #   activeStates, topUpTxList, deletedSeedIds
│                                #   Exports: useCardsStore hook, subscribe, getSnapshot,
│                                #   addExtraCard/removeExtraCard/deleteCard, topUpCard,
│                                #   getCardBalance, getCardActive/setCardActive,
│                                #   addTopUpTx/getTopUpTxList, resetCardsStore, buildNewCard
├── context/
│   ├── LangContext.jsx          # EN/ES translations
│   ├── EnrolmentContext.jsx     # Enrolment wizard state (resets after completion)
│   ├── ConcessionContext.jsx    # Global enrolled bool + concessionData + resetConcession
│   ├── NotificationsContext.jsx # notifications[], unreadCount, addNotification(msg,dest,type), clearUnread(), resetNotifications()
│   │                            #   exports NotificationsContext directly (for test injection)
│   └── FrameContext.jsx         # { showControls, setShowControls, platform, setPlatform }
│                                #   FrameProvider wraps app root; consumed by IPhoneFrame, AndroidFrame,
│                                #   PlatformToggle, HamburgerMenu (Promotions gating)
├── components/
│   ├── layout/BottomNav.jsx     # 4-tab nav: Home, Cards, Concession, Profile — active = green icon+text, no bg
│   ├── layout/PageShell.jsx     # max-w-sm wrapper
│   ├── layout/IPhoneFrame.jsx   # iPhone frame + Dynamic Island toggle + side controls panel + push notifications
│   │                            #   reads showControls/setShowControls from FrameContext (state lifted to root)
│   ├── layout/AndroidFrame.jsx  # Pixel 10 Obsidian shell + punch-hole camera (toggles controls) + side Android controls panel
│   │                            #   provides AndroidContext ({ currentApp, launchApp, goHome }) for app view stack
│   ├── layout/PlatformToggle.jsx# segmented iPhone/Android pill above the frame; visible only when showControls=true
│   ├── layout/HamburgerMenu.jsx # slide-in menu; BASE_ITEMS (Home/Cards/Concession/Profile) + Promotions when showControls
│   │                            #   Logout button below <hr> separator — resets all state + sessionStorage.clear() → /login
│   ├── ui/Button.jsx            # primary/secondary/ghost
│   ├── ui/Badge.jsx             # active/pending/frozen pills
│   ├── ui/LangToggle.jsx        # EN/ES language switcher
│   ├── ui/NotificationBell.jsx  # bell icon + unread badge + notification centre panel
│   │                            #   low-balance → red Bell icon; promotion → green Tag icon
│   ├── card/CardChip.jsx        # card visual — props: card, cardLabel, displayPan, balance, flipped, isActive, onFlipBack, onDelete
│                                #   middle row shows "Balance $X.XX" (white font-mono text-sm) when balance > 0; invisible spacer otherwise
│   ├── card/CardActions.jsx     # show details + manage + "Added to Wallet" disabled pill (digital new cards only)
│   │                            #   No interactive wallet flow — button is always disabled, no images
│   ├── card/CardTypeModal.jsx   # digital vs physical selection modal — CTA: "Add Card to Wallet" / "Order Physical Card"
│   ├── enrolment/
│   │   ├── EnrolmentProgress.jsx
│   │   ├── SheerIDModal.jsx
│   │   └── CardAssignModal.jsx
│   ├── transaction/
│   │   ├── DateRangeFilter.jsx
│   │   ├── TransactionList.jsx
│   │   └── TransactionRow.jsx
│   └── topup/
│       ├── TopUpSheet.jsx
│       ├── CardPaymentForm.jsx
│       ├── ApplePayButton.jsx
│       └── GooglePayButton.jsx
├── pages/
│   ├── SplashPage.jsx
│   ├── LoginPage.jsx
│   ├── CardsPage.jsx
│   ├── HomePage.jsx
│   ├── OrderCompletePage.jsx    # digital: 2-step iOS flow (Add to Wallet → Travel Card list); physical: legacy "Order Completed"
│   │                            #   reads useLocation().state?.cardType; slide-in animation on step 2
│   ├── PromotionsPage.jsx       # promotions listing — accessible via HamburgerMenu when showControls=true
│   ├── ProfilePage.jsx          # JR avatar reset calls resetConcession() + resetCardsStore() + resetNotifications()
│   ├── ConcessionPage.jsx       # Unenrolled: CTA; Enrolled: concession card details
│   └── enrolment/
│       ├── EnrolmentIntroPage.jsx
│       ├── EnrolmentStep1Page.jsx
│       ├── EnrolmentStep2Page.jsx
│       ├── EnrolmentStep3Page.jsx
│       ├── EnrolmentStep4Page.jsx
│       └── EnrolmentCompletePage.jsx  # Done → setConcessionData + setEnrolled(true) → /concession
└── __tests__/
    ├── auth.test.js
    ├── cardsStore.test.js
    ├── filterTransactions.test.js
    ├── formatCard.test.js
    ├── ConcessionContext.test.jsx
    ├── ConcessionPage.test.jsx
    ├── BottomNav.test.jsx
    ├── CardActions.test.jsx
    ├── CardsPage.test.jsx
    ├── CardOrderFullCycle.test.jsx  # full routing cycle tests (real Routes, no mocked navigate)
    ├── OrderCompletePage.test.jsx
    ├── ProfilePage.test.jsx
    ├── TransactionList.test.jsx
    └── enrolment/
        ├── EnrolmentContext.test.jsx
        ├── EnrolmentProgress.test.jsx
        ├── EnrolmentStep1Page.test.jsx
        ├── EnrolmentStep2Page.test.jsx
        ├── EnrolmentStep3Page.test.jsx
        ├── EnrolmentStep4Page.test.jsx
        ├── EnrolmentCompletePage.test.jsx
        ├── SheerIDModal.test.jsx
        └── CardAssignModal.test.jsx
```

## Notifications System

- `NotificationsContext` wraps app root (above `BrowserRouter`)
- `addNotification(message, destination, type)` — types: `'low-balance'` | `'promotion'` | default
- `unreadCount` increments per `addNotification`; `clearUnread()` called when bell panel opens
- `resetNotifications()` called by ProfilePage JR avatar reset
- IPhoneFrame side controls trigger both toast (`showNotification`) and `addNotification`:
  - Low Balance: type `'low-balance'`, dest `/home`
  - Push Notification (Info): type `'promotion'`, dest `/promotions`
- NotificationBell icons: `'low-balance'` → red Bell; `'promotion'` → green Tag; default → green Bell
- Clicking a notification item navigates to its `destination`

## Push Notification Toast (IPhoneFrame)

- Low Balance message: `'You have a low balance on your card\n••••••‣31230 Click here to top up.'` (uses `whiteSpace: pre-line`)
- Auto-dismisses after 5 s; slide-out animation 350 ms
- Clicking toast navigates to destination

## OrderCompletePage — Digital vs Physical

- Reads `useLocation().state?.cardType`
- `'digital'` → 2-step iOS-native flow:
  - Step 1 "Add to Wallet": Cards Found For You (spinner), Debit/Credit, Travel Card, Pay Later rows; "Next" advances
  - Step 2 "Travel Card": 5 US transit cards list with selectable rows (green outline on selected), search bar; "Continue" → `/cards`
  - Padding-top 120px on both steps; slide-in animation on step 2
- Any other value → legacy "Order Completed" flow (card illustration, "You will receive your card shortly", "Continue" → `/cards`)
- `CardsPage` passes `{ state: { cardType: type } }` in the `navigate` call

## CardChip — Balance Display (CardsPage)

- `CardsPage` passes `balance={getCardBalance(card.id, card.balance)}` to `CardChip`
- `CardChip` middle row: shows `Balance $X.XX` when `balance > 0`, invisible spacer otherwise
- Style: white, `font-mono text-sm tracking-widest` (same as PAN), left-justified
- Balance defaults to `card.balance` (seed card has `0`); top-ups update `cardsStore` balances
- **Note:** `HomePage` has its own separate balance display in the green header — this is the in-card display on `/cards`

## Card Ordering — Store vs Local State

- `handleTypeConfirm` in `CardsPage` calls ONLY `addExtraCard(newCard)` (no `setCardList`)
- Card is persisted in store; shows on remount when user returns from `/order-complete`
- **Bug fixed:** previously called both `addExtraCard` AND `setCardList`, causing duplicate card on remount
- `CardOrderFullCycle.test.jsx` uses real `<Routes>` (no mocked navigate) to catch remount bugs

## Store Subscription Model (`cardsStore.js`)

- Single immutable `_state` object; mutations produce new snapshot + notify listeners
- `useCardsStore()` = `useSyncExternalStore(subscribe, getSnapshot)` — consumers re-render on any mutation
- CardsPage + HomePage derive `cardList` from `[cards.filter(c => !state.deletedSeedIds.has(c.id)), ...state.extraCards]` — no local `cardList` state
- Dropped `forceRender` anti-pattern; active toggle now calls `setCardActive` and UI re-renders via subscription
- HomePage balance/cards auto-update on `topUpCard` / `addExtraCard` without remount
- `deleteCard(id)` — unified API: filters extraCards AND marks seed ids in `deletedSeedIds`
- `resetCardsStore()` clears all including `deletedSeedIds`
- Timer cleanup: CardsPage tracks `orderTimerRef` + `deleteTimersRef` (Set); useEffect cleanup clears all on unmount

## HamburgerMenu

- `FrameContext` provides `{ showControls }` from IPhoneFrame
- Default: 4 items (Home, Cards, Concession, Profile) — Concession uses `Percent` icon
- When `showControls=true`: Promotions (`Tag` icon, green) inserted between Concession and Profile
- Logout button below `<hr className="border-gray-100">` separator
  - Calls `resetConcession()` + `resetCardsStore()` + `resetNotifications()` + `sessionStorage.clear()` → navigates `/login`
  - Same full reset as ProfilePage JR avatar button

## Concession Enrolment Flow

1. User clicks "Enrol for Concession" on ProfilePage → `/enrolment`
2. Step 1: select group (student / senior)
3. Step 2: SheerID identity verification
4. Step 3: assign travel card
5. Step 4: review & submit → `/enrolment/complete`
6. EnrolmentCompletePage: `setConcessionData(group, card)` + `setEnrolled(true)` → navigate `/concession`
7. ConcessionPage (enrolled): shows discount card with group label, expiry (+4yr), linked card, "Start new concession enrolment" button
8. ConcessionPage (unenrolled): shows "Click here to start enrolment" CTA

## Concession Context (`ConcessionContext.jsx`)

- `enrolled: bool` — gates enrolled UI
- `concessionData: { group, card, enrolledAt }` — persists group + card after enrolment reset
- `setEnrolled(bool)`, `setConcessionData(group, card)`, `resetConcession()` — clears both
- Wrapped at app root in `App.jsx` (above BrowserRouter)
- `ProfilePage` JR avatar reset calls `resetConcession()` + clears sessionStorage

## Card Active/Deactivated Toggle

- CardsPage has per-card toggle
- Active → green gradient; Deactivated → gray gradient
- State: `getCardActive(id)` / `setCardActive(id, bool)` in `cardsStore.js`

## Add to Wallet

- Digital new cards (`status === 'new' && cardType === 'digital'`) show a permanently disabled "Added to Wallet" black pill
- No interactive flow — no wallet.png / apple_wallet.png animation
- Wallet state API was removed from cardsStore (unused dead code)

## Top-Up Transaction Persistence

- `addTopUpTx(tx)` / `getTopUpTxList()` in `cardsStore.js` — persists top-up txs across navigation
- Each top-up tx includes `cardId` so it's shown only on the card it was loaded to
- `resetCardsStore()` clears top-up txs (called by ProfilePage JR avatar reset)
- `HomePage` initialises `txList` as `[...getTopUpTxList(), ...transactions]`

## Per-Card Transactions (HomePage)

- `transactions.js` seed entries all carry `cardId: 'card-001'`
- Top-up txs carry `cardId` of the active card at time of top-up
- `cardTxs = txList.filter(tx => tx.cardId === activeCard.id)` — only current card's txs shown
- New/ordered cards show empty state: "No trips" + "or balance loading completed."
- Date filter applied on top of card filter

## BottomNav Active State

- Active tab: icon + label turn `#2DB87E`, no background fill
- All tabs `flex-1` equal width; no edge-flush radius logic

## Seed Data

- 1 active card: John Rotterwood, `id: 'card-001'`, 122*******31230, 10/27
- 10 seed transactions: 4-day spread, bus/metro/rail/tram mix, all `cardId: 'card-001'`

## Design Rules

- Touch targets ≥ 44×44px
- Contrast ≥ 4.5:1 on all text
- `cursor-pointer` on all interactive elements
- Hover transitions 150–200ms ease-out
- Bottom sheet: slide-up 250ms, dismisses on backdrop tap or swipe-down
- Form errors: below field, on blur only
- Card number input: auto-format XXXX XXXX XXXX XXXX
- Apple Pay button: black pill; Google Pay button: white pill with border
- `prefers-reduced-motion`: skip entrance animations
- Cards/panels: `rounded-2xl shadow-sm`; Buttons: `rounded-xl`; Badges: `rounded-full`

## Android Platform (Pixel 10)

- `FrameProvider` at App root owns `{ platform, setPlatform }` (default `'ios'`, in-memory only, no reload persistence)
- `PlatformShell` in `App.jsx` branches on platform:
  - `ios` → `<BrowserRouter><IPhoneFrame><Routes/></IPhoneFrame></BrowserRouter>`
  - `android` → `<AndroidFrame><AndroidHomeScreen/></AndroidFrame>` (no router)
- `PlatformToggle` pill rendered above each frame; visible only when `showControls === true` (Dynamic Island or punch-hole clicked)
- `AndroidFrame` — Pixel 10 Obsidian body (400×860), punch-hole camera button toggles `showControls`
- `AndroidFrame` provides `AndroidContext` = `{ currentApp, launchApp(id), goHome() }` for Android-internal view stack
- Android side controls panel (shown when `showControls=true`): single "Home" button that calls `goHome()`
- `AndroidHomeScreen` (`src/android/`) — blue wallpaper, 4-col icon grid, 12 app icons. Wallet is tappable (launches `AndroidWalletApp`); all others decorative (disabled buttons)
- Android code fully separated from iOS code: `src/android/` + `AndroidFrame.jsx` + `AndroidContext`. iOS code unaware of Android

## Android Wallet App — Transit Pass Flow (`src/android/apps/wallet/`)

Reference images: `GTI/1.png`–`9.png`. Brand across app: **Littlobus** (accent green). White app surface `#FFFFFF`; inner cards/rows `#F3F4F6`.

- `WalletFlowProvider` + `useWalletFlow()` — state: `{ step, selectedPayment, passes, termsOpen, selectedPass }`; actions: `goTo, back, close, addPass, setSelectedPayment, openTerms, closeTerms, setSelectedPass`. Linear back-stack in `BACK` map includes `passlist → pass-detail`, `review → passlist`
- `AndroidWalletApp` — `StepRouter` renders one screen at a time. Keeps `data-testid="android-wallet-app"` for the Android launcher test
- Screens under `wallet/screens/`:
  - `WalletMainScreen` (1) — pre-seeded MasterCard 0978 hero, "Hold to reader", activation passes list (post-flow), "Archived passes", "Add to Wallet" FAB → `categories`. L avatar → `settings`. **Filters `passes` to exclude those with `amount`** — purchased pass products do NOT appear as chips here
  - `AddToWalletCategoriesScreen` (2) — 5 rows. Only "Transit pass" enabled → `search`. X → `close()`
  - `SearchAgencyScreen` (3) — empty text input (no virtual keyboard), 5 agency rows. Only "Littlepay" tappable → `insights`. Back → `categories`
  - `TransitInsightsOptInScreen` (4) — illustration + copy mentioning Littlepay. "No thanks"/X → `close()`; "I'm in" → `payment`
  - `SelectPaymentMethodScreen` (5) — Littlobus branding; 2 cards (Visa 2989, MC 4444) from `PAYMENT_METHODS`. Card tap → `setSelectedPayment` + `openTerms()`
  - ActivationTermsModal (6) — inside screen 5. "No thanks" → `closeTerms()`; "Continue" → `addPass({brand:'Littlepay GTI'})` (no amount) + `goTo('ready')`
  - `RideReadyScreen` (7) — blue check, reader illustration, selected payment in copy. "View in Wallet" → `pass-detail`
  - `TransitPassDetailScreen` (8/9) — Littlobus + Littlepay GTI header, black transit loyalty card, connected payment, **purchased pass rows (one per product)**, fare cap progress (0%), Recent activity (from `androidTripsStore`). "Add pass" → `passlist`. Layout: `AppSurface` uses `position: absolute; inset: 0; overflow: hidden` + flex column; content div `flex: 1; overflowY: auto` (has `data-scroll-region="true"`); Add pass footer `flexShrink: 0` — button stays anchored regardless of trip count
  - `SettingsScreen` — dark-theme phone-settings page opened from L avatar. Search pill calls `resetTrips()` + `goHome()`; row clicks call `back()`
  - `PassListScreen` (pass-product list) — shows `PASS_PRODUCTS` (GwZone1Pass $10.00, GwZone2Pass $9.00). Tap → `setSelectedPass(product)` + `goTo('review')`
  - `ReviewPaymentScreen` — shows selected pass name + amount + "Payment to Littlepay GTI" note. Continue → `processing`. Uses `AppSurface` `position: absolute; inset: 0` to anchor Continue button at bottom
  - `ProcessingScreen` — spinning blob (centered via `flex: 1`), auto-advances after **3 s** → calls `addPass({ id, brand: selectedPass.name, amount: selectedPass.amount })` → `goTo('pass-detail')`. Uses `AppSurface` `position: absolute; inset: 0`
- Add Pass flow **accumulates, does not overwrite** — each completed flow pushes a new pass with `amount` onto `passes[]`. `TransitPassDetailScreen` renders `purchasedPasses = passes.filter(p => p.amount)` as one row per pass
- Seed: `data/walletSeed.js` — `SEED_PASS`, `AGENCIES`, `PAYMENT_METHODS`, `PASS_PRODUCTS`
- Trips: `data/androidTripsStore.js` — module-level subscribable store. Exports `addTrip`, `resetTrips`, `getTrips`, `subscribe`, `useTripsStore` (via `useSyncExternalStore`). Drives Recent Activity on `TransitPassDetailScreen`
- Primitives: `ui/primitives.jsx` — `AppSurface`, `TopBar`, `IconButton`, `PillButton`, colour tokens. Screens that need full-height (anchored footer, centered content) override `AppSurface` style with `position: absolute; inset: 0`

## Android Side Controls (shown when punch-hole tapped)

- **Home** — `goHome()` — returns to Android home screen from any app
- **$5.00 Trip** — `addTrip({ name: 'Station 3', amount: '$5.00', date: <today> })` — adds a row to Recent Activity on `TransitPassDetailScreen`
- **$10.00 Trip** — placeholder (no-op currently)

## Specs & Plan

- Design spec: `docs/superpowers/specs/2026-04-14-littlepay-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-14-littlepay-wallet.md`
