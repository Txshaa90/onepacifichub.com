import React from 'react'

export default function SheetLayout({
  title,
  subtitle,
  rightActions,
  toolbar,
  children,
  className = '',
}) {
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-100 bg-white dark:bg-neutral-800 overflow-hidden ${className}`}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h2>}
            {subtitle && <p className="text-neutral-500 dark:text-neutral-400 text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">{rightActions}</div>
        </div>

        {toolbar && (
          <div className="flex items-center justify-between">
            <div className="flex-1">{toolbar}</div>
          </div>
        )}
      </div>

      <div className="px-2 pb-2">
        {children}
      </div>
    </div>
  )
}
