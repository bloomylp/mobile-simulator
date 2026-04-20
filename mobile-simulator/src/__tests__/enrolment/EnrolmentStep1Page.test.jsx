import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnrolmentProvider } from '../../context/EnrolmentContext'
import { EnrolmentStep1Page } from '../../pages/enrolment/EnrolmentStep1Page'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderStep1() {
  return render(
    <MemoryRouter>
      <EnrolmentProvider>
        <EnrolmentStep1Page />
      </EnrolmentProvider>
    </MemoryRouter>
  )
}

describe('EnrolmentStep1Page', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('renders step heading', () => {
    renderStep1()
    expect(screen.getByText(/STEP 1/i)).toBeInTheDocument()
    expect(screen.getByText(/STEP 1 - Select a Concession Group/i)).toBeInTheDocument()
  })

  test('renders Student and Senior options', () => {
    renderStep1()
    expect(screen.getByLabelText('Student')).toBeInTheDocument()
    expect(screen.getByLabelText('Senior')).toBeInTheDocument()
  })

  test('Continue button is disabled when nothing selected', () => {
    renderStep1()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  test('Continue button enabled after selecting Student', async () => {
    const user = userEvent.setup()
    renderStep1()
    await user.click(screen.getByLabelText('Student'))
    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled()
  })

  test('Continue navigates to step-2', async () => {
    const user = userEvent.setup()
    renderStep1()
    await user.click(screen.getByLabelText('Senior'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-2')
  })

  test('"Back to Start" navigates to /enrolment', async () => {
    const user = userEvent.setup()
    renderStep1()
    await user.click(screen.getByRole('button', { name: /back to start/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment')
  })
})
