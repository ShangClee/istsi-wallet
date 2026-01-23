import React from "react"
import { useTranslation } from "react-i18next"
import { SettingsContext } from "~App/contexts/settings"
import { useStellarToml } from "~Generic/hooks/stellar"
import { ActionButton, ConfirmDialog } from "~Generic/components/DialogActions"
import { List, ListItem } from "~Layout/components/List"

const CloudIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    className={className}
  >
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
)

const RemoveCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
  </svg>
)

const Avatar = ({ src, alt, className, children }: { src?: string; alt?: string; className?: string; children?: React.ReactNode }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${className || ""}`}>
    {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : children}
  </div>
)

interface TrustedServiceListItemProps {
  index: number
  onDeleteClick?: (event: React.MouseEvent, index: number) => void
  trustedService: TrustedService
  style?: React.CSSProperties
}

const TrustedServiceListItem = React.memo(function TrustedServiceListItem(props: TrustedServiceListItemProps) {
  const stellarToml = useStellarToml(props.trustedService.domain)
  const imageURL = stellarToml && stellarToml.DOCUMENTATION && stellarToml.DOCUMENTATION.ORG_LOGO
  const orgName = stellarToml && stellarToml.DOCUMENTATION && stellarToml.DOCUMENTATION.ORG_NAME
  const name = orgName || props.trustedService.domain

  return (
    <ListItem
      className="bg-white shadow-[0_8px_12px_0_rgba(0,0,0,0.1)] first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-0"
      leftIcon={
        imageURL ? (
          <Avatar alt={name} className="bg-white" src={imageURL} />
        ) : (
          <Avatar alt={name} className="bg-black/50 text-white">
            <CloudIcon />
          </Avatar>
        )
      }
      primaryText={orgName ? orgName : props.trustedService.domain}
      secondaryText={props.trustedService.domain}
      rightIcon={
        <button
          type="button"
          onClick={event => props.onDeleteClick && props.onDeleteClick(event, props.index)}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <RemoveCircleIcon />
        </button>
      }
    />
  )
})

const TrustedServiceList = React.memo(function TrustedServiceList() {
  const { t } = useTranslation()
  const { setSetting, trustedServices } = React.useContext(SettingsContext)
  const [confirmationPending, setConfirmationPending] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const onDelete = () => {
    const selectedService = trustedServices[selectedIndex]
    if (!selectedService) {
      return
    }

    const newTrustedServices = trustedServices.filter(service => service.domain !== selectedService.domain)
    setSetting("trustedServices", newTrustedServices)
  }

  const onConfirm = () => {
    setConfirmationPending(false)
    setSelectedIndex(-1)
    onDelete()
  }

  return (
    <>
      <List className="bg-transparent pb-4">
        {trustedServices
          .sort((a, b) => a.domain.localeCompare(b.domain))
          .map((service, index) => (
            <TrustedServiceListItem
              index={index}
              key={service.domain}
              onDeleteClick={() => {
                setSelectedIndex(index)
                setConfirmationPending(true)
              }}
              trustedService={service}
            />
          ))}
      </List>
      {trustedServices.length === 0 ? (
        <div className="text-center text-gray-500">
          ({t("app-settings.trusted-services.service-selection.no-services")})
        </div>
      ) : null}
      <ConfirmDialog
        cancelButton={
          <ActionButton onClick={() => setConfirmationPending(false)}>
            {t("app-settings.trusted-services.service-selection.action.cancel")}
          </ActionButton>
        }
        confirmButton={
          <ActionButton onClick={onConfirm} type="primary">
            {t("app-settings.trusted-services.service-selection.action.confirm")}
          </ActionButton>
        }
        open={confirmationPending}
        onClose={() => setConfirmationPending(false)}
        title={t("app-settings.trusted-services.service-selection.confirm.title")}
      >
        {t("app-settings.trusted-services.service-selection.confirm.text")}
      </ConfirmDialog>
    </>
  )
})

export default React.memo(TrustedServiceList)
