// src/pages/CardsPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { PageShell }   from '../components/layout/PageShell.jsx'
import { CardChip }    from '../components/card/CardChip.jsx'
import { CardActions } from '../components/card/CardActions.jsx'
import { Badge }       from '../components/ui/Badge.jsx'
import { cards }       from '../data/cards.js'
import { getExtraCards, addExtraCard, buildNewCard, getCardActive, setCardActive } from '../utils/cardsStore.js'
import { useLang }        from '../context/LangContext.jsx'
import { LangToggle }     from '../components/ui/LangToggle.jsx'
import { CardTypeModal }  from '../components/card/CardTypeModal.jsx'

function randomLast4() {
  return String(1000 + Math.floor(Math.random() * 9000))
}
function randomGroup() {
  return String(1000 + Math.floor(Math.random() * 9000))
}

export function CardsPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [cardList, setCardList]   = useState(() => [...cards, ...getExtraCards()])
  const [managingId, setManagingId] = useState(null)
  const [ordering, setOrdering]   = useState(false)
  const [, forceRender] = useState(0)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const timerRef = useRef(null)
  const orderingRef = useRef(false)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleOrderNew() {
    if (orderingRef.current) return
    setShowTypeModal(true)
  }

  function handleTypeConfirm(type) {
    if (orderingRef.current) return
    orderingRef.current = true
    setShowTypeModal(false)
    setOrdering(true)
    timerRef.current = setTimeout(() => {
      const newCard = buildNewCard(type)
      addExtraCard(newCard)
      setCardList([...cards, ...getExtraCards()])
      orderingRef.current = false
      setOrdering(false)
      navigate('/order-complete')
    }, 1500)
  }

  function handleRefresh(cardId) {
    // Flip back first, then update card details after animation finishes
    setManagingId(null)
    setTimeout(() => {
      const last4      = randomLast4()
      const newPan     = `•••• •••• •••• ${last4}`
      const newFull    = `${randomGroup()} ${randomGroup()} ${randomGroup()} ${last4}`
      const newSuffix  = String(Math.floor(10000 + Math.random() * 90000))
      const month      = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')
      const year       = String(new Date().getFullYear() + 2 + Math.floor(Math.random() * 4)).slice(-2)
      setCardList((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, pan: newPan, panFull: newFull, panSuffix: newSuffix, expiry: `${month}/${year}` }
            : c
        )
      )
    }, 570) // slightly after the 0.55s CSS transition
  }

  function handleDelete(cardId) {
    setManagingId(null)
    setCardList((prev) => prev.filter((c) => c.id !== cardId))
  }

  return (
    <PageShell className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-[#1A1F2E] text-lg font-bold">{t.yourCards} ({cardList.length})</h1>
        <LangToggle />
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-4 px-5">
        {cardList.map((card) => {
          const managing = managingId === card.id
          return (
            <div key={card.id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <Badge status={card.status} />
                {/* Active / Deactivated toggle */}
                <button
                  role="switch"
                  aria-checked={getCardActive(card.id)}
                  onClick={() => { setCardActive(card.id, !getCardActive(card.id)); forceRender((n) => n + 1) }}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-full"
                >
                  <span className={`text-xs font-medium transition-colors duration-150 ${getCardActive(card.id) ? 'text-[#2DB87E]' : 'text-[#6B7280]'}`}>
                    {getCardActive(card.id) ? 'Active' : 'Deactivated'}
                  </span>
                  <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${getCardActive(card.id) ? 'bg-[#2DB87E]' : 'bg-[#D1D5DB]'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${getCardActive(card.id) ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
              <CardChip
                card={card}
                displayPan={`*******${card.panSuffix ?? card.panFull.replace(/\s/g, '').slice(-5)}`}
                flipped={managing}
                isActive={getCardActive(card.id)}
                onFlipBack={() => setManagingId(null)}
                onRefresh={() => handleRefresh(card.id)}
                onDelete={() => handleDelete(card.id)}
              />
              <CardActions
                card={card}
                onManage={() => setManagingId(card.id)}
              />
            </div>
          )
        })}

        {/* Order New Card row */}
        <button
          onClick={handleOrderNew}
          disabled={ordering}
          className="flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 py-4 text-[#6B7280] text-sm font-medium cursor-pointer hover:border-[#2DB87E] hover:text-[#2DB87E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] disabled:opacity-60 min-h-[56px]"
          aria-label="Order a new card"
        >
          {ordering
            ? <Loader2 size={16} className="animate-spin text-[#2DB87E]" />
            : <Plus size={16} />}
          {ordering ? t.ordering : t.orderNewCard}
        </button>
      </div>

      {showTypeModal && (
        <CardTypeModal
          onConfirm={handleTypeConfirm}
          onClose={() => setShowTypeModal(false)}
        />
      )}
    </PageShell>
  )
}
