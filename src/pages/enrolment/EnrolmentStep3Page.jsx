// src/pages/enrolment/EnrolmentStep3Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CreditCard } from 'lucide-react'
import { Button } from '../../components/ui/Button.jsx'
import { EnrolmentProgress } from '../../components/enrolment/EnrolmentProgress.jsx'
import { CardAssignModal } from '../../components/enrolment/CardAssignModal.jsx'
import { useEnrolment } from '../../context/EnrolmentContext.jsx'
import { cards as allCards } from '../../data/cards.js'
import { getExtraCards } from '../../utils/cardsStore.js'

export function EnrolmentStep3Page() {
  const navigate = useNavigate()
  const { setCard } = useEnrolment()
  const [showModal, setShowModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  const availableCards = [...allCards, ...getExtraCards()]

  function handleSelect(cardId) {
    const card = availableCards.find(c => c.id === cardId)
    setSelectedCard(card)
    setCard(card)
    setShowModal(false)
  }

  function handleContinue() {
    navigate('/enrolment/step-4')
  }

  return (
    <>
      <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-8">
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
            <h2 className="text-[#1A1F2E] text-sm font-bold mb-1">STEP 3 - Link your Card</h2>
            <p className="text-[#6B7280] text-xs mb-4">Select the card to apply your concession discount to.</p>

            {selectedCard ? (
              <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3">
                <CreditCard size={20} className="text-[#2DB87E] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#1A1F2E] text-sm font-medium">{selectedCard.name}</span>
                  <span className="text-[#6B7280] text-xs">•••• {selectedCard.panSuffix}</span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="ml-auto text-[#2DB87E] text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded"
                  aria-label="Select Card"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-between cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#2DB87E] transition-colors duration-150 min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                aria-label="Select Card"
              >
                <span className="text-[#6B7280] text-sm">No card selected</span>
                <ChevronLeft size={16} className="text-[#6B7280] rotate-180" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto px-5 pt-8 flex flex-col gap-3">
          <Button className="w-full" disabled={!selectedCard} onClick={handleContinue}>
            Continue
          </Button>
          <button
            onClick={() => navigate('/enrolment/step-2')}
            className="text-[#2DB87E] text-sm font-medium flex items-center justify-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px]"
            aria-label="Previous Step"
          >
            <ChevronLeft size={14} />
            Previous Step
          </button>
        </div>
      </div>

      {showModal && (
        <CardAssignModal
          cards={availableCards}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
