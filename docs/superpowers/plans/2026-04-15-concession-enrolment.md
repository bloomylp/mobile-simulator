# Concession Enrolment Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-step concession enrolment flow triggered from the Profile page, allowing users to select an entitlement group, complete mock SheerID identity verification, assign a travel card, and submit.

**Architecture:** New `/enrolment` route tree (5 pages) with shared `EnrolmentContext` for cross-step state. Each step is a standalone page component. Two modal overlays handle SheerID verification and card assignment. All data is in-memory (no backend).

**Tech Stack:** Vite + React 19, React Router 7, Tailwind CSS 3, Lucide React, Vitest + @testing-library/react + @testing-library/user-event + jsdom

---

## File Map

**Create:**
- `littlepay-wallet/src/context/EnrolmentContext.jsx` — shared state (group, verified, card)
- `littlepay-wallet/src/components/enrolment/EnrolmentProgress.jsx` — 4-step stepper
- `littlepay-wallet/src/components/enrolment/SheerIDModal.jsx` — mock SheerID form + verified screen
- `littlepay-wallet/src/components/enrolment/CardAssignModal.jsx` — card entry form
- `littlepay-wallet/src/pages/enrolment/EnrolmentIntroPage.jsx` — landing/overview
- `littlepay-wallet/src/pages/enrolment/EnrolmentStep1Page.jsx` — entitlement group selection
- `littlepay-wallet/src/pages/enrolment/EnrolmentStep2Page.jsx` — identity verification
- `littlepay-wallet/src/pages/enrolment/EnrolmentStep3Page.jsx` — link travel card
- `littlepay-wallet/src/pages/enrolment/EnrolmentStep4Page.jsx` — submission/confirmation
- `littlepay-wallet/src/test/setup.js` — vitest + RTL setup
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentContext.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentProgress.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/SheerIDModal.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/CardAssignModal.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep1Page.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep2Page.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep3Page.test.jsx`
- `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep4Page.test.jsx`

**Modify:**
- `littlepay-wallet/package.json` — add test script + Vitest deps
- `littlepay-wallet/vite.config.js` — add Vitest config block
- `littlepay-wallet/src/App.jsx` — add enrolment routes wrapped in EnrolmentProvider
- `littlepay-wallet/src/pages/ProfilePage.jsx` — wire "Enrol for Concession" to navigate

---

## Task 1: Test infrastructure

**Files:**
- Modify: `littlepay-wallet/package.json`
- Modify: `littlepay-wallet/vite.config.js`
- Create: `littlepay-wallet/src/test/setup.js`

- [ ] **Step 1: Install Vitest and Testing Library**

```bash
cd littlepay-wallet
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Add test script to package.json**

Replace the `"scripts"` block:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Add Vitest config to vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 4: Create test setup file**

```js
// src/test/setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify setup with a smoke test**

Create `src/__tests__/smoke.test.js`:
```js
test('test infrastructure works', () => {
  expect(1 + 1).toBe(2)
})
```

Run: `npm run test:run`
Expected: `1 passed`

- [ ] **Step 6: Delete smoke test, commit**

```bash
rm src/__tests__/smoke.test.js
git add -A && git commit -m "chore: add Vitest + Testing Library test infrastructure"
```

---

## Task 2: EnrolmentContext

**Files:**
- Create: `littlepay-wallet/src/context/EnrolmentContext.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentContext.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentContext.test.jsx
import { render, screen, act } from '@testing-library/react'
import { EnrolmentProvider, useEnrolment } from '../../context/EnrolmentContext'

function TestConsumer() {
  const { state, setGroup, setVerified, setCard, resetEnrolment } = useEnrolment()
  return (
    <div>
      <span data-testid="group">{state.group ?? 'none'}</span>
      <span data-testid="verified">{String(state.verified)}</span>
      <span data-testid="card">{state.card ? state.card.name : 'none'}</span>
      <button onClick={() => setGroup('student')}>set-student</button>
      <button onClick={() => setGroup('senior')}>set-senior</button>
      <button onClick={() => setVerified(true)}>set-verified</button>
      <button onClick={() => setCard({ name: 'John', number: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' })}>set-card</button>
      <button onClick={resetEnrolment}>reset</button>
    </div>
  )
}

describe('EnrolmentContext', () => {
  test('provides initial state', () => {
    render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    expect(screen.getByTestId('group').textContent).toBe('none')
    expect(screen.getByTestId('verified').textContent).toBe('false')
    expect(screen.getByTestId('card').textContent).toBe('none')
  })

  test('setGroup updates group', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-student').click())
    expect(getByTestId('group').textContent).toBe('student')
  })

  test('setVerified updates verified', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-verified').click())
    expect(getByTestId('verified').textContent).toBe('true')
  })

  test('setCard updates card', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-card').click())
    expect(getByTestId('card').textContent).toBe('John')
  })

  test('resetEnrolment clears state', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-student').click())
    await act(async () => getByText('set-verified').click())
    await act(async () => getByText('reset').click())
    expect(getByTestId('group').textContent).toBe('none')
    expect(getByTestId('verified').textContent).toBe('false')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentContext.test.jsx
```
Expected: FAIL — `Cannot find module '../../context/EnrolmentContext'`

- [ ] **Step 3: Implement EnrolmentContext**

```jsx
// src/context/EnrolmentContext.jsx
import { createContext, useContext, useState } from 'react'

const INITIAL = { group: null, verified: false, card: null }

const EnrolmentContext = createContext(null)

export function EnrolmentProvider({ children, initialState = {} }) {
  const [state, setState] = useState({ ...INITIAL, ...initialState })

  function setGroup(group) { setState(s => ({ ...s, group })) }
  function setVerified(verified) { setState(s => ({ ...s, verified })) }
  function setCard(card) { setState(s => ({ ...s, card })) }
  function resetEnrolment() { setState(INITIAL) }

  return (
    <EnrolmentContext.Provider value={{ state, setGroup, setVerified, setCard, resetEnrolment }}>
      {children}
    </EnrolmentContext.Provider>
  )
}

export function useEnrolment() {
  const ctx = useContext(EnrolmentContext)
  if (!ctx) throw new Error('useEnrolment must be used inside EnrolmentProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentContext.test.jsx
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentContext with group/verified/card state"
```

---

## Task 3: EnrolmentProgress component

**Files:**
- Create: `littlepay-wallet/src/components/enrolment/EnrolmentProgress.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentProgress.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentProgress.test.jsx
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

  test('completed steps show checkmark indicator', () => {
    render(<EnrolmentProgress currentStep={3} />)
    // Steps 1 and 2 are complete, step 3 is active
    const stepButtons = screen.getAllByRole('listitem')
    expect(stepButtons[0]).toHaveAttribute('data-complete', 'true')
    expect(stepButtons[1]).toHaveAttribute('data-complete', 'true')
    expect(stepButtons[2]).not.toHaveAttribute('data-complete', 'true')
  })

  test('step numbers shown for incomplete future steps', () => {
    render(<EnrolmentProgress currentStep={1} />)
    // Steps 2, 3, 4 show their numbers
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentProgress.test.jsx
```
Expected: FAIL — `Cannot find module '../../components/enrolment/EnrolmentProgress'`

- [ ] **Step 3: Implement EnrolmentProgress**

```jsx
// src/components/enrolment/EnrolmentProgress.jsx
import { Check } from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Entitlement' },
  { n: 2, label: 'Identity Verification' },
  { n: 3, label: 'Link Card' },
  { n: 4, label: 'Submission' },
]

export function EnrolmentProgress({ currentStep }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-4 mb-4">
      <ol className="flex items-start justify-between gap-1" role="list">
        {STEPS.map(({ n, label }, i) => {
          const complete = n < currentStep
          const active   = n === currentStep
          return (
            <li
              key={n}
              className="flex flex-col items-center gap-1 flex-1"
              data-complete={complete ? 'true' : undefined}
              aria-current={active ? 'step' : undefined}
            >
              {/* Connector + circle row */}
              <div className="flex items-center w-full">
                {/* Left connector */}
                <div className={`flex-1 h-px ${i === 0 ? 'invisible' : complete || active ? 'bg-[#2DB87E]' : 'bg-gray-200'}`} />
                {/* Circle */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0
                  ${complete ? 'bg-[#2DB87E] border-[#2DB87E]' : active ? 'border-[#2DB87E] bg-white' : 'border-gray-300 bg-white'}`}>
                  {complete
                    ? <Check size={14} className="text-white" strokeWidth={3} aria-hidden="true" />
                    : <span className={`text-xs font-bold ${active ? 'text-[#2DB87E]' : 'text-gray-400'}`}>{n}</span>
                  }
                </div>
                {/* Right connector */}
                <div className={`flex-1 h-px ${i === STEPS.length - 1 ? 'invisible' : complete ? 'bg-[#2DB87E]' : 'bg-gray-200'}`} />
              </div>
              {/* Label */}
              <span className={`text-[10px] text-center leading-tight ${active ? 'text-[#2DB87E] font-semibold' : complete ? 'text-[#2DB87E]' : 'text-gray-400'}`}>
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentProgress.test.jsx
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentProgress 4-step stepper component"
```

---

## Task 4: EnrolmentIntroPage

**Files:**
- Create: `littlepay-wallet/src/pages/enrolment/EnrolmentIntroPage.jsx`
- (No dedicated test — navigation wiring tested in Task 12)

- [ ] **Step 1: Implement EnrolmentIntroPage**

```jsx
// src/pages/enrolment/EnrolmentIntroPage.jsx
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'

const STEPS_OVERVIEW = [
  { n: 1, title: 'Entitlement',            desc: 'Select a concession group or cohort you want to enrol in.' },
  { n: 2, title: 'Identity Verification',  desc: 'Identity verification is processed by our integration partners.' },
  { n: 3, title: 'Select your travel card', desc: 'Select or add a card you want to enrol. This card must be presented when travelling.' },
  { n: 4, title: 'Submission',             desc: 'Confirm all your details are correct to travel.' },
]

export function EnrolmentIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/profile')}
          className="p-1 -ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg"
          aria-label="Back to profile"
        >
          <ChevronLeft size={22} className="text-[#1A1F2E]" />
        </button>
        <h1 className="text-[#1A1F2E] text-lg font-bold">Enrolment</h1>
      </div>

      {/* Card */}
      <div className="mx-5 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4">
        <h2 className="text-[#1A1F2E] text-base font-bold text-center">Concession Enrolment</h2>
        <p className="text-[#1A1F2E] text-xl font-bold">
          little<span className="text-[#2DB87E]">pay</span>
        </p>
        <p className="text-[#6B7280] text-sm text-center">
          Please take a few minutes to complete the verification and enrolment process.
        </p>

        <ol className="w-full flex flex-col gap-3 mt-2">
          {STEPS_OVERVIEW.map(({ n, title, desc }) => (
            <li key={n} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#6B7280] font-medium">{n}</span>
              </div>
              <div>
                <p className="text-[#1A1F2E] text-sm font-semibold">{title}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <Button className="w-full mt-2" onClick={() => navigate('/enrolment/step-1')}>
          Start Enrolment
        </Button>

        <button
          className="text-[#2DB87E] text-sm font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          onClick={() => {}}
        >
          Privacy policy
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentIntroPage landing screen"
```

---

## Task 5: EnrolmentStep1Page — Entitlement

**Files:**
- Create: `littlepay-wallet/src/pages/enrolment/EnrolmentStep1Page.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep1Page.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentStep1Page.test.jsx
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
    expect(screen.getByText(/Select a Concession Group/i)).toBeInTheDocument()
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
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep1Page.test.jsx
```
Expected: FAIL — `Cannot find module '../../pages/enrolment/EnrolmentStep1Page'`

- [ ] **Step 3: Implement EnrolmentStep1Page**

```jsx
// src/pages/enrolment/EnrolmentStep1Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

const GROUPS = [
  { value: 'student', label: 'Student' },
  { value: 'senior',  label: 'Senior'  },
]

export function EnrolmentStep1Page() {
  const navigate = useNavigate()
  const { setGroup } = useEnrolment()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    setGroup(selected)
    navigate('/enrolment/step-2')
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/enrolment')}
          className="p-1 -ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-[#1A1F2E]" />
        </button>
        <h1 className="text-[#1A1F2E] text-lg font-bold">Enrolment</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <EnrolmentProgress currentStep={1} />

        <div>
          <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 1 - Select a Concession Group</h2>
          <p className="text-[#6B7280] text-xs mb-4">Select a concession group that matches your eligibility.</p>

          <div className="flex flex-col gap-3">
            {GROUPS.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-4 cursor-pointer border-2 transition-colors duration-150 min-h-[56px]
                  ${selected === value ? 'border-[#2DB87E]' : 'border-transparent'}`}
              >
                <input
                  type="radio"
                  name="concession-group"
                  value={value}
                  checked={selected === value}
                  onChange={() => setSelected(value)}
                  className="accent-[#2DB87E] w-4 h-4 cursor-pointer"
                  aria-label={label}
                />
                <span className="text-[#1A1F2E] text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pt-8 flex flex-col gap-3">
        <Button className="w-full" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
        <button
          onClick={() => navigate('/enrolment')}
          className="text-[#2DB87E] text-sm font-medium flex items-center justify-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          aria-label="Back to Start"
        >
          <ChevronLeft size={14} />
          Back to Start
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep1Page.test.jsx
```
Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentStep1Page concession group selection"
```

---

## Task 6: SheerIDModal

**Files:**
- Create: `littlepay-wallet/src/components/enrolment/SheerIDModal.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/SheerIDModal.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/SheerIDModal.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SheerIDModal } from '../../components/enrolment/SheerIDModal'

const onVerified = vi.fn()
const onClose    = vi.fn()

function renderModal() {
  return render(<SheerIDModal onVerified={onVerified} onClose={onClose} />)
}

describe('SheerIDModal', () => {
  beforeEach(() => { onVerified.mockClear(); onClose.mockClear() })

  test('renders form in initial state', () => {
    renderModal()
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
    expect(screen.getByText('Register for Concession')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify and continue/i })).toBeInTheDocument()
  })

  test('shows TEST MODE banner', () => {
    renderModal()
    expect(screen.getByText(/TEST MODE/i)).toBeInTheDocument()
  })

  test('"Verify and continue" disabled when fields empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /verify and continue/i })).toBeDisabled()
  })

  test('"Verify and continue" enabled when all required fields filled', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Smith')
    await user.selectOptions(screen.getByLabelText(/month/i), 'January')
    await user.type(screen.getByLabelText(/day/i), '15')
    await user.type(screen.getByLabelText(/year/i), '1990')
    await user.type(screen.getByLabelText(/postal code/i), 'SW1A 1AA')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    expect(screen.getByRole('button', { name: /verify and continue/i })).not.toBeDisabled()
  })

  test('submitting form shows verified screen', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Smith')
    await user.selectOptions(screen.getByLabelText(/month/i), 'January')
    await user.type(screen.getByLabelText(/day/i), '15')
    await user.type(screen.getByLabelText(/year/i), '1990')
    await user.type(screen.getByLabelText(/postal code/i), 'SW1A 1AA')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))
    expect(screen.getByText("You've been verified")).toBeInTheDocument()
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument()
  })

  test('X button on verified screen calls onVerified', async () => {
    const user = userEvent.setup()
    renderModal()
    // Fill and submit form
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Smith')
    await user.selectOptions(screen.getByLabelText(/month/i), 'January')
    await user.type(screen.getByLabelText(/day/i), '15')
    await user.type(screen.getByLabelText(/year/i), '1990')
    await user.type(screen.getByLabelText(/postal code/i), 'SW1A 1AA')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))
    // Close verified screen
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onVerified).toHaveBeenCalledTimes(1)
  })

  test('X button on form screen calls onClose', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/SheerIDModal.test.jsx
```
Expected: FAIL — `Cannot find module '../../components/enrolment/SheerIDModal'`

- [ ] **Step 3: Implement SheerIDModal**

```jsx
// src/components/enrolment/SheerIDModal.jsx
import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const EMPTY_FORM = { firstName: '', lastName: '', month: '', day: '', year: '', postalCode: '', email: '' }

function isComplete(form) {
  return Object.values(form).every(v => v.trim() !== '')
}

export function SheerIDModal({ onVerified, onClose }) {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [verified, setVerified] = useState(false)

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setVerified(true)
  }

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
      {/* SheerID-style header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[#1A1F2E] text-base font-semibold">Identity Verification</h2>
        <button
          onClick={verified ? onVerified : onClose}
          className="p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
          aria-label="Close"
        >
          <X size={20} className="text-[#6B7280]" />
        </button>
      </div>

      {/* TEST MODE banner */}
      <div className="bg-[#D32F2F] text-white text-xs font-semibold text-center py-2 tracking-wide">
        TEST MODE <span className="underline font-normal cursor-pointer">(learn more)</span>
      </div>

      {verified ? (
        /* Verified state */
        <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-12 text-center">
          <CheckCircle size={56} className="text-gray-300" strokeWidth={1.25} />
          <h3 className="text-[#1A1F2E] text-lg font-bold">You've been verified</h3>
          <p className="text-[#6B7280] text-sm">Thank you for completing</p>
          <p className="text-[#6B7280] text-sm mt-2">
            If you have any questions contact us{' '}
            <span className="text-[#2DB87E]">support@littlepay.com</span>
          </p>
          <p className="text-[#9CA3AF] text-xs mt-4 max-w-xs">
            SheerID handles verification only. Now that you've been approved, please direct all questions about the promotion terms to Littlepay customer service.
          </p>
        </div>
      ) : (
        /* Form state */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-6 flex-1">
          <div className="text-center mb-2">
            <h3 className="text-[#1A1F2E] text-base font-bold">Register for Concession</h3>
            <p className="text-[#6B7280] text-sm mt-1">Verify your current age.</p>
            <button type="button" className="text-[#2DB87E] text-sm underline cursor-pointer focus:outline-none">
              How does verifying work?
            </button>
          </div>

          <p className="text-[#6B7280] text-xs">* Required information</p>

          {/* First name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-first" className="text-[#1A1F2E] text-sm font-medium">
              First name*
            </label>
            <input
              id="sheer-first"
              aria-label="First name"
              value={form.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="given-name"
            />
          </div>

          {/* Last name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-last" className="text-[#1A1F2E] text-sm font-medium">
              Last name*
            </label>
            <input
              id="sheer-last"
              aria-label="Last name"
              value={form.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="family-name"
            />
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1">
            <span className="text-[#1A1F2E] text-sm font-medium">Date of birth*</span>
            <p className="text-[#6B7280] text-xs">Used for verification purposes only</p>
            <div className="flex gap-2">
              <select
                aria-label="Month"
                value={form.month}
                onChange={e => handleChange('month', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm text-[#1A1F2E] flex-1 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] cursor-pointer"
              >
                <option value="">Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                aria-label="Day"
                placeholder="Day"
                value={form.day}
                onChange={e => handleChange('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] w-16 focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
                inputMode="numeric"
              />
              <input
                aria-label="Year"
                placeholder="Year"
                value={form.year}
                onChange={e => handleChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] w-20 focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Postal code */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-postal" className="text-[#1A1F2E] text-sm font-medium">
              Postal code*
            </label>
            <input
              id="sheer-postal"
              aria-label="Postal code"
              value={form.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="postal-code"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-email" className="text-[#1A1F2E] text-sm font-medium">
              Email address*
            </label>
            <p className="text-[#6B7280] text-xs">Personal email address is recommended</p>
            <input
              id="sheer-email"
              aria-label="Email address"
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="email"
            />
          </div>

          {/* Marketing checkbox */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-[#2DB87E]" />
            <span className="text-[#6B7280] text-xs">
              Yes, send me Littlepay marketing communications about exclusive sales, special offers, latest products and more
            </span>
          </label>

          <button
            type="submit"
            disabled={!isComplete(form)}
            className="w-full bg-[#424242] hover:bg-[#303030] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-3.5 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 mt-2 min-h-[48px]"
            aria-label="Verify and continue"
          >
            Verify and continue
          </button>
        </form>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/SheerIDModal.test.jsx
```
Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add SheerIDModal mock identity verification overlay"
```

---

## Task 7: EnrolmentStep2Page — Identity Verification

**Files:**
- Create: `littlepay-wallet/src/pages/enrolment/EnrolmentStep2Page.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep2Page.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentStep2Page.test.jsx
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
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep2Page.test.jsx
```
Expected: FAIL — `Cannot find module '../../pages/enrolment/EnrolmentStep2Page'`

- [ ] **Step 3: Implement EnrolmentStep2Page**

```jsx
// src/pages/enrolment/EnrolmentStep2Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { SheerIDModal } from '../../components/enrolment/SheerIDModal.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

export function EnrolmentStep2Page() {
  const navigate = useNavigate()
  const { setVerified } = useEnrolment()
  const [modalOpen, setModalOpen] = useState(false)

  function handleVerified() {
    setVerified(true)
    setModalOpen(false)
    navigate('/enrolment/step-3')
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/enrolment/step-1')}
          className="p-1 -ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-[#1A1F2E]" />
        </button>
        <h1 className="text-[#1A1F2E] text-lg font-bold">Enrolment</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <EnrolmentProgress currentStep={2} />

        <div>
          <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 2 - Select an Identity provider</h2>
          <p className="text-[#6B7280] text-xs mb-5">
            Click on the identity provider below to start the eligibility verification process.
          </p>

          {/* SheerID button */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-white rounded-2xl shadow-sm py-6 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
            aria-label="SheerID — click to verify identity"
          >
            {/* SheerID wordmark */}
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#00AEEF]">Sheer</span>
              <span className="text-[#E63329] font-black">ID</span>
              <span className="text-[#E63329] text-lg font-black">✓</span>
            </span>
          </button>

          {/* Warning banner */}
          <div className="mt-4 flex items-center gap-2 bg-[#FFF8E1] border border-[#FFC107] rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-[#FFA000] flex-shrink-0" aria-hidden="true" />
            <p className="text-[#6B7280] text-xs font-medium">
              Do not close your browser during enrollment!
            </p>
          </div>

          <button
            className="mt-4 text-[#2DB87E] text-sm font-medium underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] flex items-center"
            onClick={() => {}}
          >
            Privacy policy
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pt-8">
        <button
          onClick={() => navigate('/enrolment/step-1')}
          className="text-[#2DB87E] text-sm font-medium flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          aria-label="Previous Step"
        >
          <ChevronLeft size={14} />
          Previous Step
        </button>
      </div>

      {modalOpen && (
        <SheerIDModal
          onVerified={handleVerified}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep2Page.test.jsx
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentStep2Page identity verification with SheerID modal"
```

---

## Task 8: CardAssignModal

**Files:**
- Create: `littlepay-wallet/src/components/enrolment/CardAssignModal.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/CardAssignModal.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/CardAssignModal.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardAssignModal } from '../../components/enrolment/CardAssignModal'

const onSubmit = vi.fn()
const onClose  = vi.fn()

function renderModal() {
  return render(<CardAssignModal onSubmit={onSubmit} onClose={onClose} />)
}

describe('CardAssignModal', () => {
  beforeEach(() => { onSubmit.mockClear(); onClose.mockClear() })

  test('renders form fields', () => {
    renderModal()
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expiry/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/security code/i)).toBeInTheDocument()
  })

  test('Submit button disabled when fields empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /^submit$/i })).toBeDisabled()
  })

  test('card number formats as user types', async () => {
    const user = userEvent.setup()
    renderModal()
    const input = screen.getByLabelText(/card number/i)
    await user.type(input, '4242424242424242')
    expect(input.value).toBe('4242 4242 4242 4242')
  })

  test('Submit calls onSubmit with card data when complete', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Smith')
    await user.type(screen.getByLabelText(/card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiry/i), '1228')
    await user.type(screen.getByLabelText(/security code/i), '123')
    await user.click(screen.getByRole('button', { name: /^submit$/i }))
    expect(onSubmit).toHaveBeenCalledWith({
      name:   'John Smith',
      number: '4242 4242 4242 4242',
      expiry: '12/28',
      cvv:    '123',
    })
  })

  test('renders Apple Pay button', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /apple pay/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/CardAssignModal.test.jsx
```
Expected: FAIL — `Cannot find module '../../components/enrolment/CardAssignModal'`

- [ ] **Step 3: Implement CardAssignModal**

```jsx
// src/components/enrolment/CardAssignModal.jsx
import { useState } from 'react'
import { formatCardNumber, formatExpiry } from '../../utils/formatCard.js'

function isComplete(form) {
  return form.name.trim() !== '' &&
    form.number.replace(/\s/g, '').length === 16 &&
    form.expiry.length === 5 &&
    form.cvv.trim().length >= 3
}

export function CardAssignModal({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' })

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ name: form.name, number: form.number, expiry: form.expiry, cvv: form.cvv })
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto px-5 py-8">
      {/* Brand */}
      <p className="text-[#1A1F2E] text-lg font-bold text-center mb-2">
        little<span className="text-[#2DB87E]">pay</span>
      </p>

      <p className="text-[#6B7280] text-sm text-center mb-6">
        Enter card details when traveling with your physical card or select your digital wallet when traveling with your digital device.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        {/* Cardholder name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="assign-name" className="sr-only">Cardholder name</label>
          <input
            id="assign-name"
            aria-label="Cardholder name"
            placeholder="Cardholder name"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-3 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
            autoComplete="cc-name"
          />
        </div>

        {/* Card number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="assign-number" className="sr-only">Card number</label>
          <input
            id="assign-number"
            aria-label="Card number"
            placeholder="Card number"
            value={form.number}
            onChange={e => handleChange('number', formatCardNumber(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-3 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={19}
          />
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="assign-expiry" className="sr-only">Expiry</label>
            <input
              id="assign-expiry"
              aria-label="Expiry"
              placeholder="mm/yy"
              value={form.expiry}
              onChange={e => handleChange('expiry', formatExpiry(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="assign-cvv" className="sr-only">Security code</label>
            <input
              id="assign-cvv"
              aria-label="Security code"
              placeholder="Security code"
              value={form.cvv}
              onChange={e => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm text-[#1A1F2E] focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              inputMode="numeric"
              autoComplete="cc-csc"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isComplete(form)}
          className="w-full bg-[#2DB87E] hover:bg-[#1A7A50] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-3.5 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] mt-2 min-h-[48px] uppercase tracking-wide"
          aria-label="Submit"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => onSubmit({ name: 'Apple Pay', number: '0000 0000 0000 0000', expiry: '12/99', cvv: '000' })}
          className="w-full bg-black text-white font-semibold text-sm rounded-xl py-3.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 min-h-[48px] flex items-center justify-center gap-2"
          aria-label="Apple Pay"
        >
          {/* Apple logo (SVG) */}
          <svg viewBox="0 0 14 17" width="14" height="17" fill="white" aria-hidden="true">
            <path d="M13.17 5.9c-.08.06-1.52.87-1.52 2.67 0 2.07 1.82 2.81 1.87 2.83-.01.06-.29 1-.95 1.96-.6.86-1.22 1.71-2.18 1.71s-1.2-.56-2.31-.56c-1.08 0-1.46.58-2.35.58s-1.5-.82-2.2-1.77C2.77 12.11 2 10.33 2 8.63c0-2.77 1.8-4.24 3.58-4.24.94 0 1.73.62 2.32.62.56 0 1.44-.66 2.53-.66.41 0 1.86.04 2.74 1.55zM9.57 2.44C9.99 1.91 10.3 1.17 10.3.38c0-.1-.01-.21-.02-.3-.71.03-1.56.48-2.06 1.08-.44.52-.81 1.27-.81 2.06 0 .11.02.22.03.26.05.01.13.02.21.02.63 0 1.43-.43 1.92-1.06z"/>
          </svg>
          Pay
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/CardAssignModal.test.jsx
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add CardAssignModal card entry form with formatting"
```

---

## Task 9: EnrolmentStep3Page — Link Card

**Files:**
- Create: `littlepay-wallet/src/pages/enrolment/EnrolmentStep3Page.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep3Page.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentStep3Page.test.jsx
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

function renderStep3() {
  return render(
    <MemoryRouter>
      <EnrolmentProvider>
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
    expect(screen.getByText(/Assign.*Travel Card/i)).toBeInTheDocument()
  })

  test('renders assign card button', () => {
    renderStep3()
    expect(screen.getByRole('button', { name: /assign a card/i })).toBeInTheDocument()
  })

  test('Continue disabled when no card assigned', () => {
    renderStep3()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  test('clicking assign opens card modal', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /assign a card/i }))
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()
  })

  test('assigning card closes modal and enables Continue', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /assign a card/i }))
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Smith')
    await user.type(screen.getByLabelText(/card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiry/i), '1228')
    await user.type(screen.getByLabelText(/security code/i), '123')
    await user.click(screen.getByRole('button', { name: /^submit$/i }))
    expect(screen.queryByLabelText(/card number/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled()
  })

  test('shows assigned card summary after assignment', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /assign a card/i }))
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Smith')
    await user.type(screen.getByLabelText(/card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiry/i), '1228')
    await user.type(screen.getByLabelText(/security code/i), '123')
    await user.click(screen.getByRole('button', { name: /^submit$/i }))
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  test('Continue navigates to step-4', async () => {
    const user = userEvent.setup()
    renderStep3()
    await user.click(screen.getByRole('button', { name: /assign a card/i }))
    await user.type(screen.getByLabelText(/cardholder name/i), 'John Smith')
    await user.type(screen.getByLabelText(/card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiry/i), '1228')
    await user.type(screen.getByLabelText(/security code/i), '123')
    await user.click(screen.getByRole('button', { name: /^submit$/i }))
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
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep3Page.test.jsx
```
Expected: FAIL — `Cannot find module '../../pages/enrolment/EnrolmentStep3Page'`

- [ ] **Step 3: Implement EnrolmentStep3Page**

```jsx
// src/pages/enrolment/EnrolmentStep3Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, CreditCard } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { CardAssignModal } from '../../components/enrolment/CardAssignModal.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

export function EnrolmentStep3Page() {
  const navigate = useNavigate()
  const { state, setCard } = useEnrolment()
  const [modalOpen, setModalOpen] = useState(false)

  function handleCardSubmit(card) {
    setCard(card)
    setModalOpen(false)
  }

  function maskNumber(n) {
    const digits = n.replace(/\s/g, '')
    return digits.slice(0, 4) + ' **** **** ' + digits.slice(-4)
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/enrolment/step-2')}
          className="p-1 -ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-[#1A1F2E]" />
        </button>
        <h1 className="text-[#1A1F2E] text-lg font-bold">Enrolment</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <EnrolmentProgress currentStep={3} />

        <div>
          <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 3 - Assign your Travel Card</h2>
          <p className="text-[#6B7280] text-xs mb-4">Assign the contactless card you want to travel with.</p>

          {state.card ? (
            /* Assigned card summary */
            <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F7F0] flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="text-[#2DB87E]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1A1F2E] text-sm font-semibold truncate">{state.card.name}</p>
                <p className="text-[#6B7280] text-xs">{maskNumber(state.card.number)} · {state.card.expiry}</p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="text-[#2DB87E] text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] px-2"
              >
                Change
              </button>
            </div>
          ) : (
            /* Assign button */
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-center gap-2 text-[#1A1F2E] text-sm font-medium cursor-pointer hover:shadow-md transition-shadow duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] border-2 border-dashed border-gray-200 hover:border-[#2DB87E] min-h-[56px]"
              aria-label="Assign a card"
            >
              <Plus size={16} className="text-[#6B7280]" />
              Assign a card
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pt-8 flex flex-col gap-3">
        <Button
          className="w-full"
          disabled={!state.card}
          onClick={() => navigate('/enrolment/step-4')}
        >
          Continue
        </Button>
        <button
          onClick={() => navigate('/enrolment/step-2')}
          className="text-[#2DB87E] text-sm font-medium flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          aria-label="Previous Step"
        >
          <ChevronLeft size={14} />
          Previous Step
        </button>
      </div>

      {modalOpen && (
        <CardAssignModal
          onSubmit={handleCardSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep3Page.test.jsx
```
Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentStep3Page travel card assignment"
```

---

## Task 10: EnrolmentStep4Page — Submission

**Files:**
- Create: `littlepay-wallet/src/pages/enrolment/EnrolmentStep4Page.jsx`
- Create: `littlepay-wallet/src/__tests__/enrolment/EnrolmentStep4Page.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/__tests__/enrolment/EnrolmentStep4Page.test.jsx
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
  card: { name: 'John Smith', number: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' },
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
    expect(screen.getByText(/Submission/i)).toBeInTheDocument()
  })

  test('shows Identity Verification row', () => {
    renderStep4()
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
  })

  test('shows concession group for student', () => {
    renderStep4()
    expect(screen.getByText(/Student Under 25/i)).toBeInTheDocument()
  })

  test('shows concession group for senior', () => {
    renderStep4({ ...filledState, group: 'senior' })
    expect(screen.getByText(/Senior/i)).toBeInTheDocument()
  })

  test('shows hardcoded operator', () => {
    renderStep4()
    expect(screen.getByText('Transit System')).toBeInTheDocument()
  })

  test('shows masked card number and expiry', () => {
    renderStep4()
    expect(screen.getByText(/4242.*4242/)).toBeInTheDocument()
    expect(screen.getByText(/12\/28/)).toBeInTheDocument()
  })

  test('Submit disabled until T&C checked', () => {
    renderStep4()
    expect(screen.getByRole('button', { name: /^submit$/i })).toBeDisabled()
  })

  test('Submit enabled after T&C checked', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByLabelText(/agree to the terms/i))
    expect(screen.getByRole('button', { name: /^submit$/i })).not.toBeDisabled()
  })

  test('Submit navigates to /profile', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByLabelText(/agree to the terms/i))
    await user.click(screen.getByRole('button', { name: /^submit$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/profile')
  })

  test('"Previous Step" navigates to step-3', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByRole('button', { name: /previous step/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-3')
  })

  test('edit card icon navigates to step-3', async () => {
    const user = userEvent.setup()
    renderStep4()
    await user.click(screen.getByRole('button', { name: /edit card/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/enrolment/step-3')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep4Page.test.jsx
```
Expected: FAIL — `Cannot find module '../../pages/enrolment/EnrolmentStep4Page'`

- [ ] **Step 3: Implement EnrolmentStep4Page**

```jsx
// src/pages/enrolment/EnrolmentStep4Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Pencil } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

const GROUP_LABELS = {
  student: 'Student Under 25',
  senior:  'Senior',
}

function maskCard(number) {
  const d = number.replace(/\s/g, '')
  return d.slice(0, 4) + '*****' + d.slice(-4)
}

function cardScheme(number) {
  return number.trim().startsWith('4') ? 'VISA' : 'CARD'
}

function SummaryRow({ label, sub, action }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-5 h-5 rounded-full bg-[#2DB87E] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check size={11} className="text-white" strokeWidth={3} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-[#1A1F2E] text-sm font-medium">{label}</p>
        {sub && <p className="text-[#6B7280] text-xs mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function EnrolmentStep4Page() {
  const navigate = useNavigate()
  const { state, resetEnrolment } = useEnrolment()
  const [agreed, setAgreed] = useState(false)

  function handleSubmit() {
    resetEnrolment()
    navigate('/profile')
  }

  const card = state.card
  const cardDisplay = card
    ? `${cardScheme(card.number)} ${maskCard(card.number)} | ${card.expiry}`
    : '—'

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/enrolment/step-3')}
          className="p-1 -ml-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-[#1A1F2E]" />
        </button>
        <h1 className="text-[#1A1F2E] text-lg font-bold">Enrolment</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <EnrolmentProgress currentStep={4} />

        <div>
          <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 4 - Submission</h2>
          <p className="text-[#6B7280] text-xs mb-4">Confirm your information and details below.</p>

          <div className="bg-white rounded-2xl shadow-sm px-4">
            <SummaryRow label="Identity Verification" sub="SheerID" />
            <SummaryRow
              label="Added to Concession Group"
              sub={GROUP_LABELS[state.group] ?? state.group}
            />
            <SummaryRow label="Operator" sub="Transit System" />
            <SummaryRow
              label="Ready to Travel on"
              sub={cardDisplay}
              action={
                <button
                  onClick={() => navigate('/enrolment/step-3')}
                  className="p-1.5 text-[#6B7280] hover:text-[#2DB87E] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-lg transition-colors duration-150"
                  aria-label="Edit card"
                >
                  <Pencil size={14} />
                </button>
              }
            />
          </div>
        </div>

        {/* T&C */}
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="accent-[#2DB87E] w-4 h-4 cursor-pointer"
            aria-label="Agree to the Terms and Conditions"
          />
          <span className="text-[#6B7280] text-xs">
            Agree To{' '}
            <span className="text-[#2DB87E] underline cursor-pointer">The Terms And Conditions</span>
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pt-4 flex flex-col gap-3">
        <Button
          className="w-full"
          disabled={!agreed}
          onClick={handleSubmit}
          aria-label="Submit"
        >
          Submit
        </Button>
        <button
          onClick={() => navigate('/enrolment/step-3')}
          className="text-[#2DB87E] text-sm font-medium flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          aria-label="Previous Step"
        >
          <ChevronLeft size={14} />
          Previous Step
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- src/__tests__/enrolment/EnrolmentStep4Page.test.jsx
```
Expected: 11 passed

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EnrolmentStep4Page submission confirmation screen"
```

---

## Task 11: Wire up routes + ProfilePage button

**Files:**
- Modify: `littlepay-wallet/src/App.jsx`
- Modify: `littlepay-wallet/src/pages/ProfilePage.jsx`

- [ ] **Step 1: Update App.jsx to add enrolment routes**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { LangProvider } from './context/LangContext.jsx'
import { EnrolmentProvider } from './context/EnrolmentContext.jsx'
import { IPhoneFrame } from './components/layout/IPhoneFrame.jsx'
import { LoginPage }            from './pages/LoginPage.jsx'
import { CardsPage }            from './pages/CardsPage.jsx'
import { HomePage }             from './pages/HomePage.jsx'
import { OrderCompletePage }    from './pages/OrderCompletePage.jsx'
import { ProfilePage }          from './pages/ProfilePage.jsx'
import { EnrolmentIntroPage }   from './pages/enrolment/EnrolmentIntroPage.jsx'
import { EnrolmentStep1Page }   from './pages/enrolment/EnrolmentStep1Page.jsx'
import { EnrolmentStep2Page }   from './pages/enrolment/EnrolmentStep2Page.jsx'
import { EnrolmentStep3Page }   from './pages/enrolment/EnrolmentStep3Page.jsx'
import { EnrolmentStep4Page }   from './pages/enrolment/EnrolmentStep4Page.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <IPhoneFrame>
          <EnrolmentProvider>
            <Routes>
              <Route path="/"                element={<Navigate to="/login" replace />} />
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/cards"           element={<RequireAuth><CardsPage /></RequireAuth>} />
              <Route path="/home"            element={<RequireAuth><HomePage /></RequireAuth>} />
              <Route path="/order-complete"  element={<RequireAuth><OrderCompletePage /></RequireAuth>} />
              <Route path="/profile"         element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/enrolment"       element={<RequireAuth><EnrolmentIntroPage /></RequireAuth>} />
              <Route path="/enrolment/step-1" element={<RequireAuth><EnrolmentStep1Page /></RequireAuth>} />
              <Route path="/enrolment/step-2" element={<RequireAuth><EnrolmentStep2Page /></RequireAuth>} />
              <Route path="/enrolment/step-3" element={<RequireAuth><EnrolmentStep3Page /></RequireAuth>} />
              <Route path="/enrolment/step-4" element={<RequireAuth><EnrolmentStep4Page /></RequireAuth>} />
              <Route path="*"                element={<Navigate to="/" replace />} />
            </Routes>
          </EnrolmentProvider>
        </IPhoneFrame>
      </BrowserRouter>
    </LangProvider>
  )
}
```

- [ ] **Step 2: Wire "Enrol for Concession" button in ProfilePage.jsx**

In `src/pages/ProfilePage.jsx`, update the `handleReset` function and the `BadgePercent` menu item's `onClick`:
```jsx
<MenuItem icon={BadgePercent} label="Enrol for Concession" onClick={() => navigate('/enrolment')} />
```

- [ ] **Step 3: Run all enrolment tests together**

```bash
cd littlepay-wallet && npm run test:run -- src/__tests__/enrolment/
```
Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: wire enrolment routes and profile button"
```

---

## Self-Review

**Spec coverage:**
- ✅ Intro screen (screen 1) — EnrolmentIntroPage
- ✅ Step 1 Entitlement — Student/Senior radio, no Details toggle (removed per user answer)
- ✅ Step 2 Identity Verification — SheerID mock form + verified state
- ✅ SheerID form fields — first/last name, DOB, postal code, email, marketing checkbox
- ✅ Step 3 Link Card — "+ Assign a card" → CardAssignModal → card summary
- ✅ Card form — name, number (formatted), expiry, CVV, Apple Pay
- ✅ Step 4 Submission — all 4 summary rows, T&C checkbox, Submit → /profile
- ✅ Hardcoded operator "Transit System"
- ✅ Masked card number + edit button → step-3
- ✅ "Back to Start" → /enrolment (intro)
- ✅ "Previous Step" on each step
- ✅ New route `/enrolment` (not a bottom sheet)
- ✅ Submit resets enrolment state, navigates to /profile
- ✅ TDD: every component has tests written before implementation
- ✅ EnrolmentProvider wraps routes so state is shared across steps
