// src/components/topup/ApplePayButton.jsx
export function ApplePayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3.5 rounded-xl cursor-pointer hover:bg-gray-900 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[44px]"
      aria-label="Pay with Apple Pay"
    >
      <svg viewBox="0 0 60 26" fill="white" className="h-5" aria-hidden="true">
        <path d="M11.05 3.42c-.7.84-1.83 1.5-2.96 1.4-.14-1.13.41-2.33 1.05-3.07C9.84.9 11.07.28 12.06.22c.12 1.16-.34 2.3-1.01 3.2zm1 1.59c-1.64-.1-3.04.93-3.82.93-.8 0-2-.88-3.3-.86C3.18 5.1 1.4 6.05.56 7.6-1.16 10.72.1 15.4 1.76 17.96c.82 1.2 1.8 2.52 3.1 2.48 1.24-.05 1.72-.8 3.2-.8 1.5 0 1.93.8 3.22.77 1.34-.02 2.18-1.2 3-2.4.94-1.36 1.32-2.68 1.34-2.75-.03-.02-2.57-1-2.6-3.96-.02-2.48 2.02-3.66 2.12-3.73-.82-1.22-2.1-1.56-2.59-1.56zM21.16 1.68v18.6h2.88v-6.36h3.99c3.66 0 6.23-2.52 6.23-6.14s-2.53-6.1-6.15-6.1h-6.95zm2.88 2.46h3.32c2.51 0 3.94 1.34 3.94 3.66s-1.43 3.68-3.96 3.68h-3.3V4.14zm16.07 16.27c1.82 0 3.5-.92 4.27-2.38h.06v2.23h2.67V10.9c0-2.68-2.14-4.41-5.44-4.41-3.06 0-5.33 1.76-5.41 4.17h2.6c.22-1.15 1.28-1.9 2.73-1.9 1.76 0 2.75.82 2.75 2.33v1.02l-3.6.22c-3.35.2-5.16 1.57-5.16 3.94 0 2.4 1.86 3.98 4.53 3.98zm.77-2.2c-1.53 0-2.51-.74-2.51-1.88 0-1.17.94-1.85 2.74-1.95l3.2-.2v1.04c0 1.75-1.48 2.99-3.43 2.99zm11.13 7.13c2.8 0 4.12-1.07 5.27-4.32l5.05-14.16h-2.93l-3.38 10.93h-.06L52.6 6.86h-3l4.88 13.52-.26.82c-.44 1.4-1.15 1.93-2.43 1.93-.22 0-.66-.02-.84-.05v2.22c.18.06.94.09 1.16.09z"/>
      </svg>
    </button>
  )
}
