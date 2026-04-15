import { describe, test, expect } from 'vitest'
import { formatCardNumber, formatExpiry } from '../utils/formatCard.js'

describe('formatCardNumber', () => {
  test('formats 16 digits into XXXX XXXX XXXX XXXX', () => {
    expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456')
  })

  test('strips non-digit characters', () => {
    expect(formatCardNumber('1234-5678-9012-3456')).toBe('1234 5678 9012 3456')
  })

  test('truncates input beyond 16 digits', () => {
    expect(formatCardNumber('12345678901234567890')).toBe('1234 5678 9012 3456')
  })

  test('handles partial input of 4 digits', () => {
    expect(formatCardNumber('1234')).toBe('1234')
  })

  test('handles partial input of 5 digits', () => {
    expect(formatCardNumber('12345')).toBe('1234 5')
  })

  test('handles empty string', () => {
    expect(formatCardNumber('')).toBe('')
  })
})

describe('formatExpiry', () => {
  test('formats 4 digits as MM/YY', () => {
    expect(formatExpiry('1028')).toBe('10/28')
  })

  test('clamps month above 12 to 12', () => {
    expect(formatExpiry('1399')).toBe('12/99')
  })

  test('clamps month 00 up to 01', () => {
    expect(formatExpiry('0099')).toBe('01/99')
  })

  test('returns digits only when fewer than 3 chars entered', () => {
    expect(formatExpiry('12')).toBe('12')
  })

  test('strips non-digit characters', () => {
    expect(formatExpiry('10/28')).toBe('10/28')
  })

  test('handles empty string', () => {
    expect(formatExpiry('')).toBe('')
  })
})
