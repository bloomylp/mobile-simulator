// src/pages/HomePage.jsx
import { useMemo, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { PageShell }          from '../components/layout/PageShell.jsx'
import { CardChip }           from '../components/card/CardChip.jsx'
import { DateRangeFilter }    from '../components/transaction/DateRangeFilter.jsx'
import { TransactionList }    from '../components/transaction/TransactionList.jsx'
import { TopUpSheet }         from '../components/topup/TopUpSheet.jsx'
import { Button }             from '../components/ui/Button.jsx'
import { cards }              from '../data/cards.js'
import { getExtraCards, topUpCard, getCardBalance, getCardActive } from '../utils/cardsStore.js'
import { transactions }       from '../data/transactions.js'
import { filterTransactions } from '../utils/filterTransactions.js'
import { useLang }            from '../context/LangContext.jsx'
import { LangToggle }         from '../components/ui/LangToggle.jsx'

export function HomePage() {
  // Recompute on each mount so newly ordered cards appear after navigating back
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allCards = useMemo(() => [...cards, ...getExtraCards()], [])
  const [showTopUp, setShowTopUp]     = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange]     = useState({ fromDate: '', toDate: '' })
  const [txList, setTxList]           = useState(() => [...transactions])
  const [activeIdx, setActiveIdx]     = useState(0)
  const [balances, setBalances] = useState(() =>
    Object.fromEntries(allCards.map((c) => [c.id, getCardBalance(c.id, c.balance)]))
  )
  const scrollRef = useRef(null)
  const dragRef   = useRef({ down: false, startX: 0, startScroll: 0 })

  const { t } = useLang()
  const activeCard    = allCards[activeIdx] ?? allCards[0]
  const activeBalance = balances[activeCard.id] ?? activeCard.balance
  const filtered      = filterTransactions(txList, dateRange.fromDate, dateRange.toDate)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setActiveIdx(Math.round(el.scrollLeft / el.offsetWidth))
  }

  function onPointerDown(e) {
    const el = scrollRef.current
    dragRef.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft }
    el.style.scrollSnapType = 'none'
    el.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragRef.current.down) return
    const dx = e.clientX - dragRef.current.startX
    scrollRef.current.scrollLeft = dragRef.current.startScroll - dx
  }

  function onPointerUp() {
    if (!dragRef.current.down) return
    dragRef.current.down = false
    const el = scrollRef.current
    // Snap to nearest card
    const cardWidth = el.offsetWidth
    const nearest = Math.round(el.scrollLeft / cardWidth)
    el.style.scrollSnapType = ''
    el.scrollTo({ left: nearest * cardWidth, behavior: 'smooth' })
  }

  function handleTopUp(amount) {
    const cardId = activeCard.id
    topUpCard(cardId, amount)
    setBalances((prev) => ({ ...prev, [cardId]: (prev[cardId] ?? activeCard.balance) + amount }))

    const now  = new Date()
    const pad  = (n) => String(n).padStart(2, '0')
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    setTxList((prev) => [
      { id: `topup-${Date.now()}`, date, type: 'topup', route: '', operator: 'Money Loaded', status: 'complete', amount, discounted: false },
      ...prev,
    ])
  }

  return (
    <PageShell className="pb-20">
      {/* ── Green header ── */}
      <div style={{ background: 'linear-gradient(160deg, #2DB87E 0%, #1A7A50 100%)' }}>
        <div className="flex items-center justify-between px-5 pt-10 pb-4">
          <p className="text-white/80 text-sm font-medium">{t.welcome}</p>
          <LangToggle light />
        </div>

        {/* Card carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {allCards.map((card, i) => (
            <div key={card.id} className="w-full flex-shrink-0 snap-center px-5">
              <div className="relative">
                <CardChip
                  card={card}
                  cardLabel={i === 0 ? 'Primary Card' : 'Additional Card'}
                  displayPan={`*******${card.panSuffix ?? card.panFull.replace(/\s/g, '').slice(-5)}`}
                  isActive={getCardActive(card.id)}
                />
                {!getCardActive(card.id) && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none">
                    <span className="text-white font-bold text-lg tracking-widest uppercase opacity-90 drop-shadow">
                      Deactivated
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        {allCards.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
            {allCards.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Balance */}
        <div className="px-5 mt-5 mb-1">
          <p className="text-white text-3xl font-bold tabular-nums">
            ${activeBalance.toFixed(2)}
            <span className="text-white/70 text-lg font-medium ml-2">{t.balance}</span>
          </p>
        </div>

        {/* Load Money */}
        <div className="px-5 pb-8 mt-4">
          <Button
            variant="secondary"
            className="w-full bg-white/15 text-white border-white/30 hover:bg-white/25"
            onClick={() => setShowTopUp(true)}
          >
            {t.loadMoney}
          </Button>
        </div>
      </div>

      {/* ── Transactions panel ── */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[#1A1F2E] text-base font-bold">{t.transactions}</h2>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded px-2 min-h-[44px] transition-colors duration-150 ${
              showFilters ? 'text-[#2DB87E]' : 'text-[#6B7280] hover:text-[#2DB87E]'
            }`}
            aria-pressed={showFilters}
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
            {t.searchFilters}
          </button>
        </div>

        {showFilters && (
          <DateRangeFilter
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            onChange={setDateRange}
          />
        )}

        <TransactionList transactions={filtered} />
      </div>

      {showTopUp && <TopUpSheet onClose={() => setShowTopUp(false)} onTopUp={handleTopUp} />}
    </PageShell>
  )
}
