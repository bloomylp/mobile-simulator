// src/android/apps/wallet/data/androidTripsStore.js
// Module-level store for Android wallet trip entries.
import { useSyncExternalStore } from 'react'

let _trips = []
const _listeners = new Set()

function notify() {
  _listeners.forEach((fn) => fn())
}

export function subscribe(listener) {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

export function getTrips() {
  return _trips
}

export function addTrip(trip) {
  _trips = [..._trips, trip]
  notify()
}

export function removeTrip(index) {
  if (index < 0 || index >= _trips.length) return
  _trips = _trips.filter((_, i) => i !== index)
  notify()
}

export function resetTrips() {
  _trips = []
  notify()
}

export function useTripsStore() {
  return useSyncExternalStore(subscribe, getTrips)
}
