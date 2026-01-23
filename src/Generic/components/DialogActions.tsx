import React from "react"
import { useTranslation } from "react-i18next"
import { HiX } from "react-icons/hi2"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { MobileKeyboardOpenedSelector } from "~App/theme"
import { setupRerenderListener } from "~Platform/keyboard-hack"
import ButtonIconLabel from "~Generic/components/ButtonIconLabel"
import { Dialog, DialogTitle, DialogContent, DialogActions } from "./Dialog"

const closeIcon = <HiX className="w-5 h-5" />

interface MaybeIconProps {
  icon?: React.ReactNode
  label: React.ReactNode
  loading?: boolean
}

function MaybeIcon(props: MaybeIconProps) {
  return (
    <>
      <ButtonIconLabel label={props.label} loading={props.loading}>
        {props.icon}
      </ButtonIconLabel>
    </>
  )
}

interface ActionButtonProps {
  autoFocus?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  form?: string
  icon?: React.ReactNode
  loading?: boolean
  onClick?: (event: React.SyntheticEvent) => void
  style?: React.CSSProperties
  variant?: "text" | "outlined" | "contained"
  type?: "primary" | "secondary" | "submit"
}

export function ActionButton(props: ActionButtonProps) {
  const { type = "secondary" } = props
  const isSmallScreen = useIsMobile()
  const autoVariant = !isSmallScreen && (props.type === "secondary" || !props.type) ? "text" : "contained"
  const variant = props.variant || autoVariant

  const baseClasses = "flex items-center justify-center rounded transition-colors duration-200"
  const variantClasses =
    variant === "contained"
      ? type === "primary" || type === "submit"
        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      : "bg-transparent text-blue-600 hover:bg-blue-50"

  const mobileClasses =
    "flex-grow mx-3 p-5 first:basis-[calc(50%-16px)] first:ml-[6px] last:basis-[calc(50%-16px)] last:mr-[6px] basis-[calc(100%-24px)]"
  const desktopClasses = "shadow-none py-[10px] px-5"

  return (
    <button
      autoFocus={props.autoFocus}
      className={`
        ${baseClasses}
        ${variantClasses}
        ${isSmallScreen ? mobileClasses : desktopClasses}
        ${props.disabled || props.loading ? "opacity-50 cursor-not-allowed" : ""}
        ${props.className || ""}
      `}
      disabled={props.disabled || props.loading}
      form={props.form}
      onClick={props.onClick}
      style={props.style}
      type={type === "submit" ? "submit" : "button"}
    >
      <MaybeIcon icon={props.icon} label={props.children} loading={props.loading} />
    </button>
  )
}

export function CloseButton(props: { form?: string; onClick?: (event: React.SyntheticEvent) => void }) {
  const { t } = useTranslation()
  return (
    <ActionButton form={props.form} icon={closeIcon} onClick={props.onClick} type="secondary">
      {t("generic.dialog-actions.close.label")}
    </ActionButton>
  )
}

interface MobileDialogActionsBoxProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
  hidden?: boolean
  smallDialog?: boolean
  transparent?: boolean
}

const MobileDialogActionsBox = React.memo(
  React.forwardRef(function MobileDialogActionsBox(props: MobileDialogActionsBoxProps, ref: React.Ref<HTMLDivElement>) {
    return (
      <>
        <style>{`
          ${MobileKeyboardOpenedSelector()} {
            .mobile-dialog-actions-box {
              position: static !important;
            }
            .mobile-inline-space-placeholder {
              display: none !important;
            }
          }
        `}</style>
        {props.smallDialog ? null : (
          // Placeholder to prevent other dialog content from being hidden below the actions box
          // Make sure its height matches the height of the actions box
          <div
            className={`
              flex-none max-h-[88px] overflow-hidden transition-all duration-300 ease-in-out z-[1]
              w-full !h-[88px] mobile-inline-space-placeholder
              ${props.hidden ? "max-h-0 pt-0 pb-0" : ""}
            `}
          />
        )}
        <div
          className={[
            "iphone-notch-bottom-spacing",
            "flex-none max-h-[88px] overflow-hidden transition-all duration-300 ease-in-out z-[1]",
            "flex fixed left-2 right-2 bottom-0 bg-[#fcfcfc] justify-end mobile-dialog-actions-box",
            props.className || "",
            props.hidden ? "max-h-0 pt-0 pb-0" : "",
            props.transparent ? "bg-transparent" : ""
          ].join(" ")}
          ref={ref}
        >
          {props.children}
        </div>
      </>
    )
  })
)

interface DialogActionsBoxProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
  desktopStyle?: React.CSSProperties
  hidden?: boolean
  preventMobileActionsBox?: boolean
  smallDialog?: boolean
  transparent?: boolean
}

export const DialogActionsBox = React.memo(
  React.forwardRef(function DialogActionsBox(props: DialogActionsBoxProps, ref: React.Ref<HTMLDivElement>) {
    const isSmallScreen = useIsMobile()

    React.useEffect(() => {
      // Little hack to force re-rendering the dialog when the keyboard closes
      // to prevent broken UI to be shown
      const elements = document.querySelectorAll(".dialog-body")
      const unsubscribe = setupRerenderListener(elements)

      return unsubscribe
    }, [])

    if (isSmallScreen && !props.preventMobileActionsBox) {
      return (
        <MobileDialogActionsBox
          className={props.className}
          hidden={props.hidden}
          ref={ref}
          smallDialog={props.smallDialog}
          transparent={props.transparent}
        >
          {props.children}
        </MobileDialogActionsBox>
      )
    }

    return (
      <DialogActions
        className={`
          flex-none max-h-[88px] overflow-hidden transition-all duration-300 ease-in-out z-[1]
          items-stretch mt-8 py-2 md:justify-center md:-mx-3
          ${props.hidden ? "max-h-0 pt-0 pb-0" : ""}
          ${props.className || ""}
        `}
        style={props.desktopStyle}
      >
        <div ref={ref} className="contents">
            {props.children}
        </div>
      </DialogActions>
    )
  })
)

interface ConfirmDialogProps {
  children: React.ReactNode
  cancelButton: React.ReactNode
  confirmButton: React.ReactNode
  onClose: () => void
  open: boolean
  title: string
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const isSmallScreen = useIsMobile()
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent style={{ paddingBottom: isSmallScreen ? 24 : undefined }}>
        <p className="text-sm text-gray-700">{props.children}</p>
        <DialogActionsBox preventMobileActionsBox smallDialog>
          {props.cancelButton}
          {props.confirmButton}
        </DialogActionsBox>
      </DialogContent>
    </Dialog>
  )
}
