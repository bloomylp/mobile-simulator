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
              <div className="flex items-center w-full">
                <div className={`flex-1 h-px ${i === 0 ? 'invisible' : complete || active ? 'bg-[#2DB87E]' : 'bg-gray-200'}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0
                  ${complete ? 'bg-[#2DB87E] border-[#2DB87E]' : active ? 'border-[#2DB87E] bg-white' : 'border-gray-300 bg-white'}`}>
                  {complete
                    ? <Check size={14} className="text-white" strokeWidth={3} aria-hidden="true" />
                    : <span className={`text-xs font-bold ${active ? 'text-[#2DB87E]' : 'text-gray-400'}`}>{n}</span>
                  }
                </div>
                <div className={`flex-1 h-px ${i === STEPS.length - 1 ? 'invisible' : complete ? 'bg-[#2DB87E]' : 'bg-gray-200'}`} />
              </div>
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
