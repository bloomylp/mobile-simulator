// src/components/topup/GooglePayButton.jsx
export function GooglePayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-white text-[#1A1F2E] font-semibold py-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2DB87E] min-h-[44px]"
      aria-label="Pay with Google Pay"
    >
      <svg viewBox="0 0 80 34" className="h-5" aria-hidden="true">
        <path d="M38.4 16.4v9.7h-3.1V3h8.2c2 0 3.7.7 5.1 2s2 2.9 2 4.8c0 1.9-.7 3.5-2 4.8-1.4 1.3-3.1 1.9-5.1 1.9l-5.1-.1zm0-10.5v7.7h5.2c1.2 0 2.2-.4 3-1.2.8-.8 1.2-1.8 1.2-3 0-1.1-.4-2.1-1.2-2.9-.8-.8-1.8-1.2-3-1.2l-5.2.6zm19.3 3.8c2.2 0 3.9.6 5.2 1.7 1.3 1.1 1.9 2.7 1.9 4.7v9.4h-2.9v-2.1h-.1c-1.2 1.7-2.8 2.6-4.8 2.6-1.7 0-3.1-.5-4.3-1.5-1.2-1-1.7-2.3-1.7-3.8 0-1.6.6-2.9 1.8-3.8 1.2-.9 2.8-1.4 4.9-1.4 1.7 0 3.2.3 4.2.9v-.7c0-1-.4-1.9-1.2-2.6-.8-.7-1.7-1-2.8-1-1.6 0-2.9.7-3.8 2l-2.7-1.7c1.5-2.1 3.6-3.2 6.3-3.2zm-3.8 11.5c0 .8.3 1.4 1 1.9.7.5 1.4.7 2.3.7 1.2 0 2.3-.5 3.3-1.4 1-.9 1.4-2 1.4-3.2-.9-.7-2.1-1.1-3.7-1.1-1.1 0-2.1.3-2.8.8-.9.5-1.5 1.3-1.5 2.3zm18-10.9L66.8 26h-3.2L59 10.3h3.3l3.3 9.5 3.7-9.5h3l3.7 9.5 3.3-9.5H79l-5.6 15.7H70l-4.1-9.7z" fill="#3C4043"/>
        <path d="M10.9 13.5v3.2H18c-.2 1.6-.8 2.8-1.7 3.7-1.1 1.1-2.7 2.2-5.4 2.2-4.3 0-7.6-3.5-7.6-7.8s3.3-7.8 7.6-7.8c2.3 0 4 .9 5.2 2.1l2.3-2.3C16.6 5.2 14.2 4 10.9 4 5 4 0 8.8 0 14.8s5 10.8 10.9 10.8c3.2 0 5.6-1 7.5-3 1.9-1.9 2.5-4.6 2.5-6.8 0-.7-.1-1.3-.2-1.8l-9.8.5z" fill="#4285F4"/>
      </svg>
    </button>
  )
}
