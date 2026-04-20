import { render, screen } from '@testing-library/react'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress'

describe('EnrolmentProgress', () => {
  test('renders all 4 step labels', () => {
    render(<EnrolmentProgress currentStep={1} />)
    expect(screen.getByText('Entitlement')).toBeInTheDocument()
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
    expect(screen.getByText('Link Card')).toBeInTheDocument()
    expect(screen.getByText('Submission')).toBeInTheDocument()
  })

  test('active step has aria-current="step"', () => {
    render(<EnrolmentProgress currentStep={2} />)
    const activeStep = screen.getByText('Identity Verification').closest('[aria-current="step"]')
    expect(activeStep).toBeInTheDocument()
  })

  test('completed steps have data-complete="true"', () => {
    render(<EnrolmentProgress currentStep={3} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-complete', 'true')
    expect(items[1]).toHaveAttribute('data-complete', 'true')
    expect(items[2]).not.toHaveAttribute('data-complete', 'true')
  })

  test('step numbers shown for incomplete future steps', () => {
    render(<EnrolmentProgress currentStep={1} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
