import React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Asset, Horizon, Operation } from "stellar-sdk"
import { HiXMark } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { DialogContent, DialogTitle } from "~Generic/components/Dialog"
import { trackError } from "~App/contexts/notifications"
import { AccountData } from "~Generic/lib/account"
import { createTransaction } from "~Generic/lib/transaction"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import TransactionSender, { SendTransaction } from "~Transaction/components/TransactionSender"

interface Props {
  account: Account
  accountData: AccountData
  asset: Asset
  horizon: Horizon.Server
  onClose: () => void
  onRemoved: () => void
  sendTransaction: SendTransaction
}

const RemoveTrustlineDialog = React.memo(function RemoveTrustlineDialog(props: Props) {
  const { t } = useTranslation()
  const [txCreationPending, setTxCreationPending] = React.useState(false)

  const removeAsset = async () => {
    try {
      setTxCreationPending(true)
      const operations = [Operation.changeTrust({ asset: props.asset, limit: "0" })]
      const transaction = await createTransaction(operations, {
        accountData: props.accountData,
        horizon: props.horizon,
        walletAccount: props.account
      })
      setTxCreationPending(false)
      await props.sendTransaction(transaction)
      props.onRemoved()
    } catch (error) {
      setTxCreationPending(false)
      trackError(error)
    }
  }

  const assetBalance = (props.accountData.balances as Horizon.HorizonApi.BalanceLineAsset[]).find(
    balance => balance.asset_code === props.asset.getCode() && balance.asset_issuer === props.asset.getIssuer()
  )
  const stillOwnsTokens = assetBalance && parseFloat(assetBalance.balance) > 0

  return (
    <>
      <DialogTitle>{t("account.remove-trustline.title")}</DialogTitle>
      <DialogContent>
        <p className="text-base text-gray-700 mb-4">
          {stillOwnsTokens ? (
            <>{t("account.remove-trustline.text.warning")}</>
          ) : (
            <Trans i18nKey="account.remove-trustline.text.info">
              You are about to remove <b>{props.asset.code}</b> from account "{props.account.name}".
            </Trans>
          )}
        </p>
        {/* Not in the DialogBody's `actions` prop as it's not a fullscreen dialog */}
        <DialogActionsBox preventMobileActionsBox>
          <ActionButton onClick={props.onClose} style={{ maxWidth: "none" }}>
            {t("account.remove-trustline.action.cancel")}
          </ActionButton>
          {stillOwnsTokens ? null : (
            <ActionButton
              autoFocus
              disabled={stillOwnsTokens}
              loading={txCreationPending}
              icon={<HiXMark className="w-5 h-5" />}
              onClick={removeAsset}
              style={{ maxWidth: "none" }}
              type="primary"
            >
              {t("account.remove-trustline.action.remove")}
            </ActionButton>
          )}
        </DialogActionsBox>
      </DialogContent>
    </>
  )
})

function ConnectedRemoveTrustlineDialog(props: Omit<Props, "balances" | "horizon" | "sendTransaction">) {
  return (
    <TransactionSender account={props.account} onSubmissionCompleted={props.onClose}>
      {({ horizon, sendTransaction }) => (
        <RemoveTrustlineDialog
          {...props}
          accountData={props.accountData}
          horizon={horizon}
          sendTransaction={sendTransaction}
        />
      )}
    </TransactionSender>
  )
}

export default React.memo(ConnectedRemoveTrustlineDialog)
