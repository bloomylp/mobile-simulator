// src/components/layout/PageShell.jsx
export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex justify-center">
      <div className={`w-full max-w-sm flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  )
}
