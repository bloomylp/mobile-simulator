// src/pages/enrolment/EnrolmentIntroPage.jsx
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'

const STEPS_OVERVIEW = [
  { n: 1, title: 'Entitlement',             desc: 'Select a concession group or cohort you want to enrol in.' },
  { n: 2, title: 'Identity Verification',   desc: 'Identity verification is processed by our integration partners.' },
  { n: 3, title: 'Select your travel card', desc: 'Select or add a card you want to enrol. This card must be presented when travelling.' },
  { n: 4, title: 'Submission',              desc: 'Confirm all your details are correct to travel.' },
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
