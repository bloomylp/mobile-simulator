import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnrolmentProvider } from '../../context/EnrolmentContext'
import { EnrolmentStep3Page } from '../../pages/enrolment/EnrolmentStep3Page'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderStep3(initialState = {}) {
  return render(
    <MemoryRouter>
      <EnrolmentProvider initialState={initialState}>
        <EnrolmentStep3Page />
      </EnrolmentProvider>
    </MemoryRouter>
  )
}

describe('EnrolmentStep3Page', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('renders step heading', () => {
    renderStep3()
    expect(screen.getByText(/STEP 3/i)).toBeInTheDocument()
    expect(screen.getByText(/Link your Card/i)).toBeInTheDocument()
  })

  test('renders Select Card button', () => {
    renderStep3()
    expect(screen.getByRole('button', { name: /select card/i })).toBeInTheDocument()
  })

  test('clicking Select Card opens CardAssignModal', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /select card/i }))
    expect(screen.getByText(/Select a Card/i)).toBeInTheDocument()
  })

  test('after card selected modal closes and card name shown', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /select card/i }))
    await user.click(screen.getByLabelText(/ending/i))
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(screen.queryByText(/Select a Card/i)).not.toBeInTheDocument()
    expect(screen.getByText(/John Smith/i)).toBeInTheDocument()
  })

  test('Continue disabled until card selected', () => {
    renderStep3()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  test('Continue navigates to step-4 after card selected', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /select card/i }))
    await user.click(screen.getByLabelText(/ending/i))
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-4')
  })

  test('"Previous Step" navigates to step-2', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /previous step/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-2')
  })
})
