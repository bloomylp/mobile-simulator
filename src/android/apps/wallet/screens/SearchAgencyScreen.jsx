// Screen 3 — Search agency. No virtual keyboard, empty query by default.
import { useState } from 'react'
import { ArrowLeft, X, MapPin } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AGENCIES } from '../data/walletSeed.js'
import { AppSurface, IconButton, TEXT_PRIMARY, TEXT_MUTED, SUBTLE_BG } from '../ui/primitives.jsx'

function AgencyRow({ agency, onSelect }) {
  return (
    <button
      onClick={agency.tappable ? onSelect : undefined}
      disabled={!agency.tappable}
      aria-label={agency.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        background: 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: agency.tappable ? 'pointer' : 'default',
        opacity: agency.tappable ? 1 : 0.85,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: SUBTLE_BG,
        color: TEXT_PRIMARY,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY }}>{agency.label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: TEXT_MUTED }}>{agency.subLabel}</p>
      </div>
    </button>
  )
}

export function SearchAgencyScreen() {
  const { back, goTo } = useWalletFlow()
  const [query, setQuery] = useState('')
  const filtered = query
    ? AGENCIES.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : AGENCIES

  return (
    <AppSurface>
      <div style={{ padding: '56px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 999,
          background: SUBTLE_BG,
        }}>
          <IconButton onClick={back} ariaLabel="Back" style={{ width: 28, height: 28 }}>
            <ArrowLeft size={20} aria-hidden="true" />
          </IconButton>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 15,
              color: TEXT_PRIMARY,
              fontFamily: 'Roboto, sans-serif',
            }}
            aria-label="Search transit agencies"
          />
          {query && (
            <IconButton onClick={() => setQuery('')} ariaLabel="Clear" style={{ width: 28, height: 28 }}>
              <X size={18} aria-hidden="true" />
            </IconButton>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
        {filtered.map((agency) => (
          <AgencyRow key={agency.id} agency={agency} onSelect={() => goTo('insights')} />
        ))}
      </div>
    </AppSurface>
  )
}
