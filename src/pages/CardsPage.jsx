// src/pages/CardsPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { PageShell }   from '../components/layout/PageShell.jsx'
import { CardChip }    from '../components/card/CardChip.jsx'
import { CardActions } from '../components/card/CardActions.jsx'
import { Badge }       from '../components/ui/Badge.jsx'
import { cards }       from '../data/cards.js'
import {
  useCardsStore,
  addExtraCard,
  buildNewCard,
  getCardActive,
  setCardActive,
  deleteCard,
  getCardBalance,
} from '../utils/cardsStore.js'
import { useLang }        from '../context/LangContext.jsx'
import { LangToggle }        from '../components/ui/LangToggle.jsx'
import { NotificationBell } from '../components/ui/NotificationBell.jsx'
import { HamburgerMenu }    from '../components/layout/HamburgerMenu.jsx'
import { CardTypeModal }    from '../components/card/CardTypeModal.jsx'

export function CardsPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const state = useCardsStore()
  const cardList = [
    ...cards.filter((c) => !state.deletedSeedIds.has(c.id)),
    ...state.extraCards,
  ]
  const [managingId, setManagingId] = useState(null)
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [ordering, setOrdering]   = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const orderTimerRef = useRef(null)
  const deleteTimersRef = useRef(new Set())
  const orderingRef = useRef(false)

  useEffect(() => () => {
    clearTimeout(orderTimerRef.current)
    deleteTimersRef.current.forEach((id) => clearTimeout(id))
    deleteTimersRef.current.clear()
  }, [])

  function handleOrderNew() {
    if (orderingRef.current) return
    setShowTypeModal(true)
  }

  function handleTypeConfirm(type) {
    if (orderingRef.current) return
    orderingRef.current = true
    setShowTypeModal(false)
    setOrdering(true)
    orderTimerRef.current = setTimeout(() => {
      const newCard = buildNewCard(type)
      addExtraCard(newCard)
      orderingRef.current = false
      setOrdering(false)
      navigate('/order-complete', { state: { cardType: type } })
    }, 1500)
  }

  function handleDelete(cardId) {
    setManagingId(null)
    setDeletingIds((prev) => new Set([...prev, cardId]))
    const timer = setTimeout(() => {
      deleteCard(cardId)
      setDeletingIds((prev) => { const s = new Set(prev); s.delete(cardId); return s })
      deleteTimersRef.current.delete(timer)
    }, 400)
    deleteTimersRef.current.add(timer)
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-12 pb-4">
        <HamburgerMenu />
        <h1 className="absolute inset-x-0 text-center text-[#1A1F2E] text-lg font-bold pointer-events-none">{t.yourCards} ({cardList.length})</h1>
        <div className="flex items-center gap-[5px]">
          <LangToggle />
          <NotificationBell />
        </div>
      </div>

      {/* Card list */}
      <div className={`flex flex-col px-5 ${cardList.length >= 3 ? 'pb-32' : 'pb-6'}`}>
        {cardList.map((card) => {
          const managing = managingId === card.id
          const deleting = deletingIds.has(card.id)
          const active = getCardActive(card.id)
          return (
            <div
              key={card.id}
              data-card-container
              data-deleting={deleting ? 'true' : undefined}
              style={{
                overflow: 'hidden',
                maxHeight: deleting ? '0' : '600px',
                marginBottom: deleting ? '0' : '16px',
                transition: 'max-height 0.35s ease 0.15s, margin-bottom 0.35s ease 0.15s',
              }}
            >
            <div
              style={{
                opacity: deleting ? 0 : 1,
                transform: deleting ? 'translateX(-24px) scale(0.97)' : 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                {card.status === 'new' ? <Badge status="new" /> : <span />}
                {/* Active / Deactivated toggle */}
                <button
                  role="switch"
                  aria-checked={active}
                  onClick={() => setCardActive(card.id, !active)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-full"
                >
                  <span className={`text-xs font-medium transition-colors duration-150 ${active ? 'text-[#2DB87E]' : 'text-[#6B7280]'}`}>
                    {active ? 'Active' : 'Deactivated'}
                  </span>
                  <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${active ? 'bg-[#2DB87E]' : 'bg-[#D1D5DB]'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
              <CardChip
                card={card}
                displayPan={`*******${card.panSuffix ?? card.panFull.replace(/\s/g, '').slice(-5)}`}
                balance={getCardBalance(card.id, card.balance)}
                flipped={managing}
                isActive={active}
                onFlipBack={() => setManagingId(null)}
                onDelete={() => handleDelete(card.id)}
              />
              <CardActions
                card={card}
                onManage={() => setManagingId(managing ? null : card.id)}
              />
            </div>
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
