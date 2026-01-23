import React from "react"

interface CollapseProps {
  in: boolean
  children: React.ReactNode
  className?: string
  timeout?: number
}

export const Collapse = React.memo(({ in: isOpen, children, className, timeout = 300 }: CollapseProps) => {
  return (
    <div
      className={`grid transition-[grid-template-rows] ease-in-out ${className || ""}`}
      style={{
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transitionDuration: `${timeout}ms`
      }}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  )
})

export default Collapse
