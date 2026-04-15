// src/components/layout/PageShell.jsx
export function PageShell({ children, className = '' }) {
  return (
    <div className={`min-h-full bg-[#F4F6F8] flex flex-col ${className}`}>
      {children}
    </div>
  )
}
