// src/pages/enrolment/EnrolmentStep2Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { SheerIDModal } from '../../components/enrolment/SheerIDModal.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

export function EnrolmentStep2Page() {
  const navigate = useNavigate()
  const { setVerified } = useEnrolment()
  const [showModal, setShowModal] = useState(false)

  function handleVerified() {
    setVerified(true)
    setShowModal(false)
    navigate('/enrolment/step-3')
  }

  return (
    <>
      <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
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
            <p className="text-[#6B7280] text-xs mb-4">Choose a provider to verify your eligibility.</p>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-between cursor-pointer border-2 border-transparent hover:border-[#2DB87E] transition-colors duration-150 min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
              aria-label="sheerId"
            >
              <span className="text-[#1A1F2E] text-sm font-medium">SheerID</span>
              <ChevronLeft size={16} className="text-[#6B7280] rotate-180" />
            </button>
          </div>

          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#F59E0B] mt-0.5 shrink-0" />
            <p className="text-[#78350F] text-xs">
              Do not close your browser during enrolment or your progress may be lost.
            </p>
          </div>

          <p className="text-[#9CA3AF] text-xs text-center">
            By continuing you agree to our{' '}
            <span className="text-[#2DB87E] underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>

        <div className="mt-auto px-5 pt-8">
          <button
            onClick={() => navigate('/enrolment/step-1')}
            className="text-[#2DB87E] text-sm font-medium flex items-center justify-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] w-full"
            aria-label="Previous Step"
          >
            <ChevronLeft size={14} />
            Previous Step
          </button>
        </div>
      </div>

      {showModal && (
        <SheerIDModal
          onVerified={handleVerified}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
