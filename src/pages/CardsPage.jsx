// src/pages/CardsPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { PageShell }   from '../components/layout/PageShell.jsx'
import { BottomNav }   from '../components/layout/BottomNav.jsx'
import { CardChip }    from '../components/card/CardChip.jsx'
import { CardActions } from '../components/card/CardActions.jsx'
import { Badge }       from '../components/ui/Badge.jsx'
import { cards }       from '../data/cards.js'

export function CardsPage() {
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleOrderNew() {
    setOrdering(true)
    timerRef.current = setTimeout(() => {
      setOrdering(false)
      navigate('/order-complete')
    }, 1500)
  }

  return (
    <PageShell className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-[#1A1F2E] text-lg font-bold">Your Cards ({cards.length})</h1>
        <button
          className="text-[#2DB87E] text-sm font-semibold cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] px-2"
          aria-label="Add new card"
        >
          + Add New
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-4 px-5">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <Badge status={card.status} />
            </div>
            <CardChip card={card} />
            <CardActions card={card} />
          </div>
        ))}

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
          {ordering ? 'Ordering\u2026' : 'Order New Card'}
        </button>
      </div>

      <BottomNav />
    </PageShell>
  )
}
