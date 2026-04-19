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
  const { state, setGroup } = useEnrolment()
  const [selected, setSelected] = useState(state.group ?? null)

  function handleContinue() {
    setGroup(selected)
    navigate('/enrolment/step-2')
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
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
