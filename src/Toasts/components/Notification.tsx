import React, { useEffect } from "react"
import CheckIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt"
import { NotificationType } from "~App/contexts/notifications"

// Mapping types to colors/icons
const icons: Record<NotificationType, React.ComponentType<any>> = {
  connection: OfflineBoltIcon,
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon
}

const typeStyles: Record<NotificationType, string> = {
  connection: "bg-gray-500 text-white",
  error: "bg-red-700 text-white",
  info: "bg-blue-500 text-white",
  success: "bg-green-500 text-white"
}

interface NotificationProps {
  anchorOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" }
  autoHideDuration?: number
  contentStyle?: React.CSSProperties
  icon?: React.ComponentType<{ className: string }>
  message: React.ReactNode
  type: NotificationType
  open?: boolean
  onClick?: () => void
  onClose?: () => void
  style?: React.CSSProperties
}

function Notification(props: NotificationProps) {
  const { open = true, autoHideDuration, onClose } = props

  useEffect(() => {
    if (open && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [open, autoHideDuration, onClose])

  if (!open) return null

  const Icon = props.icon || icons[props.type]
  const typeClass = typeStyles[props.type] || "bg-gray-800 text-white"

  // Positioning
  const vertical = props.anchorOrigin?.vertical || "bottom"
  const horizontal = props.anchorOrigin?.horizontal || "center"

  let positionClass = "fixed z-50 p-4 "
  if (vertical === "top") positionClass += "top-0 "
  else positionClass += "bottom-0 "

  if (horizontal === "left") positionClass += "left-0"
  else if (horizontal === "right") positionClass += "right-0"
  else positionClass += "left-1/2 transform -translate-x-1/2"

  return (
    <div className={positionClass} style={props.style}>
      <div
        className={`flex items-center px-4 py-3 rounded shadow-lg min-w-[300px] max-w-[90vw] cursor-pointer ${typeClass}`}
        onClick={props.onClick}
        style={props.contentStyle}
      >
        <div className="flex items-center mr-3 opacity-90 text-xl">
          <Icon className="" />
        </div>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
          {props.message}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Notification)
