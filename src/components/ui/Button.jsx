// src/components/ui/Button.jsx
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3.5 text-base transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-[#2DB87E] hover:bg-[#1A7A50] text-white focus-visible:ring-[#2DB87E]',
    secondary: 'bg-white border border-[#2DB87E] text-[#2DB87E] hover:bg-[#E8F7F0] focus-visible:ring-[#2DB87E]',
    ghost:     'bg-transparent text-[#6B7280] hover:bg-gray-100 focus-visible:ring-gray-400',
    danger:    'bg-[#DC2626] hover:bg-red-700 text-white focus-visible:ring-red-500',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
