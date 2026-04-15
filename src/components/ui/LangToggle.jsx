// src/components/ui/LangToggle.jsx
import { Globe } from 'lucide-react'
import { useLang } from '../../context/LangContext.jsx'

export function LangToggle({ light = false }) {
  const { lang, toggle } = useLang()
  return (
    <button
      onClick={toggle}
      aria-label={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
      className={`flex items-center gap-1 text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full px-2.5 py-[2px] min-h-[26px] transition-colors duration-150 ${
        light
          ? 'text-[#1A7A50] bg-white/50 hover:bg-white/60'
          : 'text-[#6B7280] hover:text-[#2DB87E] bg-white border border-gray-200 hover:border-[#2DB87E]'
      }`}
    >
      <Globe size={12} aria-hidden="true" />
      {lang === 'en' ? 'EN' : 'ES'}
    </button>
  )
}
