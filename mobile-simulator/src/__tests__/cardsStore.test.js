import { describe, test, expect, beforeEach, vi } from 'vitest'
import {
  getCardActive, setCardActive,
  topUpCard, getCardBalance,
  getExtraCards, addExtraCard, removeExtraCard, buildNewCard,
  addTopUpTx, getTopUpTxList,
  resetCardsStore,
  subscribe, getSnapshot, deleteCard,
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

describe('removeExtraCard', () => {
  beforeEach(() => resetCardsStore())

  test('removes the card with the given id', () => {
    const card = buildNewCard()
    addExtraCard(card)
    removeExtraCard(card.id)
    expect(getExtraCards()).not.toContain(card)
  })

  test('leaves other cards intact', () => {
    const a = buildNewCard()
    const b = buildNewCard()
    addExtraCard(a)
    addExtraCard(b)
    removeExtraCard(a.id)
    expect(getExtraCards()).not.toContain(a)
    expect(getExtraCards()).toContain(b)
  })

  test('is a no-op when id does not exist', () => {
    addExtraCard(buildNewCard())
    expect(() => removeExtraCard('nonexistent-id')).not.toThrow()
    expect(getExtraCards()).toHaveLength(1)
  })
})

describe('addTopUpTx / getTopUpTxList', () => {
  beforeEach(() => resetCardsStore())

  test('getTopUpTxList returns empty array initially', () => {
    expect(getTopUpTxList()).toEqual([])
  })

  test('addTopUpTx stores a transaction', () => {
    const tx = { id: 'topup-1', date: '2026-04-15T10:00:00', type: 'topup', operator: 'Balance Loaded', amount: 20 }
    addTopUpTx(tx)
    expect(getTopUpTxList()).toContainEqual(tx)
  })

  test('most recent top-up appears first in list', () => {
    const tx1 = { id: 'topup-1', amount: 10 }
    const tx2 = { id: 'topup-2', amount: 20 }
    addTopUpTx(tx1)
    addTopUpTx(tx2)
    expect(getTopUpTxList()[0]).toEqual(tx2)
    expect(getTopUpTxList()[1]).toEqual(tx1)
  })

  test('multiple top-ups all persist', () => {
    addTopUpTx({ id: 'topup-a', amount: 10 })
    addTopUpTx({ id: 'topup-b', amount: 50 })
    expect(getTopUpTxList()).toHaveLength(2)
  })
})

describe('resetCardsStore', () => {
  test('clears top-up transactions', () => {
    addTopUpTx({ id: 'topup-reset-1', amount: 30 })
    resetCardsStore()
    expect(getTopUpTxList()).toEqual([])
  })

  test('clears extra cards', () => {
    addExtraCard(buildNewCard())
    resetCardsStore()
    expect(getExtraCards()).toEqual([])
  })

  test('clears deleted seed ids', () => {
    deleteCard('card-001')
    resetCardsStore()
    expect(getSnapshot().deletedSeedIds.has('card-001')).toBe(false)
  })
})

describe('subscribe / getSnapshot', () => {
  beforeEach(() => resetCardsStore())

  test('getSnapshot returns the same reference when no mutation', () => {
    const a = getSnapshot()
    const b = getSnapshot()
    expect(a).toBe(b)
  })

  test('getSnapshot returns a new reference after mutation', () => {
    const before = getSnapshot()
    addExtraCard(buildNewCard())
    expect(getSnapshot()).not.toBe(before)
  })

  test('listener fires when addExtraCard mutates state', () => {
    const fn = vi.fn()
    const unsub = subscribe(fn)
    addExtraCard(buildNewCard())
    expect(fn).toHaveBeenCalled()
    unsub()
  })

  test('listener fires for topUpCard, setCardActive, addTopUpTx, removeExtraCard, deleteCard', () => {
    const fn = vi.fn()
    const unsub = subscribe(fn)
    const c = buildNewCard()
    addExtraCard(c)
    fn.mockClear()
    topUpCard(c.id, 10)
    setCardActive(c.id, false)
    addTopUpTx({ id: 'tx-sub', amount: 5 })
    removeExtraCard(c.id)
    deleteCard('nonexistent')
    expect(fn.mock.calls.length).toBe(5)
    unsub()
  })

  test('unsubscribe stops listener firing', () => {
    const fn = vi.fn()
    const unsub = subscribe(fn)
    unsub()
    addExtraCard(buildNewCard())
    expect(fn).not.toHaveBeenCalled()
  })

  test('snapshot exposes extraCards, balances, activeStates, topUpTxList, deletedSeedIds', () => {
    const snap = getSnapshot()
    expect(snap).toMatchObject({
      extraCards: expect.any(Array),
      balances: expect.any(Object),
      activeStates: expect.any(Object),
      topUpTxList: expect.any(Array),
      deletedSeedIds: expect.any(Set),
    })
  })
})

describe('deleteCard', () => {
  beforeEach(() => resetCardsStore())

  test('removes extra card by id', () => {
    const c = buildNewCard()
    addExtraCard(c)
    deleteCard(c.id)
    expect(getExtraCards()).not.toContain(c)
  })

  test('marks seed card id as deleted in state', () => {
    deleteCard('card-001')
    expect(getSnapshot().deletedSeedIds.has('card-001')).toBe(true)
  })

  test('handles both extra-card removal and seed marking in one call', () => {
    const c = buildNewCard()
    addExtraCard(c)
    deleteCard(c.id)
    deleteCard('card-001')
    expect(getExtraCards()).not.toContain(c)
    expect(getSnapshot().deletedSeedIds.has('card-001')).toBe(true)
  })
})
