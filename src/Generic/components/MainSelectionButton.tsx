import React from "react"
import { HiChevronRight } from "react-icons/hi2"

// Styles converted to Tailwind - see className usage below

interface MainSelectionButtonProps {
  className?: string
  dense?: boolean
  label: React.ReactNode
  description: React.ReactNode
  gutterBottom?: boolean
  onClick: () => void
  style?: React.CSSProperties
  variant?: "primary" | "secondary"
  Icon?: React.ComponentType
}

function MainSelectionButton(props: MainSelectionButtonProps) {
  const Icon = props.Icon || HiChevronRight
  const isPrimary = props.variant === "primary"
  
  return (
    <button
      onClick={props.onClick}
      style={props.style}
      className={`
        bg-white max-w-[380px] px-6 py-4 relative text-left
        border border-gray-300 rounded
        hover:bg-gray-50 transition-colors
        ${isPrimary ? "bg-primary-gradient border-white/15 text-white hover:bg-brand-main" : ""}
        ${props.gutterBottom ? "mb-4" : ""}
        ${props.className || ""}
      `.trim().replace(/\s+/g, " ")}
    >
      <Icon
        className={`
          absolute top-1/2 left-4 -mt-5 w-10 h-10
          text-gray-500 opacity-80 transition-colors
          ${isPrimary ? "bg-white rounded-full p-1.5 text-primary-gradient opacity-100" : ""}
          group-hover:text-brand-main
        `.trim().replace(/\s+/g, " ")}
      />
      <div className="flex flex-col items-start pl-12">
        <h6 className={`
          text-lg font-medium leading-snug
          ${isPrimary ? "text-white" : "text-brand-dark"}
          transition-colors
        `.trim().replace(/\s+/g, " ")}>
          {props.label}
        </h6>
        <p className={`
          text-base mt-1
          ${props.dense ? "mt-0" : ""}
          ${isPrimary ? "text-white/95" : "text-gray-600"}
        `.trim().replace(/\s+/g, " ")}>
          {props.description}
        </p>
      </div>
    </button>
  )
}

export default React.memo(MainSelectionButton)
