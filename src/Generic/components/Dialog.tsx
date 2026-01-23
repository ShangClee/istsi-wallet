import React from "react"

interface DialogProps {
  children: React.ReactNode
  className?: string
  fullScreen?: boolean
  onClose?: () => void
  open: boolean
  style?: React.CSSProperties
}

export const Dialog = ({ children, className, fullScreen, onClose, open, style }: DialogProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white shadow-xl overflow-hidden flex flex-col ${
          fullScreen ? "w-full h-full" : "rounded-lg max-w-lg w-full m-4"
        } ${className || ""}`}
        style={style}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export const DialogTitle = ({ children, className, style }: any) => (
  <div className={`px-6 py-4 text-xl font-medium ${className || ""}`} style={style}>
    {children}
  </div>
)

export const DialogContent = ({ children, className, style }: any) => (
  <div className={`px-6 py-4 flex-1 overflow-y-auto ${className || ""}`} style={style}>
    {children}
  </div>
)

export const DialogActions = ({ children, className, style }: any) => (
  <div className={`px-6 py-4 flex items-center justify-end gap-2 ${className || ""}`} style={style}>
    {children}
  </div>
)
