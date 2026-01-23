import React from "react"
import { HiChevronRight } from "react-icons/hi2"

const isMobileDevice = process.env.PLATFORM === "android" || process.env.PLATFORM === "ios"

// Styles converted to Tailwind - see className usage below

interface AccountSettingsItemProps {
  children: React.ReactNode
  caret?: "down" | "hide" | "right"
  disabled?: boolean
  icon: React.ReactElement | null | undefined
  onClick?: () => void
  subItem?: boolean
}

const AccountSettingsItem = React.forwardRef(function AccountSettingsItem(
  props: AccountSettingsItemProps,
  ref: React.Ref<HTMLDivElement>
) {
  const isButton = Boolean(props.onClick)

  return (
    <div
      ref={ref}
      className={`
        relative px-6 py-4 sm:px-3 bg-white shadow-[0_8px_12px_0_rgba(0,0,0,0.1)]
        ${isButton ? "cursor-pointer hover:bg-gray-200 active:bg-gray-200" : ""}
        ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${!props.subItem ? "border-t border-gray-200 first:border-t-0" : ""}
        focus:bg-white
      `.trim().replace(/\s+/g, " ")}
      onClick={props.onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-1 w-7 text-[28px] flex items-center justify-center">
          {props.icon || <div />}
        </div>
        <div className="flex-1 min-w-0">{props.children}</div>
        {props.caret && props.caret !== "hide" ? (
          <div className={`flex-shrink-0 text-[48px] text-black/35 flex items-center justify-center -mr-2 w-12 transition-transform duration-300 ${props.caret === "down" ? "rotate-90" : ""}`}>
            <HiChevronRight className="text-[48px]" />
          </div>
        ) : null}
      </div>
    </div>
  )
})

export default React.memo(AccountSettingsItem)
