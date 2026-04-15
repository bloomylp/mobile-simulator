// src/context/LangContext.jsx
import { createContext, useContext, useState } from 'react'

export const translations = {
  en: {
    welcome:        'Welcome to Traveller Wallet',
    transactions:   'Transactions',
    loadMoney:      'Load Balance',
    balance:        'Balance',
    searchFilters:  'Search Filters',
    yourCards:      'Your Cards',
    orderNewCard:   'Order New Card',
    addNew:         '+ Add New',
    profile:        'Profile',
    cards:          'Cards',
    home:           'Home',
    signIn:         'Sign In',
    signingIn:      'Signing in\u2026',
    email:          'Email',
    password:       'Password',
    language:       'Language',
    privacyPolicy:  'Privacy & Policy',
    logOut:         'Log Out',
    feedback:       'Feedback',
    leaveUs:        'Leave Us',
    accountCreated: 'Account Created',
    ordering:       'Ordering\u2026',
    noTrips:        'No transactions found',
    adjustDate:     'Try adjusting the date range',
  },
  es: {
    welcome:        'Bienvenido a Traveller Wallet',
    transactions:   'Transacciones',
    loadMoney:      'Cargar Dinero',
    balance:        'Saldo',
    searchFilters:  'Filtros de Búsqueda',
    yourCards:      'Tus Tarjetas',
    orderNewCard:   'Pedir Nueva Tarjeta',
    addNew:         '+ Añadir',
    profile:        'Perfil',
    cards:          'Tarjetas',
    home:           'Inicio',
    signIn:         'Iniciar Sesión',
    signingIn:      'Iniciando sesión\u2026',
    email:          'Correo',
    password:       'Contraseña',
    language:       'Idioma',
    privacyPolicy:  'Privacidad y Política',
    logOut:         'Cerrar Sesión',
    feedback:       'Comentarios',
    leaveUs:        'Déjanos',
    accountCreated: 'Cuenta Creada',
    ordering:       'Pidiendo\u2026',
    noTrips:        'No se encontraron transacciones',
    adjustDate:     'Intenta ajustar el rango de fechas',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const toggle = () => setLang((l) => (l === 'en' ? 'es' : 'en'))
  return (
    <LangContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
