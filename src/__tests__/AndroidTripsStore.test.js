// src/__tests__/AndroidTripsStore.test.js
import { addTrip, getTrips, removeTrip, resetTrips, subscribe } from '../android/apps/wallet/data/androidTripsStore'

beforeEach(() => resetTrips())

describe('androidTripsStore — initial state', () => {
  test('starts with empty trips list', () => {
    expect(getTrips()).toEqual([])
  })
})

describe('androidTripsStore — addTrip', () => {
  test('adds a trip to the list', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(getTrips()).toHaveLength(1)
  })

  test('trip has correct name and amount', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(getTrips()[0].name).toBe('Station 3')
    expect(getTrips()[0].amount).toBe('$5.00')
  })

  test('trip has correct date', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(getTrips()[0].date).toBe('Apr 17')
  })

  test('multiple addTrip calls accumulate trips', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(getTrips()).toHaveLength(2)
  })

  test('getTrips returns a new array (immutable)', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    const a = getTrips()
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    const b = getTrips()
    expect(a).not.toBe(b)
  })
})

describe('androidTripsStore — removeTrip', () => {
  test('removes trip by index', () => {
    addTrip({ name: 'Station 1', amount: '$5.00', date: 'Apr 17' })
    addTrip({ name: 'Station 2', amount: '$5.00', date: 'Apr 17' })
    removeTrip(0)
    expect(getTrips()).toHaveLength(1)
    expect(getTrips()[0].name).toBe('Station 2')
  })

  test('removing from single-item list leaves empty list', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    removeTrip(0)
    expect(getTrips()).toHaveLength(0)
  })

  test('removeTrip notifies subscribers', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    const listener = vi.fn()
    const unsub = subscribe(listener)
    removeTrip(0)
    expect(listener).toHaveBeenCalledTimes(1)
    unsub()
  })

  test('removeTrip with out-of-range index is a no-op', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    removeTrip(5)
    expect(getTrips()).toHaveLength(1)
  })
})

describe('androidTripsStore — resetTrips', () => {
  test('clears all trips', () => {
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    resetTrips()
    expect(getTrips()).toHaveLength(0)
  })
})

describe('androidTripsStore — subscribe', () => {
  test('listener called once when addTrip fires', () => {
    const listener = vi.fn()
    const unsub = subscribe(listener)
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(listener).toHaveBeenCalledTimes(1)
    unsub()
  })

  test('listener not called after unsubscribe', () => {
    const listener = vi.fn()
    const unsub = subscribe(listener)
    unsub()
    addTrip({ name: 'Station 3', amount: '$5.00', date: 'Apr 17' })
    expect(listener).not.toHaveBeenCalled()
  })

  test('listener called on resetTrips', () => {
    const listener = vi.fn()
    const unsub = subscribe(listener)
    resetTrips()
    expect(listener).toHaveBeenCalledTimes(1)
    unsub()
  })
})
