import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnrolmentProvider } from '../../context/EnrolmentContext'
import { EnrolmentStep4Page } from '../../pages/enrolment/EnrolmentStep4Page'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const filledState = {
  group: 'student',
  verified: true,
  card: { id: 'card-001', name: 'John Smith', panSuffix: '31230' },
}

function renderStep4(initialState = filledState) {
  return render(
    <MemoryRouter>
      <EnrolmentProvider initialState={initialState}>
        <EnrolmentStep4Page />
      </EnrolmentProvider>
    </MemoryRouter>
  )
}

describe('EnrolmentStep4Page', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('renders step heading', () => {
    renderStep4()
    expect(screen.getByText(/STEP 4/i)).toBeInTheDocument()
    expect(screen.getByText(/Review & Submit/i)).toBeInTheDocument()
  })

  test('shows concession group summary', () => {
    renderStep4()
    expect(screen.getByText(/student/i)).toBeInTheDocument()
  })

  test('shows verified status', () => {
    renderStep4()
    expect(screen.getByText(/verified/i)).toBeInTheDocument()
  })

  test('shows linked card summary', () => {
    renderStep4()
    expect(screen.getByText(/31230/)).toBeInTheDocument()
  })

  test('Submit button is present', () => {
    renderStep4()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('Submit navigates to /enrolment/complete', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/complete')
  })

  test('"Previous Step" navigates to step-3', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByRole('button', { name: /previous step/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-3')
  })
})
