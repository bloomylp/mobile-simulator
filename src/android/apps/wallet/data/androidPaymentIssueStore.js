// src/android/apps/wallet/data/androidPaymentIssueStore.js
// Module-level store for Android wallet payment-issue banner visibility.
import { useSyncExternalStore } from 'react'

let _visible = false
const _listeners = new Set()

function notify() {
  _listeners.forEach((fn) => fn())
}

export function subscribe(listener) {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

export function isPaymentIssueVisible() {
  return _visible
}

export function showPaymentIssue() {
  if (_visible) return
  _visible = true
  notify()
}

export function hidePaymentIssue() {
  if (!_visible) return
  _visible = false
  notify()
}

export function resetPaymentIssue() {
  if (!_visible) return
  _visible = false
  notify()
}

export function usePaymentIssueStore() {
  return useSyncExternalStore(subscribe, isPaymentIssueVisible)
}
