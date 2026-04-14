// src/components/ui/Badge.jsx
export function Badge({ status }) {
  const styles = {
    active:  'bg-[#E8F7F0] text-[#1A7A50]',
    pending: 'bg-yellow-50 text-yellow-700',
    frozen:  'bg-blue-50 text-blue-700',
  }
  const labels = {
    active: 'Active',
    pending: 'Pending',
    frozen: 'Frozen',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status === 'active' && (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill="#2DB87E" />
          <path d="M3.5 6l1.5 1.5L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {labels[status]}
    </span>
  )
}
