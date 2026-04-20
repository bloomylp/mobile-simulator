import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { BottomNav } from '../components/layout/BottomNav'

function renderNav(path = '/home', enrolled = false) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LangProvider>
        <ConcessionContext.Provider value={{ enrolled, setEnrolled: () => {} }}>
          <BottomNav />
        </ConcessionContext.Provider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  test('renders Home, Cards, Concession, Profile tabs always', () => {
    renderNav('/home', false)
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cards/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /concession/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
  })

  test('shows Concession tab even when not enrolled', () => {
    renderNav('/home', false)
    expect(screen.getByRole('button', { name: /concession/i })).toBeInTheDocument()
  })

  test('Concession tab appears before Profile tab', () => {
    renderNav('/home', false)
    const buttons = screen.getAllByRole('button')
    const names = buttons.map(b => b.getAttribute('aria-label'))
    expect(names.indexOf('Concession')).toBeLessThan(names.indexOf('Profile'))
  })

  test('Concession tab is active when on /concession', () => {
    renderNav('/concession', false)
    const btn = screen.getByRole('button', { name: /concession/i })
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  test('Concession tab not active on /home', () => {
    renderNav('/home', false)
    const btn = screen.getByRole('button', { name: /concession/i })
    expect(btn).not.toHaveAttribute('aria-current')
  })
})
