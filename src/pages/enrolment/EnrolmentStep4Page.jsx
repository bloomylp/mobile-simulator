// src/pages/enrolment/EnrolmentStep4Page.jsx
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle, User, CreditCard } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-3 min-h-[56px]">
      <Icon size={18} className="text-[#2DB87E] shrink-0" />
      <div className="flex flex-col flex-1">
        <span className="text-[#6B7280] text-xs">{label}</span>
        <span className="text-[#1A1F2E] text-sm font-medium capitalize">{value}</span>
      </div>
    </div>
  )
}

export function EnrolmentStep4Page() {
  const navigate = useNavigate()
  const { state } = useEnrolment()
  const { group, verified, card } = state
  const canSubmit = Boolean(group && verified && card)

  function handleSubmit() {
    if (!canSubmit) return
    navigate('/enrolment/complete')
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
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
          <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 4 - Review & Submit</h2>
          <p className="text-[#6B7280] text-xs mb-4">Check your details before submitting.</p>

          <div className="flex flex-col gap-3">
            {group && (
              <SummaryRow icon={User} label="Concession Group" value={group} />
            )}

            <SummaryRow
              icon={CheckCircle}
              label="Identity Verification"
              value={verified ? 'Verified' : 'Not verified'}
            />

            {card && (
              <SummaryRow
                icon={CreditCard}
                label="Linked Card"
                value={`${card.name} •••• ${card.panSuffix}`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pt-8 flex flex-col gap-3">
        <Button className="w-full" disabled={!canSubmit} onClick={handleSubmit} aria-label="Submit">
          Submit Application
        </Button>
        <button
          onClick={() => navigate('/enrolment/step-3')}
          className="text-[#2DB87E] text-sm font-medium flex items-center justify-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
          aria-label="Previous Step"
        >
          <ChevronLeft size={14} />
          Previous Step
        </button>
      </div>
    </div>
  )
}
