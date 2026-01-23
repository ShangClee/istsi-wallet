import React from "react"
import { useTranslation } from "react-i18next"
import { Horizon, Operation, Transaction } from "stellar-sdk"
import { DialogContent } from "~Generic/components/Dialog"
import { HiTrash, HiExclamationTriangle } from "react-icons/hi2"
import AccountSelectionList from "~Account/components/AccountSelectionList"
import { Account, AccountsContext } from "~App/contexts/accounts"
import { createTransaction } from "~Generic/lib/transaction"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { useIsMobile, useIsSmallMobile } from "~Generic/hooks/userinterface"
import { ActionButton, ConfirmDialog, DialogActionsBox } from "~Generic/components/DialogActions"
import MainTitle from "~Generic/components/MainTitle"
import MergeIcon from "~Icons/components/Merge"
import DialogBody from "~Layout/components/DialogBody"
import { HorizontalLayout } from "~Layout/components/Box"
import TransactionSender from "~Transaction/components/TransactionSender"

const redText: React.CSSProperties = {
  color: "red"
}

interface DeletionConfirmationDialogProps {
  merging: boolean
  onCancel: () => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
}

const DeletionConfirmationDialog = React.memo(function DeletionConfirmationDialog(
  props: DeletionConfirmationDialogProps
) {
  const { t } = useTranslation()
  return (
    <ConfirmDialog
      cancelButton={
        <ActionButton onClick={props.onCancel}>{t("account-settings.account-deletion.action.cancel")}</ActionButton>
      }
      confirmButton={
        <ActionButton onClick={props.onConfirm} type="primary">
          {t("account-settings.account-deletion.action.confirm")}
        </ActionButton>
      }
      open={props.open}
      onClose={props.onClose}
      title={t("account-settings.account-deletion.confirm.title")}
    >
      {t("account-settings.account-deletion.confirm.text.delete")}
      {props.merging ? ` ${t("account-settings.account-deletion.confirm.text.merge")}. ` : ". "}
      {t("account-settings.account-deletion.confirm.text.confirm")}
    </ConfirmDialog>
  )
})

interface WarningDialogProps {
  onClose: () => void
  open: boolean
  title: string
  warning: React.ReactNode
}

const WarningDialog = React.memo(function WarningDialog(props: WarningDialogProps) {
  const { t } = useTranslation()
  return (
    <ConfirmDialog
      cancelButton={null}
      confirmButton={
        <ActionButton onClick={props.onClose} type="primary">
          {t("account-settings.account-deletion.warning-dialog.close.label")}
        </ActionButton>
      }
      onClose={props.onClose}
      open={props.open}
      title={props.title}
    >
      {props.warning}
    </ConfirmDialog>
  )
})

interface Warning {
  open: boolean
  text: string
  title: string
}

interface AccountDeletionDialogProps {
  account: Account
  horizon: Horizon.Server
  onClose: () => void
  onDelete: () => void
  sendTransaction: (transaction: Transaction) => void
}

function AccountDeletionDialog(props: AccountDeletionDialogProps) {
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const horizon = props.horizon

  const { accounts } = React.useContext(AccountsContext)
  const [mergeAccountEnabled, setMergeAccountEnabled] = React.useState(false)
  const [confirmationPending, setConfirmationPending] = React.useState(false)
  const [selectedMergeAccount, setSelectedMergeAccount] = React.useState<Account | null>(null)
  const [warning, setWarning] = React.useState<Warning | undefined>()

  const { t } = useTranslation()
  const isSmallScreen = useIsMobile()
  const isTinyScreen = useIsSmallMobile()

  const cancelConfirmation = React.useCallback(() => setConfirmationPending(false), [setConfirmationPending])
  const toggleMergeAccount = React.useCallback(() => setMergeAccountEnabled(enabled => !enabled), [])

  const closeWarning = React.useCallback(() => {
    setWarning(prev => (prev ? { ...prev, open: false } : undefined))
  }, [setWarning])

  const onMerge = async () => {
    if (selectedMergeAccount) {
      const transaction = await createTransaction(
        [
          Operation.accountMerge({
            source: props.account.accountID,
            destination: selectedMergeAccount.publicKey
          })
        ],
        { accountData, horizon, walletAccount: props.account }
      )

      await props.sendTransaction(transaction)
    }
  }

  const onConfirm = () => {
    setConfirmationPending(false)
    if (mergeAccountEnabled) {
      onMerge()
    } else {
      props.onDelete()
    }
  }

  const requestConfirmation = React.useCallback(() => {
    if (mergeAccountEnabled && accountData.subentry_count > 0) {
      setWarning({
        open: true,
        text: t("account-settings.account-deletion.warnings.cannot-merge.text"),
        title: t("account-settings.account-deletion.warnings.cannot-merge.title")
      })
    } else {
      setConfirmationPending(true)
    }
  }, [accountData, mergeAccountEnabled, setConfirmationPending, setWarning, t])

  const remainingFundsContent = React.useMemo(
    () =>
      accountData.balances.length > 0 ? (
        <>
          <HorizontalLayout alignItems="center" style={{ marginTop: 24, marginLeft: -12, marginBottom: 8 }}>
            <button
              role="switch"
              aria-checked={mergeAccountEnabled}
              onClick={toggleMergeAccount}
              className={`${
                mergeAccountEnabled ? "bg-blue-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span
                className={`${
                  mergeAccountEnabled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <h6
              onClick={toggleMergeAccount}
              className="flex items-center h-12 cursor-pointer text-lg sm:text-xl ml-2"
            >
              {t("account-settings.account-deletion.remaining-funds.text")}
            </h6>
          </HorizontalLayout>

          <AccountSelectionList
            disabled={!mergeAccountEnabled}
            accounts={accounts.filter(
              account =>
                account.accountID !== props.account.accountID &&
                account.publicKey !== props.account.publicKey &&
                account.testnet === props.account.testnet
            )}
            testnet={props.account.testnet}
            onChange={setSelectedMergeAccount}
          />
        </>
      ) : null,
    [
      accountData.balances.length,
      mergeAccountEnabled,
      toggleMergeAccount,
      isSmallScreen,
      t,
      accounts,
      props.account.accountID,
      props.account.publicKey,
      props.account.testnet
    ]
  )

  return (
    <DialogBody
      background={<HiExclamationTriangle className="text-[160px] text-gray-300" />}
      noMaxWidth
      preventNotchSpacing
      top={
        <MainTitle
          hideBackButton
          title={<span style={redText}>{t("account-settings.account-deletion.title")}</span>}
          titleColor="inherit"
          onBack={props.onClose}
          style={{ marginTop: 0, marginLeft: 0 }}
        />
      }
      actions={
        <DialogActionsBox>
          {mergeAccountEnabled ? (
            <ActionButton
              autoFocus
              disabled={!selectedMergeAccount}
              icon={<MergeIcon />}
              onClick={requestConfirmation}
              type="primary"
            >
              {isTinyScreen
                ? t("account-settings.account-deletion.action.merge.short")
                : t("account-settings.account-deletion.action.merge.long")}
            </ActionButton>
          ) : (
            <ActionButton autoFocus icon={<HiTrash className="w-5 h-5" />} onClick={requestConfirmation} type="primary">
              {t("account-settings.account-deletion.action.delete")}
            </ActionButton>
          )}
        </DialogActionsBox>
      }
    >
      <DialogContent style={{ padding: 0 }}>
        <p className="text-base text-gray-700 mt-2">
          {t("account-settings.account-deletion.text.1", { accountName: props.account.name })}
        </p>
        <p
          className="text-base text-gray-700 mt-4"
          style={{ display: accountData.balances.length > 0 ? undefined : "none" }}
        >
          {t("account-settings.account-deletion.text.2")}
        </p>

        {remainingFundsContent}

        <DeletionConfirmationDialog
          merging={mergeAccountEnabled}
          onCancel={cancelConfirmation}
          onClose={cancelConfirmation}
          onConfirm={onConfirm}
          open={confirmationPending}
        />
        <WarningDialog
          onClose={closeWarning}
          open={Boolean(warning?.open)}
          title={warning?.title || ""}
          warning={warning?.text}
        />
      </DialogContent>
    </DialogBody>
  )
}

interface AccountDeletionContainerProps {
  account: Account
  onClose: () => void
  onDeleted: () => void
}

function AccountDeletionContainer(props: AccountDeletionContainerProps) {
  const { deleteAccount } = React.useContext(AccountsContext)

  const onDelete = () => {
    deleteAccount(props.account.id)
    props.onClose()
    props.onDeleted()
  }

  return (
    <TransactionSender account={props.account} onSubmissionCompleted={onDelete}>
      {txContext => <AccountDeletionDialog {...props} {...txContext} onDelete={onDelete} />}
    </TransactionSender>
  )
}

export default AccountDeletionContainer
