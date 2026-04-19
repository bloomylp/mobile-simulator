// src/__tests__/AndroidFrame.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { FrameProvider } from '../context/FrameContext'
import { AndroidFrame } from '../components/layout/AndroidFrame'
import { AndroidHomeScreen } from '../android/AndroidHomeScreen'
import { addTrip, getTrips, resetTrips } from '../android/apps/wallet/data/androidTripsStore'

function renderAndroid() {
  return render(
    <FrameProvider>
      <AndroidFrame>
        <AndroidHomeScreen />
      </AndroidFrame>
    </FrameProvider>
  )
}

describe('AndroidFrame — shell', () => {
  test('renders the Android screen element', () => {
    renderAndroid()
    expect(screen.getByTestId('android-screen')).toBeInTheDocument()
  })

  test('renders the home screen by default', () => {
    renderAndroid()
    expect(screen.getByTestId('android-home-screen')).toBeInTheDocument()
  })

  test('punch-hole camera is a clickable button that toggles controls', () => {
    renderAndroid()
    const hole = screen.getByRole('button', { name: /toggle controls/i })
    expect(hole).toBeInTheDocument()
    // Before click — no Home control button visible
    expect(screen.queryByRole('button', { name: /^home$/i })).not.toBeInTheDocument()
    fireEvent.click(hole)
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument()
  })

  test('clicking punch-hole twice hides controls', () => {
    renderAndroid()
    const hole = screen.getByRole('button', { name: /toggle controls/i })
    fireEvent.click(hole)
    fireEvent.click(hole)
    expect(screen.queryByRole('button', { name: /^home$/i })).not.toBeInTheDocument()
  })
})

describe('AndroidFrame — Home control button', () => {
  test('Home button returns user from wallet app to home screen', () => {
    renderAndroid()
    // Launch wallet
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    expect(screen.getByTestId('android-wallet-app')).toBeInTheDocument()
    expect(screen.queryByTestId('android-home-screen')).not.toBeInTheDocument()
    // Open controls + click Home
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /^home$/i }))
    expect(screen.getByTestId('android-home-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('android-wallet-app')).not.toBeInTheDocument()
  })
})

describe('AndroidHomeScreen — app grid', () => {
  test('renders the Wallet app icon', () => {
    renderAndroid()
    expect(screen.getByTestId('android-app-wallet')).toBeInTheDocument()
  })

  test('renders decorative app icons (Phone, Messages, Chrome, Camera, Gmail, Photos, Play, Clock, Music, Maps, Settings)', () => {
    renderAndroid()
    const decorative = ['phone', 'messages', 'chrome', 'camera', 'gmail', 'photos', 'play', 'clock', 'music', 'maps', 'settings']
    decorative.forEach((id) => {
      expect(screen.getByTestId(`android-app-${id}`)).toBeInTheDocument()
    })
  })

  test('decorative icons are disabled (not tappable)', () => {
    renderAndroid()
    expect(screen.getByTestId('android-app-phone')).toBeDisabled()
    expect(screen.getByTestId('android-app-chrome')).toBeDisabled()
    expect(screen.getByTestId('android-app-settings')).toBeDisabled()
  })

  test('Wallet icon is enabled', () => {
    renderAndroid()
    expect(screen.getByTestId('android-app-wallet')).not.toBeDisabled()
  })

  test('clicking Wallet icon opens the Android Wallet app', () => {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    expect(screen.getByTestId('android-wallet-app')).toBeInTheDocument()
  })
})

describe('AndroidWalletApp — landing is Wallet main', () => {
  test('shows Wallet heading on app launch', () => {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    expect(screen.getByRole('heading', { name: /^wallet$/i })).toBeInTheDocument()
  })
})

describe('Settings — Search settings resets the Android app to home screen', () => {
  beforeEach(() => resetTrips())

  test('clicking Search settings pill returns user to Android home screen', () => {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /search settings/i }))
    expect(screen.getByTestId('android-home-screen')).toBeInTheDocument()
  })

  test('clicking Search settings clears trip history', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /search settings/i }))
    expect(getTrips()).toHaveLength(0)
  })
})

// ─── $5.00 Trip control button ──────────────────────────────────────
describe('Android controls — $5.00 Trip button', () => {
  beforeEach(() => resetTrips())

  function openControlsWithWalletAtPassDetail() {
    renderAndroid()
    // Launch wallet and navigate to pass detail
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    // Open side controls
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
  }

  test('$5.00 Trip button is visible when controls open', () => {
    renderAndroid()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /\$5\.00 trip/i })).toBeInTheDocument()
  })

  test('clicking $5.00 Trip adds "Station 3" to recent activity in pass detail', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByText('Station 3')).toBeInTheDocument()
  })

  test('clicking $5.00 Trip shows $5.00 amount in recent activity', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByText('$5.00')).toBeInTheDocument()
  })

  test('clicking $5.00 Trip twice shows two trip rows', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getAllByText('Station 3')).toHaveLength(2)
  })

  test('trip row does not show "Incomplete" text', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.queryByText(/incomplete/i)).not.toBeInTheDocument()
  })

  test('fare cap shows prompt text and 0% bar before any trips', () => {
    openControlsWithWalletAtPassDetail()
    expect(screen.getByText(/start riding to see your fare cap/i)).toBeInTheDocument()
    expect(screen.queryByText(/spend \$3\.00 more/i)).not.toBeInTheDocument()
    const bar = screen.getByTestId('fare-cap-bar-fill')
    expect(bar.style.width).toBe('0%')
  })

  test('after $5.00 Trip click, fare cap replaces prompt with spend-more text', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.queryByText(/start riding to see your fare cap/i)).not.toBeInTheDocument()
    // After a single $5 trip: remaining = $10 - $5 = $5
    expect(
      screen.getByText(/spend \$5\.00 more to have free travel/i)
    ).toBeInTheDocument()
  })

  test('after $5.00 Trip click, fare cap bar is 50% full (5 of 10)', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    const bar = screen.getByTestId('fare-cap-bar-fill')
    expect(bar.style.width).toBe('50%')
  })

  test('clicking a trip row in recent activity removes it', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByText('Station 3')).toBeInTheDocument()
    // Trip row should be a button — click to remove
    fireEvent.click(screen.getByRole('button', { name: /remove station 3/i }))
    expect(screen.queryByText('Station 3')).not.toBeInTheDocument()
  })

  test('removing the only trip resets fare cap text to prompt', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /remove station 3/i }))
    expect(screen.getByText(/start riding to see your fare cap/i)).toBeInTheDocument()
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('0%')
  })

  test('clicking one of two trip rows removes only that trip', () => {
    openControlsWithWalletAtPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getAllByText('Station 3')).toHaveLength(2)
    // Remove first one
    fireEvent.click(screen.getAllByRole('button', { name: /remove station 3/i })[0])
    expect(screen.getAllByText('Station 3')).toHaveLength(1)
  })
})

// ─── $2.00 and $10.00 Trip buttons + fare cap accumulation ──────────
describe('Android controls — $2.00 Trip and $10.00 Trip buttons', () => {
  beforeEach(() => resetTrips())

  function openControls() {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
  }

  test('$2.00 Trip button is visible when controls open', () => {
    renderAndroid()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /\$2\.00 trip/i })).toBeInTheDocument()
  })

  test('$2.00 Trip adds Station 1 with $2.00 to recent activity', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$2\.00 trip/i }))
    expect(screen.getByText('Station 1')).toBeInTheDocument()
    expect(screen.getByText('$2.00')).toBeInTheDocument()
  })

  test('$10.00 Trip adds Station 2 with $10.00 to recent activity', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$10\.00 trip/i }))
    expect(screen.getByText('Station 2')).toBeInTheDocument()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  test('$2.00 Trip fills bar to 20%', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$2\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('20%')
  })

  test('$10.00 Trip fills bar to 100%', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$10\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('100%')
  })

  test('$5 + $2 = $7 → bar 70%, remaining $3.00', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$2\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('70%')
    expect(screen.getByText(/spend \$3\.00 more to have free travel/i)).toBeInTheDocument()
  })

  test('$5 + $5 = $10 → bar 100%, free-travel text', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('100%')
    expect(screen.getByText(/you have free travel until/i)).toBeInTheDocument()
    expect(screen.queryByText(/spend .* more/i)).not.toBeInTheDocument()
  })

  test('over-cap ($10 + $5 = $15) → bar stays at 100%, free-travel text', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$10\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('100%')
    expect(screen.getByText(/you have free travel until/i)).toBeInTheDocument()
  })

  test('removing a trip recomputes bar and text', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$10\.00 trip/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    // At cap
    expect(screen.getByText(/you have free travel until/i)).toBeInTheDocument()
    // Remove the $10 trip (Station 2) — total drops to $5
    fireEvent.click(screen.getByRole('button', { name: /remove station 2/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('50%')
    expect(screen.getByText(/spend \$5\.00 more to have free travel/i)).toBeInTheDocument()
    expect(screen.queryByText(/you have free travel until/i)).not.toBeInTheDocument()
  })

  test('free-travel text includes a month name and 03:00 time', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /\$10\.00 trip/i }))
    // Should contain a full month name (dynamic) and the 03:00 time suffix
    expect(
      screen.getByText(/you have free travel until \w+ \d+ 03:00/i)
    ).toBeInTheDocument()
  })
})

// ─── Pass Trip button — $0 value, "Pass Used" display ──────────────
describe('Android controls — Pass Trip button', () => {
  beforeEach(() => resetTrips())

  function openControls() {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
  }

  test('Pass Trip button is visible when controls open', () => {
    renderAndroid()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /^pass trip$/i })).toBeInTheDocument()
  })

  test('clicking Pass Trip adds "Pass" row to recent activity', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^pass trip$/i }))
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  test('Pass Trip row shows "Pass Used" (not $0)', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^pass trip$/i }))
    expect(screen.getByText('Pass Used')).toBeInTheDocument()
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument()
  })

  test('Pass Trip does NOT advance fare cap bar', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^pass trip$/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('0%')
  })

  test('Pass Trip alongside $5 trip: bar 50%, remaining $5.00', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^pass trip$/i }))
    fireEvent.click(screen.getByRole('button', { name: /\$5\.00 trip/i }))
    expect(screen.getByTestId('fare-cap-bar-fill').style.width).toBe('50%')
    expect(screen.getByText(/spend \$5\.00 more to have free travel/i)).toBeInTheDocument()
  })
})

// ─── Payment Issue button + dismissable banner ─────────────────────
describe('Android controls — Payment Issue button', () => {
  beforeEach(() => resetTrips())

  function navigateToPassDetail() {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
  }

  function openControls() {
    navigateToPassDetail()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
  }

  test('Payment Issue button is visible when controls open', () => {
    renderAndroid()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /^payment issue$/i })).toBeInTheDocument()
  })

  test('no payment issue banner by default', () => {
    navigateToPassDetail()
    expect(screen.queryByText(/you have a payment issue/i)).not.toBeInTheDocument()
  })

  test('clicking Payment Issue shows the banner on pass detail', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^payment issue$/i }))
    expect(screen.getByText(/you have a payment issue/i)).toBeInTheDocument()
  })

  test('banner shows "Fix issue" text', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^payment issue$/i }))
    expect(screen.getByText(/fix issue/i)).toBeInTheDocument()
  })

  test('banner has a dismiss X button', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^payment issue$/i }))
    expect(screen.getByRole('button', { name: /dismiss payment issue/i })).toBeInTheDocument()
  })

  test('clicking dismiss X hides the banner', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^payment issue$/i }))
    expect(screen.getByText(/you have a payment issue/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /dismiss payment issue/i }))
    expect(screen.queryByText(/you have a payment issue/i)).not.toBeInTheDocument()
  })

  test('Search settings resets payment issue visibility', () => {
    openControls()
    fireEvent.click(screen.getByRole('button', { name: /^payment issue$/i }))
    expect(screen.getByText(/you have a payment issue/i)).toBeInTheDocument()
    // Close controls, go back to Wallet main, open Settings via L avatar, tap Search settings
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    fireEvent.click(screen.getByRole('button', { name: /wallet settings/i }))
    fireEvent.click(screen.getByRole('button', { name: /search settings/i }))
    // Back to Android home — re-enter wallet, banner should NOT be there
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    expect(screen.queryByText(/you have a payment issue/i)).not.toBeInTheDocument()
  })
})

// ─── Add pass button anchoring ───────────────────────────────────────
describe('TransitPassDetailScreen — Add pass button anchoring', () => {
  beforeEach(() => resetTrips())

  function navigateToPassDetail() {
    renderAndroid()
    fireEvent.click(screen.getByTestId('android-app-wallet'))
    fireEvent.click(screen.getByRole('button', { name: /add to wallet/i }))
    fireEvent.click(screen.getByRole('button', { name: /transit pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^littlepay/i }))
    fireEvent.click(screen.getByRole('button', { name: /i'?m in/i }))
    fireEvent.click(screen.getByRole('button', { name: /mastercard.*4444/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    fireEvent.click(screen.getByRole('button', { name: /view in wallet/i }))
  }

  test('Add pass button is present with no trips', () => {
    navigateToPassDetail()
    expect(screen.getByRole('button', { name: /add pass/i })).toBeInTheDocument()
  })

  test('Add pass button remains present after many trips added', () => {
    navigateToPassDetail()
    // Simulate many trips that would push a non-anchored button out of view
    for (let i = 0; i < 20; i++) {
      addTrip({ name: `Station ${i}`, amount: '$5.00', date: 'Apr 17' })
    }
    expect(screen.getByRole('button', { name: /add pass/i })).toBeInTheDocument()
  })

  test('Add pass button is outside the scrollable content container', () => {
    navigateToPassDetail()
    addTrip({ name: 'Station 1', amount: '$5.00', date: 'Apr 17' })
    const addPassBtn = screen.getByRole('button', { name: /add pass/i })
    // Button must NOT be a descendant of the scrollable content div
    // (i.e. it should be in a sibling footer, not inside overflowY:auto region)
    const scrollableRegion = addPassBtn.closest('[data-scroll-region]')
    expect(scrollableRegion).toBeNull()
  })
})
