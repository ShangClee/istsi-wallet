import React from "react"
import { useTranslation } from "react-i18next"
import { SendIcon } from "~Generic/components/Icons"
import { Account } from "~App/contexts/accounts"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import QRCodeIcon from "~Icons/components/QRCode"

interface AccountActionsProps {
  account: Account
  bottomOfScreen?: boolean
  hidden?: boolean
  onCreatePayment: () => void
  onReceivePayment: () => void
}

function AccountActions(props: AccountActionsProps) {
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  
  const buttonBaseClass = "border-none rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.1)] text-base flex-1 p-5"
  const secondaryButtonClass = "bg-white text-[#0290c0]"
  
  const containerClass = [
    props.bottomOfScreen ? "" : "m-0 pt-6 space-x-10",
    props.hidden ? "!pt-0" : ""
  ].filter(Boolean).join(" ")

  const isDisabled =
    accountData.balances.length === 0 || !accountData.signers.some(signer => signer.key === props.account.publicKey)
  const { t } = useTranslation()
  return (
    <DialogActionsBox className={containerClass} hidden={props.hidden}>
      <ActionButton
        className={`${buttonBaseClass} ${secondaryButtonClass}`}
        icon={<QRCodeIcon style={{ fontSize: "110%" }} />}
        onClick={props.onReceivePayment}
        variant="contained"
      >
        {t("account.action.receive")}
      </ActionButton>
      <ActionButton
        className={buttonBaseClass}
        disabled={isDisabled}
        icon={<SendIcon style={{ fontSize: "110%" }} />}
        onClick={props.onCreatePayment}
        type="primary"
      >
        {t("account.action.send")}
      </ActionButton>
    </DialogActionsBox>
  )
}

export default React.memo(AccountActions)
