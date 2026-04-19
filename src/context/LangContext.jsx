// src/context/LangContext.jsx
import { createContext, useContext, useState } from 'react'

export const translations = {
  en: {
    welcome:        'Your Traveller Wallet',
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
    noTrips:        'No trips',
    noTripsDetail:  'or balance loading completed.',
    adjustDate:     'Try adjusting the date range',
    concession:     'Concession',
    promotions:     'Promotions',
    helpCentre:     'Help Centre',
    generalInfo:    'General Information',
    helpBody:       'If you experience any issues, please contact us using the details below. Our support team is here to help you resolve any problems as quickly as possible.',
    contactUs:      'Contact Us',
    privacyPolicyLink:'Privacy Policy',
    termsConditions:'Terms & Conditions',
    refundPolicy:   'Refund Policy',
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
    noTrips:        'Sin viajes',
    noTripsDetail:  'o carga de saldo completada.',
    adjustDate:     'Intenta ajustar el rango de fechas',
    concession:     'Concesión',
    promotions:     'Promociones',
    helpCentre:     'Centro de Ayuda',
    generalInfo:    'Información General',
    helpBody:       'Si experimenta algún problema, comuníquese con nosotros usando los datos a continuación. Nuestro equipo de soporte está aquí para ayudarle a resolver cualquier problema lo más rápido posible.',
    contactUs:      'Contáctenos',
    privacyPolicyLink:'Política de Privacidad',
    termsConditions:'Términos y Condiciones',
    refundPolicy:   'Política de Reembolso',
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
