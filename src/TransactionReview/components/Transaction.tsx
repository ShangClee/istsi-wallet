import React from "react"
import { useTranslation } from "react-i18next"
import { Horizon, Memo, Transaction, Networks } from "stellar-sdk"
import { HiCheck, HiArrowPath } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { AccountData } from "~Generic/lib/account"
import { MultisigTransactionResponse } from "~Generic/lib/multisig-service"
import { hasSigned } from "~Generic/lib/transaction"
import { Address } from "~Generic/components/PublicKey"
import MemoMessage from "~Transaction/components/MemoMessage"
import { SummaryDetailsField, SummaryItem } from "./SummaryItem"

function SignerStatus(props: { hasSigned: boolean; style?: React.CSSProperties }) {
  const { t } = useTranslation()
  const Icon = props.hasSigned ? HiCheck : HiArrowPath
  const title = props.hasSigned
    ? t("account.transaction-review.signer-status.tooltip.has-signed")
    : t("account.transaction-review.signer-status.tooltip.has-not-signed")
  return (
    <div className="relative group">
      <Icon
        className={`${props.hasSigned ? "opacity-100" : "opacity-50"}`}
        style={props.style}
        title={title}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
        {title}
      </div>
    </div>
  )
}

// tslint:disable-next-line no-shadowed-variable
const Signer = React.memo(function Signer(props: {
  hasSigned: boolean
  signer: Horizon.HorizonApi.AccountSigner | { key: string; weight: number }
  style?: React.CSSProperties
  transaction: Transaction
}) {
  const isSmallScreen = useIsMobile()
  const testnet = props.transaction.networkPassphrase === Networks.TESTNET

  return (
    <div style={{ display: "flex", alignItems: "center", ...props.style }}>
      <SignerStatus hasSigned={props.hasSigned} style={{ fontSize: "100%", marginRight: 8 }} />
      <div style={{ whiteSpace: "nowrap" }}>
        <Address
          address={props.signer.key}
          style={{ display: "inline-block", fontWeight: "normal", minWidth: 480 }}
          testnet={testnet}
          variant={isSmallScreen ? "short" : "full"}
        />
      </div>
    </div>
  )
})

export function Signers(props: {
  accounts: Account[]
  accountData: AccountData
  signatureRequest?: MultisigTransactionResponse
  transaction: Transaction
  style?: React.CSSProperties
}) {
  const threshold = props.accountData.thresholds.high_threshold || 1
  const { t } = useTranslation()

  // TODO: We should not get the signers from the source account data, but either
  //       a) from the signature request or
  //       b) by taking the tx source and all operation source accounts into account
  const headingDetails =
    props.accountData.signers.length === 1
      ? t("account.transaction-review.signers.heading-details.single-signature")
      : props.accountData.signers.every(signer => signer.weight === 1)
      ? t(
          "account.transaction-review.signers.heading-details.default-signatures",
          `${threshold} of ${props.accountData.signers.length} multi-signature`,
          { threshold, length: props.accountData.signers.length }
        )
      : t("account.transaction-review.signers.heading-details.custom-consensus")

  return (
    <SummaryItem>
      <SummaryDetailsField
        label={t("account.transaction-review.signers.label", `Signers (${headingDetails})`, {
          details: headingDetails
        })}
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column"
        }}
        value={props.accountData.signers.map((signer, index) => (
          <Signer
            hasSigned={hasSigned(props.transaction, signer.key, props.signatureRequest)}
            key={index}
            signer={signer}
            transaction={props.transaction}
          />
        ))}
      />
    </SummaryItem>
  )
}

export function TransactionMemo(props: { memo: Memo; style?: React.CSSProperties }) {
  const { t } = useTranslation()
  if (props.memo.type === "none" || !props.memo.value) return null

  const typeLabel = props.memo.type.substr(0, 1).toUpperCase() + props.memo.type.substr(1)

  return (
    <SummaryItem>
      <SummaryDetailsField
        fullWidth
        label={t("account.transaction-review.transaction-memo.label", `${typeLabel} Memo`, { type: typeLabel })}
        value={<MemoMessage memo={props.memo} />}
      />
    </SummaryItem>
  )
}
