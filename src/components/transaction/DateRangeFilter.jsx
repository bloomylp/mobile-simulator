// src/components/transaction/DateRangeFilter.jsx
export function DateRangeFilter({ fromDate, toDate, onChange }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-gray-100">
      <div className="flex flex-col gap-0.5 flex-1">
        <label htmlFor="from-date" className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">From</label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(e) => onChange({ fromDate: e.target.value, toDate })}
          className="text-sm text-[#1A1F2E] border-0 p-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
        />
      </div>
      <div className="w-px h-8 bg-gray-200" aria-hidden="true" />
      <div className="flex flex-col gap-0.5 flex-1">
        <label htmlFor="to-date" className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">To</label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) => onChange({ fromDate, toDate: e.target.value })}
          className="text-sm text-[#1A1F2E] border-0 p-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
        />
      </div>
      {(fromDate || toDate) && (
        <button
          onClick={() => onChange({ fromDate: '', toDate: '' })}
          className="text-xs text-[#6B7280] hover:text-[#1A1F2E] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded px-1 min-h-[44px]"
          aria-label="Clear date filter"
        >
          Clear
        </button>
      )}
    </div>
  )
}
