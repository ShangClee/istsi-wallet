import React from "react"
import { useTranslation } from "react-i18next"
import { useDialogActions, useIsMobile } from "~Generic/hooks/userinterface"
import { Dialog } from "~Generic/components/Dialog"
import DialogBody from "~Layout/components/DialogBody"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import Portal from "~Generic/components/Portal"

interface Props {
  message: React.ReactNode
  onClose: () => void
  onConfirm: () => void
  open: boolean
}

function LegalConfirmation(props: Props) {
  const dialogActionsRef = useDialogActions()
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  const actions = React.useMemo(
    () => (
      <DialogActionsBox className={isSmallScreen ? "z-[1400]" : ""} smallDialog transparent>
        <ActionButton onClick={props.onConfirm} type="primary">
          {t("account.purchase-lumens.legal-confirmation.action.confirm")}
        </ActionButton>
      </DialogActionsBox>
    ),
    [isSmallScreen, props.onConfirm, t]
  )

  return (
    <Dialog
      className={isSmallScreen ? "!self-end !mb-[120px] !mx-5 bg-white/90" : ""}
      onClose={props.onClose}
      open={props.open}
    >
      <DialogBody actions={dialogActionsRef} preventActionsPlaceholder preventNotchSpacing>
        <p className="text-gray-500 m-0">{props.message}</p>
      </DialogBody>
      <Portal target={isSmallScreen ? document.body : dialogActionsRef.element}>{actions}</Portal>
    </Dialog>
  )
}

export default React.memo(LegalConfirmation)
