// src/utils/cardsStore.js
// Subscribable in-memory store — resets on page reload, persists across React Router navigation.
// Mutations produce a new top-level snapshot (immutable) and notify listeners.

import { useSyncExternalStore } from 'react'

let _state = freshState()
let _seq = 1
const _listeners = new Set()

function freshState() {
  return {
    extraCards: [],
    balances: {},
    activeStates: {},
    topUpTxList: [],
    deletedSeedIds: new Set(),
  }
}

function notify() {
  _listeners.forEach((fn) => fn())
}

export function subscribe(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

export function getSnapshot() {
  return _state
}

export function useCardsStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

// ── Extra cards ────────────────────────────────────────────────────

export function getExtraCards() {
  return _state.extraCards
}

export function addExtraCard(card) {
  _state = { ..._state, extraCards: [..._state.extraCards, card] }
  notify()
}

export function removeExtraCard(cardId) {
  _state = { ..._state, extraCards: _state.extraCards.filter((c) => c.id !== cardId) }
  notify()
}

// Unified delete — removes extras AND marks seed ids as hidden
export function deleteCard(cardId) {
  const nextDeleted = new Set(_state.deletedSeedIds)
  nextDeleted.add(cardId)
  _state = {
    ..._state,
    extraCards: _state.extraCards.filter((c) => c.id !== cardId),
    deletedSeedIds: nextDeleted,
  }
  notify()
}

// ── Balance ────────────────────────────────────────────────────────

export function topUpCard(cardId, amount) {
  _state = {
    ..._state,
    balances: { ..._state.balances, [cardId]: (_state.balances[cardId] ?? 0) + amount },
  }
  notify()
}

export function getCardBalance(cardId, defaultBalance = 0) {
  return _state.balances[cardId] ?? defaultBalance
}

// ── Active toggle ──────────────────────────────────────────────────

export function getCardActive(cardId) {
  return _state.activeStates[cardId] !== false
}

export function setCardActive(cardId, value) {
  _state = {
    ..._state,
    activeStates: { ..._state.activeStates, [cardId]: value },
  }
  notify()
}

// ── Top-up transactions ────────────────────────────────────────────

export function getTopUpTxList() {
  return _state.topUpTxList
}

export function addTopUpTx(tx) {
  _state = { ..._state, topUpTxList: [tx, ..._state.topUpTxList] }
  notify()
}

// ── Reset ──────────────────────────────────────────────────────────

export function resetCardsStore() {
  _state = freshState()
  _seq = 1
  notify()
}

// ── Factory ────────────────────────────────────────────────────────

export function buildNewCard(cardType = 'digital') {
  const seq = _seq++
  const last4 = String(1000 + seq * 37).slice(-4)
  const panSuffix = String(Math.floor(10000 + Math.random() * 90000))
  return {
    id: `card-new-${Date.now()}-${seq}`,
    name: 'John Rotterwood',
    pan: `•••• •••• •••• ${last4}`,
    panFull: `0000 0000 0000 ${last4}`,
    panSuffix,
    expiry: '12/28',
    status: 'new',
    cardType,
    balance: 0,
    spent: 0,
    createdAt: (() => { const d = new Date(); const p = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}` })(),
  }
}
