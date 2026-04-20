// src/pages/enrolment/EnrolmentCompletePage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'
import { useConcession } from '../../context/ConcessionContext.jsx'

export function EnrolmentCompletePage() {
  const navigate = useNavigate()
  const { state, resetEnrolment } = useEnrolment()
  const { setEnrolled, setConcessionData } = useConcession()
  const isComplete = Boolean(state.group && state.verified && state.card)

  // Guard against direct navigation with incomplete state — redirect to intro.
  useEffect(() => {
    if (!isComplete) navigate('/enrolment', { replace: true })
  }, [isComplete, navigate])

  function handleDone() {
    if (!isComplete) return
    setConcessionData(state.group, state.card)
    setEnrolled(true)
    resetEnrolment()
    navigate('/concession')
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
