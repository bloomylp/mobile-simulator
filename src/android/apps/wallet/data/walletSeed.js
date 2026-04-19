// src/android/apps/wallet/data/walletSeed.js
// Seed data for the Android Wallet flow.

export const SEED_PASS = {
  id: 'seed-mc-4444',
  kind: 'card',
  brand: 'MasterCard',
  last4: '4444',
}

export const AGENCIES = [
  { id: 'brighton',   label: 'Brighton and Hove, UK', subLabel: 'B&H GW Sandbox',         tappable: false },
  { id: 'london',     label: 'London, UK',            subLabel: 'Transport for London',   tappable: false },
  { id: 'manchester', label: 'Manchester, UK',        subLabel: 'Transport for Greater Manchester (UK)', tappable: false },
  { id: 'vancouver',  label: 'Vancouver, BC',         subLabel: 'Translink',              tappable: false },
  { id: 'littlepay',  label: 'Littlepay',             subLabel: 'Contactless EMV Mass Transit', tappable: true },
]

export const PAYMENT_METHODS = [
  { id: 'visa-2989', brand: 'Visa',       last4: '2989', label: 'Visa •••• 2989' },
  { id: 'mc-4444',   brand: 'Mastercard', last4: '4444', label: 'Mastercard •••• 4444' },
]

export const PASS_PRODUCTS = [
  { id: 'gwzone1', name: 'Daily Travel Pass', amount: '$10.00' },
  { id: 'gwzone2', name: 'Monthly Travel Pass', amount: '$89.00' },
]
