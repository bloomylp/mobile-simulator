import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { ConcessionPage } from '../pages/ConcessionPage'

const STUDENT_DATA = {
  group: 'student',
  card: { panSuffix: '31230' },
  enrolledAt: new Date('2026-01-01T08:35:46').getTime(),
}

const SENIOR_DATA = {
  group: 'senior',
  card: { panSuffix: '99999' },
  enrolledAt: new Date('2026-01-01T08:35:46').getTime(),
}

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderEnrolled(concessionData = STUDENT_DATA) {
  return render(
    <MemoryRouter>
      <LangProvider>
        <NotificationsProvider>
          <ConcessionContext.Provider value={{ enrolled: true, concessionData, setEnrolled: () => {}, setConcessionData: () => {} }}>
            <ConcessionPage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

function renderUnenrolled() {
  return render(
    <MemoryRouter>
      <LangProvider>
        <NotificationsProvider>
          <ConcessionContext.Provider value={{ enrolled: false, concessionData: null, setEnrolled: () => {}, setConcessionData: () => {} }}>
            <ConcessionPage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('ConcessionPage — header (both states)', () => {
  test('shows "Concession and Eligibility" title when unenrolled', () => {
    renderUnenrolled()
    expect(screen.getByText('Concession and Eligibility')).toBeInTheDocument()
  })

  test('shows "Concession and Eligibility" title when enrolled', () => {
    renderEnrolled()
    expect(screen.getByText('Concession and Eligibility')).toBeInTheDocument()
  })

  test('renders concession icon when unenrolled', () => {
    renderUnenrolled()
    expect(screen.getByTestId('concession-icon')).toBeInTheDocument()
  })

  test('does NOT render concession icon when enrolled', () => {
    renderEnrolled()
    expect(screen.queryByTestId('concession-icon')).not.toBeInTheDocument()
  })
})

describe('ConcessionPage — unenrolled', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('shows "Click here to start enrolment" CTA', () => {
    renderUnenrolled()
    expect(screen.getByText(/click here to start enrolment/i)).toBeInTheDocument()
  })

  test('CTA is clickable (has a button or link role)', () => {
    renderUnenrolled()
    expect(screen.getByRole('button', { name: /start enrolment/i })).toBeInTheDocument()
  })

  test('clicking CTA navigates to /enrolment', async () => {
    const user = userEvent.setup()
    renderUnenrolled()
    await user.click(screen.getByRole('button', { name: /start enrolment/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment')
  })

  test('does NOT show concession card when unenrolled', () => {
    renderUnenrolled()
    expect(screen.queryByText(/Student Discount/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Senior Discount/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Eligibility Expiry/i)).not.toBeInTheDocument()
  })
})

describe('ConcessionPage — enrolled', () => {
  test('renders Active heading', () => {
    renderEnrolled()
    expect(screen.getByText(/Active/i)).toBeInTheDocument()
  })

  test('shows "Student Discount" title for student group', () => {
    renderEnrolled(STUDENT_DATA)
    expect(screen.getByText('Student Discount')).toBeInTheDocument()
  })

  test('shows "Senior Discount" title for senior group', () => {
    renderEnrolled(SENIOR_DATA)
    expect(screen.getByText('Senior Discount')).toBeInTheDocument()
  })

  test('shows "Student Group" in Used For for student', () => {
    renderEnrolled(STUDENT_DATA)
    expect(screen.getByText(/Student Group/i)).toBeInTheDocument()
  })

  test('shows "Senior Group" in Used For for senior', () => {
    renderEnrolled(SENIOR_DATA)
    expect(screen.getByText(/Senior Group/i)).toBeInTheDocument()
  })

  test('shows masked card number with panSuffix', () => {
    renderEnrolled(STUDENT_DATA)
    expect(screen.getByText(/\*+31230/)).toBeInTheDocument()
  })

  test('shows operator Transit Operator', () => {
    renderEnrolled()
    expect(screen.getByText(/Transit Operator/i)).toBeInTheDocument()
  })

  test('shows Created on date from enrolledAt', () => {
    renderEnrolled(STUDENT_DATA)
    expect(screen.getByText(/01\/01\/2026/)).toBeInTheDocument()
  })

  test('shows Eligibility Expiry label', () => {
    renderEnrolled()
    expect(screen.getByText(/Eligibility Expiry/i)).toBeInTheDocument()
  })

  test('does NOT show enrolment CTA when enrolled', () => {
    renderEnrolled()
    expect(screen.queryByText(/click here to start enrolment/i)).not.toBeInTheDocument()
  })
})
