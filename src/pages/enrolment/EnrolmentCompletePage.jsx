// src/pages/enrolment/EnrolmentCompletePage.jsx
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'

export function EnrolmentCompletePage() {
  const navigate = useNavigate()
  const { resetEnrolment } = useEnrolment()

  function handleDone() {
    resetEnrolment()
    navigate('/profile')
  }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
      <CheckCircle size={72} className="text-[#2DB87E]" strokeWidth={1.25} />
      <div className="flex flex-col gap-2">
        <h1 className="text-[#1A1F2E] text-xl font-bold">Enrolment Complete!</h1>
        <p className="text-[#6B7280] text-sm">
          Your concession has been successfully registered. Discounts will be applied automatically on your next journey.
        </p>
      </div>
      <Button className="w-full max-w-xs" onClick={handleDone} aria-label="Done">
        Done
      </Button>
    </div>
  )
}
