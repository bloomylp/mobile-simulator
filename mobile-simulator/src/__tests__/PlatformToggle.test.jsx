// src/__tests__/PlatformToggle.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { FrameContext } from '../context/FrameContext'
import { PlatformToggle } from '../components/layout/PlatformToggle'

function renderToggle({ showControls = true, platform = 'ios' } = {}) {
  const setPlatform = vi.fn()
  const setShowControls = vi.fn()
  const utils = render(
    <FrameContext.Provider value={{ showControls, setShowControls, platform, setPlatform }}>
      <PlatformToggle />
    </FrameContext.Provider>
  )
  return { ...utils, setPlatform, setShowControls }
}

describe('PlatformToggle — visibility', () => {
  test('not rendered when showControls is false', () => {
    renderToggle({ showControls: false })
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  test('rendered when showControls is true', () => {
    renderToggle({ showControls: true })
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
})

describe('PlatformToggle — segments', () => {
  test('shows iPhone and Android segments', () => {
    renderToggle()
    expect(screen.getByRole('radio', { name: /iphone/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /android/i })).toBeInTheDocument()
  })

  test('iPhone segment is checked when platform is ios', () => {
    renderToggle({ platform: 'ios' })
    expect(screen.getByRole('radio', { name: /iphone/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /android/i })).toHaveAttribute('aria-checked', 'false')
  })

  test('Android segment is checked when platform is android', () => {
    renderToggle({ platform: 'android' })
    expect(screen.getByRole('radio', { name: /android/i })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: /iphone/i })).toHaveAttribute('aria-checked', 'false')
  })
})

describe('PlatformToggle — interactions', () => {
  test('clicking Android calls setPlatform("android")', () => {
    const { setPlatform } = renderToggle({ platform: 'ios' })
    fireEvent.click(screen.getByRole('radio', { name: /android/i }))
    expect(setPlatform).toHaveBeenCalledWith('android')
  })

  test('clicking iPhone calls setPlatform("ios")', () => {
    const { setPlatform } = renderToggle({ platform: 'android' })
    fireEvent.click(screen.getByRole('radio', { name: /iphone/i }))
    expect(setPlatform).toHaveBeenCalledWith('ios')
  })
})
