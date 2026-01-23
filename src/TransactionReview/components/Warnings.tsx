import React from "react"
import { useTranslation } from "react-i18next"
import { HiExclamationTriangle } from "react-icons/hi2"

interface WarningProps {
  primary: React.ReactNode
  secondary?: React.ReactNode
  style?: React.CSSProperties
}

const Warning = React.memo(function Warning(props: WarningProps) {
  return (
    <div className="flex items-center bg-warning mb-4 px-4 py-3 rounded" style={props.style}>
      <div className="flex-shrink-0 min-w-[40px]">
        <HiExclamationTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 ml-4">
        <div className="text-base font-medium">{props.primary}</div>
        {props.secondary && <div className="text-sm text-gray-600 mt-1">{props.secondary}</div>}
      </div>
    </div>
  )
})

export function AccountCreationWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.account-creation-warning.primary")}
      secondary={t("account.transaction-review.account-creation-warning.secondary")}
    />
  )
}

export function AddingSignerWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.add-signer-warning.primary")}
      secondary={t("account.transaction-review.add-signer-warning.secondary")}
    />
  )
}

export function DangerousTransactionWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.dangerous-transaction-warning.primary")}
      secondary={t("account.transaction-review.dangerous-transaction-warning.secondary")}
    />
  )
}
