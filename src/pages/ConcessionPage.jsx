// src/pages/ConcessionPage.jsx
import { useNavigate } from 'react-router-dom'
import { Clock, CreditCard, CheckCircle, ArrowRight, BadgePercent } from 'lucide-react'
import { useConcession } from '../context/ConcessionContext.jsx'
import { HamburgerMenu } from '../components/layout/HamburgerMenu.jsx'
import { LangToggle }    from '../components/ui/LangToggle.jsx'
import { NotificationBell } from '../components/ui/NotificationBell.jsx'

const GROUP_LABELS = {
  student: { title: 'Student Discount', usedFor: 'Student Group' },
  senior:  { title: 'Senior Discount',  usedFor: 'Senior Group'  },
}

function formatDateTime(ts) {
  const d = new Date(ts)
  const mm  = String(d.getMonth() + 1).padStart(2, '0')
  const dd  = String(d.getDate()).padStart(2, '0')
  const yy  = d.getFullYear()
  const hh  = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const ss  = String(d.getSeconds()).padStart(2, '0')
  return `${mm}/${dd}/${yy} ${hh}:${min}:${ss}`
}

function expiryDate(ts) {
  const d = new Date(ts)
  d.setFullYear(d.getFullYear() + 4)
  return formatDateTime(d.getTime())
}

function PageHeader({ showIcon = false }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-14 pb-6 px-5">
      <h1 className="text-[#1A1F2E] text-2xl font-bold">Concession and Eligibility</h1>
      {showIcon && (
        <div data-testid="concession-icon" className="w-14 h-14 rounded-2xl bg-[#E8F7F0] flex items-center justify-center translate-y-[10px]">
          <BadgePercent size={28} className="text-[#2DB87E]" strokeWidth={1.75} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export function ConcessionPage() {
  const navigate = useNavigate()
  const { enrolled, concessionData } = useConcession()

  if (!enrolled) {
    return (
      <div className="min-h-full bg-[#F4F6F8] flex flex-col px-6 pb-6">
        <div className="flex items-center justify-between pt-12 pb-4 -mx-0">
          <div className="flex items-center gap-2"><HamburgerMenu /><LangToggle /></div>
          <NotificationBell />
        </div>
        <PageHeader showIcon />
        <p className="text-[#6B7280] text-sm text-center leading-relaxed px-2 mb-6 translate-y-[40px]">
          Click below to start the enrolment process. The process will take less than five minutes, and you will be guided through a wizard to complete your eligibility enrolment.
        </p>
        <div className="flex-1 flex items-center -translate-y-[60px]">
          <button
            onClick={() => navigate('/enrolment')}
            aria-label="Start enrolment"
            className="w-full bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
          >
            <span className="text-[#1A1F2E] text-sm font-medium">
              Click here to start enrolment
            </span>
            <ArrowRight size={18} className="text-[#2DB87E] flex-shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  if (!concessionData) return null

  const { group, card, enrolledAt } = concessionData
  const labels = GROUP_LABELS[group] ?? { title: 'Concession Discount', usedFor: `${group} Group` }

  return (
    <div className="min-h-full bg-[#F4F6F8] flex flex-col pb-6 px-4 relative">
      <div className="flex items-center justify-between pt-12 pb-4">
        <div className="flex items-center gap-2"><HamburgerMenu /><LangToggle /></div>
        <NotificationBell />
      </div>
      <PageHeader />
      {/* Active count */}
      <h2 className="text-[#1A1F2E] text-base font-bold mb-4 px-1">Active (1)</h2>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-[#2DB87E]">
        <div className="px-4 pt-4 pb-3">

          {/* Title row */}
          <div className="flex items-start justify-between mb-3">
            <span className="text-[#1A1F2E] text-sm font-semibold">{labels.title}</span>
            <div className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0">
              <BadgePercent size={16} className="text-[#6B7280]" aria-hidden="true" />
            </div>
          </div>

          {/* Eligibility Expiry */}
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={14} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
            <span className="text-[#6B7280] text-xs">
              Eligibility Expiry: {expiryDate(enrolledAt)}
            </span>
          </div>

          {/* Operator */}
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
            <span className="text-[#6B7280] text-xs">Operator:&nbsp; Transit Operator</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-3" />

          {/* Used For */}
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} className="text-[#2DB87E] flex-shrink-0" aria-hidden="true" />
            <span className="text-[#6B7280] text-xs">Used For: {labels.usedFor}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-3" />

          {/* Created on */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[#9CA3AF] text-xs">Created on</span>
            <span className="text-[#1A1F2E] text-xs font-medium">{formatDateTime(enrolledAt)}</span>
          </div>

          {/* Linked card */}
          <div className="flex items-center gap-3 bg-[#F4F6F8] rounded-xl px-3 py-2.5">
            <CreditCard size={16} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
            <span className="text-[#1A1F2E] text-sm font-medium tracking-wider">
              ******{card?.panSuffix ?? ''}
            </span>
          </div>

        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="fixed bottom-[94px] left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <button
          onClick={() => navigate('/enrolment')}
          className="w-full bg-[#2DB87E] text-white text-sm font-semibold py-3 rounded-xl cursor-pointer hover:bg-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
        >
          Start new concession enrolment
        </button>
      </div>
    </div>
  )
}
