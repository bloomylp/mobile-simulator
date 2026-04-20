// Screen 8/9 — Transit pass detail (Littlobus / Littlepay GTI).
import { ArrowLeft, MoreVertical, FileText, X, ChevronRight } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { useTripsStore, removeTrip } from '../data/androidTripsStore.js'
import { usePaymentIssueStore, hidePaymentIssue } from '../data/androidPaymentIssueStore.js'
import { AppSurface, IconButton, TEXT_PRIMARY, TEXT_MUTED, SUBTLE_BG, ACCENT } from '../ui/primitives.jsx'

function PaymentIssueBanner() {
  return (
    <div
      role="alert"
      style={{
        position: 'relative',
        background: '#FDECEC',
        border: '1px solid #F5C2C2',
        borderRadius: 16,
        padding: '14px 40px 14px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div aria-hidden="true" style={{
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#DC2626',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 1,
      }}>!</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#7F1D1D' }}>
          You have a payment issue
        </p>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: '#991B1B', fontWeight: 500 }}>Fix issue</span>
          <ChevronRight size={14} color="#991B1B" aria-hidden="true" />
        </div>
      </div>
      <button
        onClick={hidePaymentIssue}
        aria-label="Dismiss payment issue"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'white',
          border: '1px solid #F5C2C2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <X size={14} color="#991B1B" aria-hidden="true" />
      </button>
    </div>
  )
}

function TransitLoyaltyCard() {
  return (
    <div style={{
      background: '#0A0A0A',
      borderRadius: 14,
      padding: 16,
      color: 'white',
      position: 'relative',
      height: 140,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.2px' }}>
          little<span style={{ color: '#2DB87E' }}>pay</span>
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>Transit Loyalty Card</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div aria-hidden="true" style={{ width: 28, height: 22, borderRadius: 4, background: 'white' }} />
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden="true">
          <circle cx="6" cy="14" r="2.5" fill="white" />
          <path d="M12 8 Q18 14 12 20" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M18 4 Q28 14 18 24" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.75" />
          <path d="M24 0 Q38 14 24 28" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

function PaymentRow({ label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      background: SUBTLE_BG,
      borderRadius: 16,
    }}>
      <div aria-hidden="true" style={{
        width: 44, height: 32, borderRadius: 6,
        background: 'linear-gradient(135deg,#2C5E7F 0%, #142B46 100%)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 4,
      }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EB001B', marginRight: -3 }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#F79E1B' }} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: TEXT_MUTED }}>Connected payment method</p>
      </div>
    </div>
  )
}

const FARE_CAP = 10 // $10 daily cap — beyond this the rider has free travel

function capResetDateStr() {
  // Free travel is until end-of-today at 03:00 (cap reset).
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' 03:00'
}

export function TransitPassDetailScreen() {
  const { selectedPayment, back, goTo, passes } = useWalletFlow()
  const trips = useTripsStore()
  const paymentIssue = usePaymentIssueStore()
  const paymentLabel = selectedPayment ?? 'Mastercard •••• 4444'
  // Pass products purchased through Add Pass flow carry an `amount`.
  // Plain wallet-activation passes (no amount) are not rendered here.
  const purchasedPasses = passes.filter((p) => p.amount)

  // Fare cap accumulation — sum each trip's numeric value, cap pct at 100
  const totalSpend = trips.reduce((sum, t) => sum + (t.value ?? 0), 0)
  const capReached = totalSpend >= FARE_CAP
  const remaining = Math.max(0, FARE_CAP - totalSpend)
  const pctFill = Math.min(100, (totalSpend / FARE_CAP) * 100)
  const dateStr = capResetDateStr()
  let fareCapText
  if (trips.length === 0) {
    fareCapText = 'Start riding to see your fare cap progress towards free rides'
  } else if (capReached) {
    fareCapText = `You have free travel until\n${dateStr}`
  } else {
    fareCapText = `Spend $${remaining.toFixed(2)} more to have free travel until\n${dateStr}`
  }

  return (
    <AppSurface style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Top bar — never scrolls */}
      <div style={{ flexShrink: 0, padding: '56px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={back} ariaLabel="Back">
          <ArrowLeft size={22} aria-hidden="true" />
        </IconButton>
        <IconButton ariaLabel="More options">
          <MoreVertical size={22} aria-hidden="true" />
        </IconButton>
      </div>

      {/* Scrollable content — grows with trips, button stays pinned below */}
      <div data-scroll-region="true" style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {paymentIssue && <PaymentIssueBanner />}
        {/* Branded pass header */}
        <div style={{ background: SUBTLE_BG, borderRadius: 16, padding: 16 }}>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY, letterSpacing: '0.1px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2DB87E' }}>Littlobus</span>
            <span style={{ marginLeft: 8 }}>Littlepay GTI</span>
          </h1>
          <div style={{ marginTop: 14 }}>
            <TransitLoyaltyCard />
          </div>
        </div>

        <PaymentRow label={paymentLabel} />

        {/* Purchased pass products (accumulate across Add Pass flows — each renders as its own row) */}
        {purchasedPasses.map((p) => (
          <div key={p.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            background: SUBTLE_BG,
            borderRadius: 16,
          }}>
            <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, fontWeight: 500 }}>{p.brand ?? p.name}</p>
            <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY }}>{p.amount}</p>
          </div>
        ))}

        {/* Fare cap progress — accumulates as trips land, caps at $10 */}
        <div style={{ background: SUBTLE_BG, borderRadius: 16, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
            {fareCapText}
          </p>
          <div aria-hidden="true" style={{
            marginTop: 12,
            height: 6,
            borderRadius: 999,
            background: '#E5E7EB',
            overflow: 'hidden',
          }}>
            <div data-testid="fare-cap-bar-fill" style={{
              width: `${pctFill}%`,
              height: '100%',
              background: ACCENT,
            }} />
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ background: SUBTLE_BG, borderRadius: 16, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY }}>Recent activity</p>
          {trips.length === 0 ? (
            <>
              <p style={{ margin: '6px 0 16px', fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4 }}>
                No activity yet. When you start making transactions using this device, you'll find them here.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: '#EDE4D0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={28} color="#C4B393" strokeWidth={1.6} aria-hidden="true" />
                </div>
              </div>
            </>
          ) : (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {trips.map((trip, i) => (
                <button
                  key={i}
                  onClick={() => removeTrip(i)}
                  aria-label={`Remove ${trip.name}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingTop: i > 0 ? 12 : 8,
                    paddingBottom: 12,
                    borderTop: i > 0 ? '1px solid #E5E7EB' : 'none',
                    background: 'transparent',
                    border: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    padding: i > 0 ? '12px 0' : '8px 0 12px',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{trip.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: TEXT_MUTED }}>{trip.date}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{trip.amount}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add pass button — pinned at bottom, never scrolls */}
      <div style={{ flexShrink: 0, padding: '16px 20px 32px' }}>
        <button
          onClick={() => goTo('passlist')}
          aria-label="Add pass"
          style={{
            width: '100%',
            background: ACCENT,
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '14px 0',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
            letterSpacing: '0.2px',
          }}
        >
          Add pass
        </button>
      </div>
    </AppSurface>
  )
}
