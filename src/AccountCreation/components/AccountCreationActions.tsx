/**
 * Contains the action buttons for the account creation flow.
 * It needs to be mounted outside of the actual account creation view.
 */

import React from "react"
import { useTranslation } from "react-i18next"
import { CheckIcon } from "~Generic/components/Icons"
import { useRouter } from "~Generic/hooks/userinterface"
import { matchesRoute } from "~Generic/lib/routes"
import * as routes from "~App/routes"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"

interface AccountCreationActionsProps {
  bottomOfScreen?: boolean
  onActionButtonClick: () => void
  testnet: boolean
}

function AccountCreationActions(props: AccountCreationActionsProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const buttonBaseClass = "border-none rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.1)] text-base flex-1 p-5"
  const inlineButtonClass = "basis-auto grow-0 !px-5 !py-2.5"
  
  const boxClassName = props.bottomOfScreen 
    ? "" 
    : "pt-6 my-4 px-10 space-x-10"
    
  const buttonClassName = `${buttonBaseClass} ${props.bottomOfScreen ? "" : inlineButtonClass}`

  return (
    <DialogActionsBox className={boxClassName}>
      {(() => {
        if (matchesRoute(router.location.pathname, routes.createAccount(props.testnet))) {
          return (
            <ActionButton
              className={buttonClassName}
              icon={<CheckIcon style={{ fontSize: "120%" }} />}
              onClick={props.onActionButtonClick}
              type="primary"
            >
              {t("create-account.action.create")}
            </ActionButton>
          )
        } else if (matchesRoute(router.location.pathname, routes.importAccount(props.testnet))) {
          return (
            <ActionButton
              className={buttonClassName}
              icon={<CheckIcon style={{ fontSize: "120%" }} />}
              onClick={props.onActionButtonClick}
              type="primary"
            >
              {t("create-account.action.import")}
            </ActionButton>
          )
        } else if (matchesRoute(router.location.pathname, routes.joinSharedAccount(props.testnet))) {
          return (
            <ActionButton
              className={buttonClassName}
              icon={<CheckIcon style={{ fontSize: "120%" }} />}
              onClick={props.onActionButtonClick}
              type="primary"
            >
              {t("create-account.action.join-shared")}
            </ActionButton>
          )
        } else {
          return null
        }
      })()}
    </DialogActionsBox>
  )
}

export default React.memo(AccountCreationActions)
