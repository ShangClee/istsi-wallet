import React from "react"
import { useIsMobile } from "~Generic/hooks/userinterface"

// Styles converted to Tailwind - see className usage below

interface AppSettingsItemProps {
  actions?: React.ReactNode
  disabled?: boolean
  icon: React.ReactElement
  primaryText: string
  secondaryText?: string
  style?: React.CSSProperties
  onClick?: () => void
}

function AppSettingsItem(props: AppSettingsItemProps) {
  const isSmallScreen = useIsMobile()

  const { actions, primaryText, secondaryText, style } = props

  return (
    <div
      className={`
        relative px-6 py-4 sm:px-3 bg-white
        ${props.onClick ? "cursor-pointer hover:bg-gray-200 active:bg-gray-200" : ""}
        ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
        border-t border-gray-200 first:border-t-0
        focus:bg-white
      `.trim().replace(/\s+/g, " ")}
      onClick={props.onClick}
      style={style}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-1 w-7 text-[28px] flex items-center justify-center">
          {props.icon}
        </div>
        <div className="flex-1 min-w-0" style={{ paddingRight: isSmallScreen ? 0 : undefined }}>
          <div className="text-base font-medium">{primaryText}</div>
          {secondaryText && <div className="text-sm text-gray-600">{secondaryText}</div>}
        </div>
        {actions}
      </div>
    </div>
  )
}

export default AppSettingsItem
