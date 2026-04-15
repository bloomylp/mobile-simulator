import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnrolmentProvider } from '../../context/EnrolmentContext'
import { EnrolmentStep2Page } from '../../pages/enrolment/EnrolmentStep2Page'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderStep2() {
  return render(
    <MemoryRouter>
      <EnrolmentProvider>
        <EnrolmentStep2Page />
      </EnrolmentProvider>
    </MemoryRouter>
  )
}

describe('EnrolmentStep2Page', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('renders step heading', () => {
    renderStep2()
    expect(screen.getByText(/STEP 2/i)).toBeInTheDocument()
    expect(screen.getByText(/Select an Identity provider/i)).toBeInTheDocument()
  })

  test('renders SheerID button', () => {
    renderStep2()
    expect(screen.getByRole('button', { name: /sheerId/i })).toBeInTheDocument()
  })

  test('renders warning banner', () => {
    renderStep2()
    expect(screen.getByText(/Do not close your browser/i)).toBeInTheDocument()
  })

  test('clicking SheerID opens modal', async () => {
    const user = userEvent.setup()
    renderStep2()
    await user.click(screen.getByRole('button', { name: /sheerId/i }))
    expect(screen.getByText('Register for Concession')).toBeInTheDocument()
  })

  test('"Previous Step" navigates to step-1', async () => {
    const user = userEvent.setup()
    renderStep2()
    await user.click(screen.getByRole('button', { name: /previous step/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-1')
  })
})
