// src/utils/auth.js
const KEY = 'lp_authed'

export function login() {
  sessionStorage.setItem(KEY, '1')
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export function isAuthenticated() {
  return sessionStorage.getItem(KEY) === '1'
}
