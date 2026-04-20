import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnrolmentProvider } from '../../context/EnrolmentContext'
import { ConcessionContext } from '../../context/ConcessionContext'
import { EnrolmentCompletePage } from '../../pages/enrolment/EnrolmentCompletePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const COMPLETE_STATE = { group: 'student', verified: true, card: { id: 'card-001', name: 'Test', panSuffix: '31230' } }

function renderPage({ setEnrolled = vi.fn(), setConcessionData = vi.fn(), initialState = COMPLETE_STATE } = {}) {
  return render(
    <MemoryRouter>
      <ConcessionContext.Provider value={{ enrolled: false, setEnrolled, setConcessionData }}>
        <EnrolmentProvider initialState={initialState}>
          <EnrolmentCompletePage />
        </EnrolmentProvider>
      </ConcessionContext.Provider>
    </MemoryRouter>
  )
}

describe('EnrolmentCompletePage', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('renders success heading', () => {
    renderPage()
    expect(screen.getByText(/Enrolment Complete/i)).toBeInTheDocument()
  })

  test('Done button is present', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
  })

  test('Done calls setEnrolled(true)', async () => {
    const setEnrolled = vi.fn()
    const user = userEvent.setup()
    renderPage({ setEnrolled })
    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(setEnrolled).toHaveBeenCalledWith(true)
  })

  test('Done calls setConcessionData with group and card from enrolment state', async () => {
    const setConcessionData = vi.fn()
    const user = userEvent.setup()
    const card = { id: 'card-001', panSuffix: '31230' }
    renderPage({
      setConcessionData,
      initialState: { group: 'student', verified: true, card },
    })
    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(setConcessionData).toHaveBeenCalledWith('student', card)
  })

  test('Done navigates to /profile', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/concession')
  })

  test('redirects to /enrolment when state is incomplete', () => {
    renderPage({ initialState: {} })
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment', { replace: true })
  })
})
