// src/utils/cardsStore.js
// In-memory store — resets on page reload, persists across React Router navigation.

let _extraCards = []
let _balances = {}
let _activeStates = {}
let _seq = 1

export function getExtraCards() {
  return _extraCards
}

export function addExtraCard(card) {
  _extraCards = [..._extraCards, card]
}

export function topUpCard(cardId, amount) {
  _balances = { ..._balances, [cardId]: (_balances[cardId] ?? 0) + amount }
}

export function getCardBalance(cardId, defaultBalance = 0) {
  return _balances[cardId] ?? defaultBalance
}

export function getCardActive(cardId) {
  return _activeStates[cardId] !== false
}

export function setCardActive(cardId, value) {
  _activeStates = { ..._activeStates, [cardId]: value }
}

export function buildNewCard(cardType = 'digital') {
  const seq = _seq++
  const last4 = String(1000 + seq * 37).slice(-4)
  const panSuffix = String(Math.floor(10000 + Math.random() * 90000))
  return {
    id: `card-new-${Date.now()}-${seq}`,
    name: 'John Smith',
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
