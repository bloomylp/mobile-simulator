import { describe, test, expect, beforeEach } from 'vitest'
import { login, logout, isAuthenticated } from '../utils/auth.js'

beforeEach(() => {
  sessionStorage.clear()
})

describe('auth', () => {
  test('isAuthenticated returns false when not logged in', () => {
    expect(isAuthenticated()).toBe(false)
  })

  test('isAuthenticated returns true after login', () => {
    login()
    expect(isAuthenticated()).toBe(true)
  })

  test('isAuthenticated returns false after logout', () => {
    login()
    logout()
    expect(isAuthenticated()).toBe(false)
  })

  test('logout is safe to call when not logged in', () => {
    expect(() => logout()).not.toThrow()
    expect(isAuthenticated()).toBe(false)
  })
})
