import BigNumber from "big.js"
import React from "react"
import { useTranslation } from "react-i18next"
import { Account } from "~App/contexts/accounts"
import { AccountData } from "~Generic/lib/account"
import { SingleBalance } from "~Account/components/AccountBalances"
import { List, ListItem } from "~Layout/components/List"

interface BreakdownItemProps {
  amount: string
  hide?: boolean
  indent?: boolean
  primary: React.ReactNode
  secondary?: React.ReactNode
  style?: React.CSSProperties
  variant?: "deduction" | "gross" | "total"
}

function BreakdownItem(props: BreakdownItemProps) {
  const { variant = "deduction" } = props

  if (props.hide) {
    return null
  }
  
  const indentClass = props.indent ? "ml-3 sm:ml-6" : ""

  return (
    <ListItem
      className="py-0"
      style={props.style}
      primaryText={
        <span className={`block truncate text-base sm:text-lg font-light ${indentClass}`}>
          {props.primary}
        </span>
      }
      secondaryText={
        props.secondary ? (
          <span className={`block truncate text-xs sm:text-sm text-gray-500 ${indentClass}`}>
            {props.secondary}
          </span>
        ) : null
      }
      rightIcon={
        <div className="text-right text-xl font-light whitespace-nowrap ml-2">
          {variant === "deduction" ? "-" : variant === "gross" ? "" : "="}
          &nbsp;
          <SingleBalance assetCode="" balance={props.amount} />
        </div>
      }
    />
  )
}

const BreakdownHeadline = React.memo(function BreakdownHeadline(props: { left?: string; right?: string }) {
  return (
    <ListItem
      className="py-0 border-b-0"
      primaryText={
        <span className="block truncate text-base sm:text-lg font-light">
          {props.left}
        </span>
      }
      rightIcon={
        <div className="text-right text-lg sm:text-xl font-light whitespace-nowrap my-0">
          {props.right}
        </div>
      }
    />
  )
})

interface Props {
  account: Account
  accountData: AccountData
  baseReserve: number
  style?: React.CSSProperties
}

function SpendableBalanceBreakdown(props: Props) {
  const { t } = useTranslation()

  const nativeBalance = props.accountData.balances.find(balance => balance.asset_type === "native")
  const trustedAssetBalances = props.accountData.balances.filter(balance => balance.asset_type !== "native")

  const dataReserve = props.baseReserve * Object.keys(props.accountData.data_attr).length
  const signersReserve = props.baseReserve * props.accountData.signers.length
  const trustlinesReserve = props.baseReserve * trustedAssetBalances.length
  const sellingLiabilities = nativeBalance ? BigNumber(nativeBalance.selling_liabilities) : BigNumber(0)

  // calculate open orders reserve based on subentry count to circumvent fetching all orders
  const openOrdersReserve = BigNumber(props.accountData.subentry_count * props.baseReserve)
    .minus(props.baseReserve * (props.accountData.signers.length - 1))
    .minus(dataReserve)
    .minus(trustlinesReserve)

  const rawBalance = nativeBalance ? BigNumber(nativeBalance.balance) : BigNumber(0)
  const spendableBalance = rawBalance
    .minus(props.baseReserve)
    .minus(dataReserve)
    .minus(openOrdersReserve)
    .minus(signersReserve)
    .minus(trustlinesReserve)
    .minus(sellingLiabilities)

  return (
    <List style={{ padding: 0 }} className="p-0">
      <BreakdownHeadline right={t("account.balance-details.spendable-balances.headline")} />
      <BreakdownItem
        amount={rawBalance.toFixed(4)}
        primary={t("account.balance-details.spendable-balances.total-balance.primary")}
        secondary={t("account.balance-details.spendable-balances.total-balance.secondary")}
        style={props.style}
        variant="gross"
      />
      <BreakdownItem
        amount={props.baseReserve.toFixed(1)}
        indent
        primary={t("account.balance-details.spendable-balances.base-reserve.primary")}
        secondary={t("account.balance-details.spendable-balances.base-reserve.secondary")}
        style={props.style}
      />
      <BreakdownItem
        amount={signersReserve.toFixed(1)}
        indent
        primary={t("account.balance-details.spendable-balances.signers-reserve.primary")}
        secondary={
          props.accountData.signers.length === 1
            ? t("account.balance-details.spendable-balances.signers-reserve.secondary.single-key")
            : t("account.balance-details.spendable-balances.signers-reserve.secondary.multiple-keys")
        }
        style={props.style}
      />
      <BreakdownItem
        amount={trustlinesReserve.toFixed(1)}
        hide={trustlinesReserve === 0}
        indent
        primary={t("account.balance-details.spendable-balances.trustline-reserve.primary")}
        secondary={t("account.balance-details.spendable-balances.trustline-reserve.secondary")}
        style={props.style}
      />
      <BreakdownItem
        amount={openOrdersReserve.toFixed(1)}
        hide={openOrdersReserve.cmp(0) === 0}
        indent
        primary={t("account.balance-details.spendable-balances.open-orders-reserve.primary")}
        secondary={t("account.balance-details.spendable-balances.open-orders-reserve.secondary")}
        style={props.style}
      />
      <BreakdownItem
        amount={dataReserve.toFixed(1)}
        hide={dataReserve === 0}
        indent
        primary={t("account.balance-details.spendable-balances.data-reserve.primary")}
        secondary={t("account.balance-details.spendable-balances.data-reserve.secondary")}
        style={props.style}
      />
      <BreakdownItem
        amount={sellingLiabilities.toString()}
        hide={sellingLiabilities.eq(0)}
        indent
        primary={t("account.balance-details.spendable-balances.selling-liabilities.primary")}
        secondary={t("account.balance-details.spendable-balances.selling-liabilities.secondary")}
        style={props.style}
      />
      <BreakdownItem
        amount={spendableBalance.toString()}
        primary={t("account.balance-details.spendable-balances.spendable-balance.primary")}
        secondary={t("account.balance-details.spendable-balances.spendable-balance.secondary")}
        style={props.style}
        variant="total"
      />
    </List>
  )
}

export default React.memo(SpendableBalanceBreakdown)
