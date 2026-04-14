// src/components/layout/PageShell.jsx
export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-dvh bg-gray-100 flex justify-center items-start lg:items-center lg:py-8">
      {/* Phone shell on desktop */}
      <div className="w-full max-w-sm min-h-dvh lg:min-h-0 lg:h-[812px] lg:rounded-[40px] lg:overflow-hidden lg:shadow-2xl bg-[#F4F6F8] flex flex-col relative">
        {/* Notch (desktop only) */}
        <div className="hidden lg:flex justify-center pt-3 pb-1 absolute top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="w-24 h-5 bg-gray-900 rounded-full" aria-hidden="true" />
        </div>
        <div className={`flex flex-col flex-1 lg:pt-5 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
