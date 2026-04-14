// src/utils/formatCard.js
// Formats a raw digit string into "XXXX XXXX XXXX XXXX"
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

// Formats expiry input into "MM/YY"
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2)
  }
  return digits
}
