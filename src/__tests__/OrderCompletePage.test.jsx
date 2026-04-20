import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { OrderCompletePage } from '../pages/OrderCompletePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPage(cardType = 'digital') {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/order-complete', state: { cardType } }]}>
      <LangProvider>
        <NotificationsProvider>
          <OrderCompletePage />
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

function renderPhysical() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/order-complete', state: { cardType: 'physical' } }]}>
      <LangProvider>
        <NotificationsProvider>
          <OrderCompletePage />
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('OrderCompletePage — step 1 (Add to Wallet)', () => {
  test('shows step 1 by default', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /add to wallet/i })).toBeInTheDocument()
  })

  test('shows Add to Wallet subtitle', () => {
    renderPage()
    expect(screen.getByText(/keep all the cards, keys and passes/i)).toBeInTheDocument()
  })

  test('shows Cards Found For You row', () => {
    renderPage()
    expect(screen.getByText(/cards found for you/i)).toBeInTheDocument()
  })

  test('shows Debit or Credit Card row', () => {
    renderPage()
    expect(screen.getByText(/debit or credit card/i)).toBeInTheDocument()
  })

  test('shows Travel Card row', () => {
    renderPage()
    expect(screen.getByText(/travel card/i)).toBeInTheDocument()
  })

  test('shows Pay Later Options row', () => {
    renderPage()
    expect(screen.getByText(/pay later options/i)).toBeInTheDocument()
  })

  test('shows Next button on step 1', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
  })

  test('does not show step 2 content on step 1', () => {
    renderPage()
    expect(screen.queryByText(/monterey salinas area/i)).not.toBeInTheDocument()
  })

  test('does not show the old card illustration', () => {
    renderPage()
    expect(screen.queryByText(/you will receive your card shortly/i)).not.toBeInTheDocument()
  })
})

describe('OrderCompletePage — advancing to step 2', () => {
  test('clicking Next advances to step 2', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.getByRole('heading', { name: /travel card/i })).toBeInTheDocument()
  })

  test('step 1 heading hidden after advancing', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.queryByRole('heading', { name: /add to wallet/i })).not.toBeInTheDocument()
  })
})

describe('OrderCompletePage — step 2 (Travel Card)', () => {
  function renderStep2() {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))
  }

  test('shows Travel Card heading', () => {
    renderStep2()
    expect(screen.getByRole('heading', { name: /travel card/i })).toBeInTheDocument()
  })

  test('shows Travel Card subtitle', () => {
    renderStep2()
    expect(screen.getByText(/quickly pass through gates/i)).toBeInTheDocument()
  })

  test('shows United States section label', () => {
    renderStep2()
    expect(screen.getByText(/united states/i)).toBeInTheDocument()
  })

  test('shows MST GO Pass', () => {
    renderStep2()
    expect(screen.getByText(/mst go pass/i)).toBeInTheDocument()
  })

  test('shows Monterey Salinas Area', () => {
    renderStep2()
    expect(screen.getByText(/monterey salinas area/i)).toBeInTheDocument()
  })

  test('shows Hop Fastpass', () => {
    renderStep2()
    expect(screen.getByText(/hop fastpass/i)).toBeInTheDocument()
  })

  test('shows Smart Trip', () => {
    renderStep2()
    expect(screen.getByText(/smart trip/i)).toBeInTheDocument()
  })

  test('shows TAP', () => {
    renderStep2()
    expect(screen.getByText(/^tap$/i)).toBeInTheDocument()
  })

  test('shows Ventra', () => {
    renderStep2()
    expect(screen.getByText(/ventra/i)).toBeInTheDocument()
  })

  test('shows Chicago Metropolitan Area', () => {
    renderStep2()
    expect(screen.getByText(/chicago metropolitan area/i)).toBeInTheDocument()
  })

  test('shows search bar', () => {
    renderStep2()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  test('shows Continue button on step 2', () => {
    renderStep2()
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument()
  })

  test('clicking Continue navigates to /cards', () => {
    renderStep2()
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cards')
  })
})

describe('OrderCompletePage — physical card shows legacy flow', () => {
  test('shows Order Completed heading for physical card', () => {
    renderPhysical()
    expect(screen.getByRole('heading', { name: /order completed/i })).toBeInTheDocument()
  })

  test('does not show Add to Wallet for physical card', () => {
    renderPhysical()
    expect(screen.queryByRole('heading', { name: /add to wallet/i })).not.toBeInTheDocument()
  })

  test('shows Continue button for physical card', () => {
    renderPhysical()
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument()
  })

  test('Continue button on physical flow navigates to /cards', () => {
    renderPhysical()
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cards')
  })
})
