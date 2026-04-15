import { describe, test, expect } from 'vitest'
import {
  getCardActive, setCardActive,
  topUpCard, getCardBalance,
  getExtraCards, addExtraCard, buildNewCard,
} from '../utils/cardsStore.js'

// Module-level state is shared across tests in this file.
// Use unique IDs per test to avoid cross-test interference.

describe('getCardActive / setCardActive', () => {
  test('defaults to true for an unknown card', () => {
    expect(getCardActive('unknown-card-001')).toBe(true)
  })

  test('setCardActive false marks card as deactivated', () => {
    setCardActive('toggle-card-001', false)
    expect(getCardActive('toggle-card-001')).toBe(false)
  })

  test('setCardActive true re-activates a deactivated card', () => {
    setCardActive('toggle-card-002', false)
    setCardActive('toggle-card-002', true)
    expect(getCardActive('toggle-card-002')).toBe(true)
  })

  test('each card has independent active state', () => {
    setCardActive('card-A', false)
    setCardActive('card-B', true)
    expect(getCardActive('card-A')).toBe(false)
    expect(getCardActive('card-B')).toBe(true)
  })
})

describe('topUpCard / getCardBalance', () => {
  test('getCardBalance returns defaultBalance when card has no top-ups', () => {
    expect(getCardBalance('fresh-card-001', 100)).toBe(100)
  })

  test('topUpCard increases balance by the top-up amount', () => {
    topUpCard('topup-card-001', 20)
    expect(getCardBalance('topup-card-001', 0)).toBe(20)
  })

  test('multiple top-ups accumulate', () => {
    topUpCard('topup-card-002', 10)
    topUpCard('topup-card-002', 15)
    expect(getCardBalance('topup-card-002', 0)).toBe(25)
  })

  test('top-up is isolated per card', () => {
    topUpCard('topup-card-003', 50)
    expect(getCardBalance('topup-card-004', 0)).toBe(0)
  })
})

describe('buildNewCard', () => {
  test('returns a card with required fields', () => {
    const card = buildNewCard()
    expect(card).toMatchObject({
      id: expect.stringContaining('card-new-'),
      name: expect.any(String),
      pan: expect.stringContaining('••••'),
      expiry: expect.stringMatching(/^\d{2}\/\d{2}$/),
      status: 'new',
      balance: 0,
      spent: 0,
    })
  })

  test('defaults cardType to digital', () => {
    expect(buildNewCard().cardType).toBe('digital')
  })

  test('accepts a custom cardType', () => {
    expect(buildNewCard('physical').cardType).toBe('physical')
  })

  test('each call produces a unique id', () => {
    const a = buildNewCard()
    const b = buildNewCard()
    expect(a.id).not.toBe(b.id)
  })
})

describe('addExtraCard / getExtraCards', () => {
  test('getExtraCards includes cards added via addExtraCard', () => {
    const card = buildNewCard()
    addExtraCard(card)
    expect(getExtraCards()).toContain(card)
  })
})
