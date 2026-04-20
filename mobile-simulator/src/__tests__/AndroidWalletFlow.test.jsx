// src/__tests__/AndroidWalletFlow.test.jsx
// End-to-end Android Wallet flow tests (screens 1–8/9) per GTI reference images.
import { render, screen, fireEvent, within, act } from '@testing-library/react'
import { AndroidWalletApp } from '../android/apps/AndroidWalletApp'
import { addTrip, resetTrips } from '../android/apps/wallet/data/androidTripsStore'

function renderApp() {
  return render(<AndroidWalletApp />)
}

// ─── Settings (accessed via L avatar) ──────────────────────────────
describe('Settings — accessed via the L avatar on Wallet main', () => {
  test('L avatar is a clickable button with aria-label', () => {
    renderApp()
    expect(screen.getByRole('button', { name: /wallet settings/i })).toBeInTheDocument()
  })

  test('clicking L avatar opens the Settings screen', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByPlaceholderText(/search settings/i)).toBeInTheDocument()
  })

  test('Settings shows Location row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /^location/i })).toBeInTheDocument()
  })

  test('Settings shows Safety and emergency row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /safety and emergency/i })).toBeInTheDocument()
  })

  test('Settings shows Passwords and accounts row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /passwords and accounts/i })).toBeInTheDocument()
  })

  test('Settings shows Digital Wellbeing and parental controls row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /digital wellbeing/i })).toBeInTheDocument()
  })

  test('Settings shows Google row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /^google/i })).toBeInTheDocument()
  })

  test('Settings shows System row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /^system/i })).toBeInTheDocument()
  })

  test('Settings shows About phone row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /about phone/i })).toBeInTheDocument()
  })

  test('Settings shows Tips and support row', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    expect(screen.getByRole('button', { name: /tips and support/i })).toBeInTheDocument()
  })

  test('clicking a settings row (e.g. Location) returns to Wallet main', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /^location/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })

  test('clicking About phone returns to Wallet main', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /about phone/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })

  test('after visiting Settings and returning, existing wallet state is preserved', () => {
    renderApp()
    // Start a flow partway to have some state
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    // Go back to main to see pristine main, then into settings
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /^location/i }))
    // Wallet main should still show pre-seeded MasterCard
    expect(screen.getByText(/mastercard/i)).toBeInTheDocument()
    expect(screen.getByText(/4444/)).toBeInTheDocument()
  })
})

// ─── Screen 1: Wallet main ─────────────────────────────────────────
describe('Screen 1 — Wallet main', () => {
  test('shows Wallet title', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })

  test('pre-seeded MasterCard 4444 is visible', () => {
    renderApp()
    expect(screen.getByText(/mastercard/i)).toBeInTheDocument()
    expect(screen.getByText(/4444/)).toBeInTheDocument()
  })

  test('Add to Wallet button is present and interactive', () => {
    renderApp()
    const btn = screen.getByRole('button', { name: /add to wallet/i })
    expect(btn).toBeInTheDocument()
    expect(btn).not.toBeDisabled()
  })

  test('Archived passes label visible', () => {
    renderApp()
    expect(screen.getByText(/archived passes/i)).toBeInTheDocument()
  })

  test('clicking Add to Wallet navigates to categories screen', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    expect(screen.getByRole('heading', { name: /^add to wallet$/i })).toBeInTheDocument()
  })
})

// ─── Screen 2: Add to Wallet categories ────────────────────────────
describe('Screen 2 — Add to Wallet categories', () => {
  function goToCategories() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
  }

  test('shows Payment card row', () => {
    goToCategories()
    expect(screen.getByText(/payment card/i)).toBeInTheDocument()
  })

  test('shows Transit pass row', () => {
    goToCategories()
    expect(screen.getByText(/^transit pass$/i)).toBeInTheDocument()
  })

  test('shows Loyalty card row', () => {
    goToCategories()
    expect(screen.getByText(/loyalty card/i)).toBeInTheDocument()
  })

  test('shows Gift card row', () => {
    goToCategories()
    expect(screen.getByRole('button', { name: /^gift card$/i })).toBeInTheDocument()
  })

  test('shows Everything else row', () => {
    goToCategories()
    expect(screen.getByText(/everything else/i)).toBeInTheDocument()
  })

  test('clicking Transit pass navigates to search agency screen', () => {
    goToCategories()
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  test('X close button returns to Wallet main', () => {
    goToCategories()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })
})

// ─── Screen 3: Search agency (no keyboard, no prefilled query) ─────
describe('Screen 3 — Search agency', () => {
  function goToSearch() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
  }

  test('search input is empty by default', () => {
    goToSearch()
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('')
  })

  test('does not render a virtual keyboard', () => {
    goToSearch()
    expect(screen.queryByTestId('android-keyboard')).not.toBeInTheDocument()
  })

  test('shows Brighton and Hove row', () => {
    goToSearch()
    expect(screen.getByText(/brighton and hove/i)).toBeInTheDocument()
  })

  test('shows London row', () => {
    goToSearch()
    expect(screen.getByText(/^london, uk$/i)).toBeInTheDocument()
  })

  test('shows Manchester row', () => {
    goToSearch()
    expect(screen.getByText(/^manchester, uk$/i)).toBeInTheDocument()
  })

  test('shows Vancouver row', () => {
    goToSearch()
    expect(screen.getByText(/^vancouver, bc$/i)).toBeInTheDocument()
  })

  test('shows Littlepay row', () => {
    goToSearch()
    expect(screen.getByText(/^littlepay$/i)).toBeInTheDocument()
  })

  test('only Littlepay row is tappable; others are disabled', () => {
    goToSearch()
    expect(screen.getByRole('button', { name: /^littlepay/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /brighton and hove/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /london, uk/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /manchester, uk/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /vancouver, bc/i })).toBeDisabled()
  })

  test('clicking Littlepay navigates to Transit Insights opt-in', () => {
    goToSearch()
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    expect(screen.getByRole('heading', { name: /get transit insights/i })).toBeInTheDocument()
  })

  test('back arrow returns to categories', () => {
    goToSearch()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: /^add to wallet$/i })).toBeInTheDocument()
  })
})

// ─── Screen 4: Transit Insights opt-in ─────────────────────────────
describe('Screen 4 — Transit Insights opt-in', () => {
  function goToInsights() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
  }

  test('shows Get Transit Insights heading mentioning Littlepay', () => {
    goToInsights()
    expect(screen.getByRole('heading', { name: /get transit insights.*littlepay/i })).toBeInTheDocument()
  })

  test('shows No thanks button', () => {
    goToInsights()
    expect(screen.getByRole('button', { name: /no thanks/i })).toBeInTheDocument()
  })

  test('shows I\'m in button', () => {
    goToInsights()
    expect(screen.getByRole('button', { name: /i'?m in/i })).toBeInTheDocument()
  })

  test('clicking I\'m in navigates to Select payment method', () => {
    goToInsights()
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    expect(screen.getByRole('heading', { name: /select payment method/i })).toBeInTheDocument()
  })

  test('clicking No thanks returns to Wallet main', () => {
    goToInsights()
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })

  test('X close button returns to Wallet main', () => {
    goToInsights()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })
})

// ─── Screen 5: Select payment method ───────────────────────────────
describe('Screen 5 — Select payment method', () => {
  function goToPayment() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
  }

  test('shows Littlobus branding', () => {
    goToPayment()
    expect(screen.getByText(/littlobus/i)).toBeInTheDocument()
  })

  test('shows exactly two payment methods: Visa 2989 and Mastercard 4444', () => {
    goToPayment()
    expect(screen.getByText(/visa.*2989/i)).toBeInTheDocument()
    expect(screen.getByText(/mastercard.*4444/i)).toBeInTheDocument()
    // No other card numbers present
    expect(screen.queryByText(/0978/)).not.toBeInTheDocument()
    expect(screen.queryByText(/0986/)).not.toBeInTheDocument()
  })

  test('clicking a payment method opens the Activation terms modal', () => {
    goToPayment()
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    expect(screen.getByRole('dialog', { name: /activation terms/i })).toBeInTheDocument()
  })

  test('back arrow returns to insights screen', () => {
    goToPayment()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: /get transit insights/i })).toBeInTheDocument()
  })
})

// ─── Screen 6: Activation terms modal ──────────────────────────────
describe('Screen 6 — Activation terms modal', () => {
  function goToTerms() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
  }

  test('modal shows Activation terms heading', () => {
    goToTerms()
    expect(screen.getByRole('heading', { name: /activation terms/i })).toBeInTheDocument()
  })

  test('modal body mentions Littlobus', () => {
    goToTerms()
    const dialog = screen.getByRole('dialog', { name: /activation terms/i })
    expect(within(dialog).getAllByText(/littlobus/i).length).toBeGreaterThan(0)
  })

  test('No thanks closes the modal but stays on payment screen', () => {
    goToTerms()
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }))
    expect(screen.queryByRole('dialog', { name: /activation terms/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /select payment method/i })).toBeInTheDocument()
  })

  test('Continue navigates to ride-ready success screen', () => {
    goToTerms()
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(screen.getByRole('heading', { name: /you're ready to ride/i })).toBeInTheDocument()
  })
})

// ─── Screen 7: Ride ready ──────────────────────────────────────────
describe("Screen 7 — You're ready to ride", () => {
  function goToReady() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
  }

  test('shows ready heading', () => {
    goToReady()
    expect(screen.getByRole('heading', { name: /you're ready to ride/i })).toBeInTheDocument()
  })

  test('mentions the chosen Mastercard 4444 in the description', () => {
    goToReady()
    expect(screen.getByText(/mastercard.*4444/i)).toBeInTheDocument()
  })

  test('View in Wallet button is present', () => {
    goToReady()
    expect(screen.getByRole('button', { name: /view in wallet/i })).toBeInTheDocument()
  })

  test('View in Wallet navigates to Transit pass detail screen', () => {
    goToReady()
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
  })
})

// ─── Screen 8/9: Transit pass detail ───────────────────────────────
describe('Screen 8/9 — Transit pass detail (Littlepay GTI)', () => {
  beforeEach(() => resetTrips())

  function goToDetail() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
  }

  test('shows Littlepay GTI header', () => {
    goToDetail()
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
  })

  test('shows Transit Loyalty Card on the pass', () => {
    goToDetail()
    expect(screen.getByText(/transit loyalty card/i)).toBeInTheDocument()
  })

  test('shows connected payment method Mastercard 4444', () => {
    goToDetail()
    expect(screen.getByText(/mastercard.*4444/i)).toBeInTheDocument()
    expect(screen.getByText(/connected payment method/i)).toBeInTheDocument()
  })

  test('shows fare cap progress text', () => {
    goToDetail()
    expect(screen.getByText(/fare cap progress/i)).toBeInTheDocument()
  })

  test('shows Recent activity empty state', () => {
    goToDetail()
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
    expect(screen.getByText(/no activity yet/i)).toBeInTheDocument()
  })

  test('Add pass button is present', () => {
    goToDetail()
    expect(screen.getByRole('button', { name: /^add pass$/i })).toBeInTheDocument()
  })

  test('Add pass button opens the pass product list screen', () => {
    goToDetail()
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
    expect(screen.getByText('Monthly Travel Pass')).toBeInTheDocument()
  })

  test('pass chip on Wallet main is clickable and returns user to the pass detail page', () => {
    goToDetail()
    // chip already added by ActivationTerms — use back to reach WalletMain
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    const chip = screen.getByRole('button', { name: /littlepay gti/i })
    fireEvent.click(chip)
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
    expect(screen.getByText(/transit loyalty card/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^add pass$/i })).toBeInTheDocument()
  })

  test('back arrow returns to Wallet main', () => {
    goToDetail()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })

  test('fare cap progress bar shows no fill (0% width)', () => {
    goToDetail()
    const fill = document.querySelector('[style*="width: 0%"]')
    expect(fill).toBeInTheDocument()
  })
})

// ─── Regression: Littlepay agency subtitle ─────────────────────────
describe('Regression — Littlepay agency subtitle text', () => {
  test('Littlepay row shows "Contactless EMV Mass Transit" subtitle', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    expect(screen.getByText(/contactless emv mass transit/i)).toBeInTheDocument()
  })

  test('Littlepay row does not show old "Pay with credit or debit" subtitle', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    const littlepayBtn = screen.getByRole('button', { name: /^littlepay/i })
    expect(littlepayBtn).not.toHaveTextContent(/pay with credit or debit/i)
  })
})

// ─── Multiple passes ───────────────────────────────────────────────
describe('Multiple passes — completing the flow twice adds two chips', () => {
  function runFlowOnce() {
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    // back from pass-detail → WalletMain (chip added by ActivationTerms)
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
  }

  test('two completions produce two Littlepay GTI pass chips on Wallet main', () => {
    renderApp()
    runFlowOnce()
    runFlowOnce()
    const chips = screen.getAllByRole('button', { name: /littlepay gti/i })
    expect(chips.length).toBe(2)
  })
})

// ─── Pass persistence through Settings ─────────────────────────────
describe('Pass persistence through Settings', () => {
  test('pass chip on Wallet main persists after visiting Settings and returning', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    // back from pass-detail → WalletMain (chip already added by ActivationTerms)
    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /^location/i }))

    expect(screen.getByRole('button', { name: /littlepay gti/i })).toBeInTheDocument()
  })
})

// ─── Trip display in TransitPassDetailScreen ────────────────────────
describe('TransitPassDetail — trip activity rows', () => {
  beforeEach(() => resetTrips())

  function goToDetail() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
  }

  test('shows empty state when no trips in store', () => {
    goToDetail()
    expect(screen.getByText(/no activity yet/i)).toBeInTheDocument()
  })

  test('shows trip row with station name when a trip is added to the store', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.getByText('Station 3')).toBeInTheDocument()
  })

  test('shows trip amount $5.00 in the activity row', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.getByText('$5.00')).toBeInTheDocument()
  })

  test('shows trip date in the activity row', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.getByText('Apr 17')).toBeInTheDocument()
  })

  test('does not show "Incomplete" status text', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.queryByText(/incomplete/i)).not.toBeInTheDocument()
  })

  test('empty state hidden when trips exist', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.queryByText(/no activity yet/i)).not.toBeInTheDocument()
  })

  test('two trips added — both rows visible', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    goToDetail()
    expect(screen.getAllByText('Station 3')).toHaveLength(2)
  })

  test('second trip row has a top border divider (not overridden by border shorthand)', () => {
    addTrip({ name: 'Station 1', amount: '$2.00', value: 2, date: 'Apr 17' })
    addTrip({ name: 'Station 2', amount: '$5.00', value: 5, date: 'Apr 17' })
    goToDetail()
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    // i=1 row should have borderTop; border:'none' shorthand must NOT override it
    // jsdom normalises hex colours to rgb()
    expect(removeButtons[1].style.borderTop).toBe('1px solid rgb(229, 231, 235)')
  })
})

// ─── Pass list screen ───────────────────────────────────────────────
describe('PassListScreen — pass product selection', () => {
  function goToPassList() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
  }

  test('shows Littlepay GTI as the agency heading', () => {
    goToPassList()
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
  })

  test('shows Daily Travel Pass product row', () => {
    goToPassList()
    expect(screen.getByRole('button', { name: /daily travel pass/i })).toBeInTheDocument()
  })

  test('shows Monthly Travel Pass product row', () => {
    goToPassList()
    expect(screen.getByRole('button', { name: /monthly travel pass/i })).toBeInTheDocument()
  })

  test('shows Daily Travel Pass price $10.00', () => {
    goToPassList()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  test('shows Monthly Travel Pass price $89.00', () => {
    goToPassList()
    expect(screen.getByText('$89.00')).toBeInTheDocument()
  })

  test('tapping Daily Travel Pass navigates to review payment', () => {
    goToPassList()
    fireEvent.click(screen.getByRole('button', { name: /daily travel pass/i }))
    expect(screen.getByRole('heading', { name: /review payment/i })).toBeInTheDocument()
  })

  test('tapping Monthly Travel Pass navigates to review payment', () => {
    goToPassList()
    fireEvent.click(screen.getByRole('button', { name: /monthly travel pass/i }))
    expect(screen.getByRole('heading', { name: /review payment/i })).toBeInTheDocument()
  })

  test('back arrow returns to pass detail screen', () => {
    goToPassList()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
    expect(screen.getByText(/transit loyalty card/i)).toBeInTheDocument()
  })

  test('shows only 2 pass products (no extras)', () => {
    goToPassList()
    expect(screen.queryByText(/lp-gwallet-pass/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/negativeTestsPass/i)).not.toBeInTheDocument()
  })
})

// ─── Review payment screen ──────────────────────────────────────────
describe('ReviewPaymentScreen — confirm selected pass', () => {
  function goToReview({ productName = /daily travel pass/i } = {}) {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    fireEvent.click(screen.getByRole('button', { name: productName }))
  }

  test('shows Review payment heading', () => {
    goToReview()
    expect(screen.getByRole('heading', { name: /review payment/i })).toBeInTheDocument()
  })

  test('shows the selected pass name Daily Travel Pass', () => {
    goToReview()
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
  })

  test('shows the selected pass amount $10.00', () => {
    goToReview()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  test('shows Monthly Travel Pass name when Monthly Travel Pass selected', () => {
    goToReview({ productName: /monthly travel pass/i })
    expect(screen.getByText('Monthly Travel Pass')).toBeInTheDocument()
  })

  test('shows Monthly Travel Pass amount $89.00 when Monthly Travel Pass selected', () => {
    goToReview({ productName: /monthly travel pass/i })
    expect(screen.getByText('$89.00')).toBeInTheDocument()
  })

  test('shows "Payment to Littlepay GTI" summary text', () => {
    goToReview()
    expect(screen.getByText(/payment to littlepay gti/i)).toBeInTheDocument()
  })

  test('Continue button is present', () => {
    goToReview()
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument()
  })

  test('Continue navigates to processing screen', () => {
    goToReview()
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })

  test('back arrow returns to pass list', () => {
    goToReview()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('button', { name: /daily travel pass/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /monthly travel pass/i })).toBeInTheDocument()
  })
})

// ─── Processing screen + full product flow ──────────────────────────
describe('ProcessingScreen + full product flow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  function goToProcessing() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    fireEvent.click(screen.getByRole('button', { name: /daily travel pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
  }

  test('shows Processing heading', () => {
    goToProcessing()
    expect(screen.getByRole('heading', { name: /processing/i })).toBeInTheDocument()
  })

  test('after 3 seconds navigates back to pass detail screen', () => {
    goToProcessing()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
    expect(screen.getByText(/transit loyalty card/i)).toBeInTheDocument()
  })

  test('selected pass Daily Travel Pass shown in pass detail after processing completes', () => {
    goToProcessing()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
  })

  test('selected pass amount $10.00 shown in pass detail after processing', () => {
    goToProcessing()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  test('after processing → back → WalletMain does NOT show purchased pass chip', () => {
    goToProcessing()
    act(() => vi.advanceTimersByTime(3000))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    // Purchased pass products only live on the pass-detail page, not on Wallet main
    expect(screen.queryByRole('button', { name: /daily travel pass/i })).not.toBeInTheDocument()
  })
})

// ─── Multiple Add Pass flows accumulate, do not overwrite ────────────
describe('Add Pass flow — passes accumulate across multiple flows', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  function completeInitialAddToWallet() {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
  }

  function completeAddPassFlow(passNameRegex) {
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    fireEvent.click(screen.getByRole('button', { name: passNameRegex }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    act(() => vi.advanceTimersByTime(3000))
  }

  test('first Add Pass flow shows Daily Travel Pass on pass detail', () => {
    completeInitialAddToWallet()
    completeAddPassFlow(/daily travel pass/i)
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
  })

  test('completing a second Add Pass flow shows BOTH passes on pass detail', () => {
    completeInitialAddToWallet()
    completeAddPassFlow(/daily travel pass/i)
    completeAddPassFlow(/monthly travel pass/i)
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
    expect(screen.getByText('Monthly Travel Pass')).toBeInTheDocument()
  })

  test('second Add Pass flow does NOT overwrite first pass amount', () => {
    completeInitialAddToWallet()
    completeAddPassFlow(/daily travel pass/i)
    completeAddPassFlow(/monthly travel pass/i)
    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText('$89.00')).toBeInTheDocument()
  })

  test('purchased passes do NOT appear on WalletMain — only on pass detail', () => {
    completeInitialAddToWallet()
    completeAddPassFlow(/daily travel pass/i)
    completeAddPassFlow(/monthly travel pass/i)
    // Navigate back to WalletMain
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.queryByRole('button', { name: /daily travel pass/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /monthly travel pass/i })).not.toBeInTheDocument()
    // But activation-pass chip (Littlepay GTI, no amount) still shows
    expect(screen.getByRole('button', { name: /littlepay gti/i })).toBeInTheDocument()
  })
})
