// src/utils/auth.js
const KEY = 'lp_authed'

export function login() {
  sessionStorage.setItem(KEY, '1')
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export function isAuthenticated() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
