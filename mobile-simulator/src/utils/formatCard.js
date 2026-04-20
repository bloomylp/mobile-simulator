// src/utils/formatCard.js
// Formats a raw digit string into "XXXX XXXX XXXX XXXX"
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

// Formats expiry input into "MM/YY". Clamps month to 01-12.
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    const month = Math.min(Math.max(parseInt(digits.slice(0, 2), 10), 1), 12)
      .toString()
      .padStart(2, '0')
    return month + '/' + digits.slice(2)
  }
  return digits
}
