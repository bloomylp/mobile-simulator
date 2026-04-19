// src/pages/HelpCentrePage.jsx
// Help Centre — support contact info + policy links.
import { Info, Phone, Mail } from 'lucide-react'
import { HamburgerMenu } from '../components/layout/HamburgerMenu.jsx'
import { LangToggle } from '../components/ui/LangToggle.jsx'
import { NotificationBell } from '../components/ui/NotificationBell.jsx'
import { useLang } from '../context/LangContext.jsx'

function SectionCard({ children }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ borderLeft: '4px solid #2DB87E' }}
    >
      {children}
    </div>
  )
}

function ContactPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 bg-[#F4F6F8] rounded-xl px-4 py-3">
      <Icon size={18} strokeWidth={1.75} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
      <span className="text-sm text-[#1A1F2E]">{label}</span>
    </div>
  )
}

export function HelpCentrePage() {
  const { t } = useLang()
  return (
    <div className="min-h-full bg-[#F4F6F8] px-5 pb-8">
      <div className="flex items-center justify-between pt-12 pb-4">
        <HamburgerMenu />
        <div className="flex items-center gap-2"><LangToggle /><NotificationBell /></div>
      </div>
      <h1 className="text-center text-lg font-semibold text-[#1A1F2E] mb-6">
        {t.helpCentre}
      </h1>

      {/* General Information */}
      <SectionCard>
        <div className="flex gap-3 p-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8F7F0] flex-shrink-0"
            aria-hidden="true"
          >
            <Info size={20} strokeWidth={1.75} className="text-[#1A7A50]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#1A1F2E] mb-1">{t.generalInfo}</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.helpBody}</p>
          </div>
        </div>
      </SectionCard>

      <div className="h-4" />

      {/* Contact Us */}
      <SectionCard>
        <div className="p-4">
          <h2 className="text-sm font-semibold text-[#1A1F2E] mb-1">{t.contactUs}</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{t.helpBody}</p>

          <div className="flex flex-col gap-2">
            <ContactPill icon={Phone} label="+44 444 444444" />
            <ContactPill icon={Mail} label="support@operator.com" />
          </div>

          <hr className="border-gray-100 my-4" />

          <div className="flex flex-col gap-3">
            <a href="#privacy" className="text-sm font-semibold text-[#2DB87E] hover:underline">
              {t.privacyPolicyLink}
            </a>
            <a href="#terms" className="text-sm font-semibold text-[#2DB87E] hover:underline">
              {t.termsConditions}
            </a>
            <a href="#refund" className="text-sm font-semibold text-[#2DB87E] hover:underline">
              {t.refundPolicy}
            </a>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
