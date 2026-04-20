// src/pages/PromotionsPage.jsx
import { PageShell }        from '../components/layout/PageShell.jsx'
import { HamburgerMenu }    from '../components/layout/HamburgerMenu.jsx'
import { LangToggle }       from '../components/ui/LangToggle.jsx'
import { NotificationBell } from '../components/ui/NotificationBell.jsx'
import { useLang }          from '../context/LangContext.jsx'

const PROMOTIONS = [
  {
    id: 'promo-1',
    label: 'Offer 1',
    title: '50% Pass',
    description: 'You are entitled to a 50% off pass.',
    cta: 'Click here to purchase your pass',
  },
  {
    id: 'promo-2',
    label: 'Offer 2',
    title: 'Receive 20% off your next week of travel',
    description: null,
    cta: 'Click here to receive your discounted travel',
  },
]

function PromotionCard({ label, title, description, cta }) {
  return (
    <div
      data-testid="promotion-card"
      style={{ background: 'linear-gradient(135deg, #2DB87E 0%, #1A7A50 100%)' }}
      className="rounded-2xl shadow-sm p-5 flex flex-col gap-3"
    >
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <h2 className="text-white text-base font-bold leading-snug">{title}</h2>
      {description && (
        <p className="text-white/85 text-sm leading-relaxed">{description}</p>
      )}
      <button
        aria-label={cta}
        className="mt-1 self-start bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {cta}
      </button>
    </div>
  )
}

export function PromotionsPage() {
  const { t } = useLang()

  return (
    <PageShell className="pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-12 pb-4">
        <HamburgerMenu />
        <h1 className="absolute inset-x-0 text-center text-[#1A1F2E] text-lg font-bold pointer-events-none">
          {t.promotions}
        </h1>
        <div className="flex items-center gap-[5px]">
          <LangToggle />
          <NotificationBell />
        </div>
      </div>

      {/* Promotion cards */}
      <div className="flex flex-col gap-4 px-5 pt-2">
        {PROMOTIONS.map((p) => (
          <PromotionCard key={p.id} label={p.label} title={p.title} description={p.description} cta={p.cta} />
        ))}
      </div>

      {/* Mailing list sign-up */}
      <div className="mx-5 mt-4 bg-white rounded-2xl shadow-sm p-5">
        <p className="text-[#1A1F2E] text-sm font-bold mb-3">Sign up to our email mailing list</p>
        <label htmlFor="mailing-email" className="sr-only">Email</label>
        <input
          id="mailing-email"
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1F2E] placeholder-[#9CA3AF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] mb-3"
        />
        <button
          aria-label="Submit"
          className="w-full bg-[#2DB87E] hover:bg-[#1A7A50] text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
        >
          Submit
        </button>
      </div>
    </PageShell>
  )
}
