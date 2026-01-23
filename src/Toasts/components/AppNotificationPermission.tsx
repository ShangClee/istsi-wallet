import React from "react"
import { useTranslation } from "react-i18next"
import { HiBell } from "react-icons/hi2"
import { NotificationsContext, trackError } from "~App/contexts/notifications"
import {
  hasPermission as hasPermissionToNotify,
  requestPermission as requestPermissionToNotify,
  showNotification
} from "~Platform/notifications"
import { HorizontalLayout } from "~Layout/components/Box"

interface PermissionNotificationProps {
  onHide: () => void
  open: boolean
}

const PermissionNotification = React.memo(function PermissionNotification(props: PermissionNotificationProps) {
  const { onHide } = props
  const Notifications = React.useContext(NotificationsContext)
  const { t } = useTranslation()

  const requestPermission = React.useCallback(() => {
    ;(async () => {
      const granted = await requestPermissionToNotify()
      onHide()

      if (granted) {
        showNotification({
          title: t("app.notification.permission.app-notification.granted.title"),
          text: t("app.notification.permission.app-notification.granted.text")
        })
      } else {
        Notifications.showNotification("error", t("app.notification.permission.app-notification.error"))
      }
    })().catch(trackError)
  }, [Notifications, onHide, t])

  if (!props.open) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white text-gray-900 px-6 py-4 rounded-lg shadow-xl cursor-pointer flex items-center justify-center min-w-[300px] border border-gray-200"
      onClick={requestPermission}
    >
      <HorizontalLayout alignItems="center">
        <HiBell className="text-gray-600 mr-3 w-5 h-5" />
        <span className="font-medium uppercase text-sm tracking-wide">
          {t("app.notification.permission.app-notification.message")}
        </span>
      </HorizontalLayout>
    </div>
  )
})

export default PermissionNotification
