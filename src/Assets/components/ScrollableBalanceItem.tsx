import React from "react"
import { balancelineToAsset } from "~Generic/lib/stellar"
import { SingleBalance } from "~Account/components/AccountBalances"
import { BalanceLine } from "~Generic/lib/account"
import AssetLogo from "./AssetLogo"

export function getBalanceItemMinMaxWidth() {
  if (window.innerWidth < 350) {
    return [90, 90 * 1.5]
  } else if (window.innerWidth < 600) {
    return [100, 100 * 1.5]
  } else {
    return [130, 130 * 1.5]
  }
}

interface BalanceItemProps {
  balance: BalanceLine
  compact?: boolean
  onClick?: () => void
  testnet: boolean
}

function BalanceItem(props: BalanceItemProps, ref: React.Ref<any>) {
  const asset = React.useMemo(() => balancelineToAsset(props.balance), [props.balance])
  const compact = props.compact

  const rootBase = "flex items-center flex-none justify-start opacity-90 px-4 py-2"
  const rootMinW = compact
    ? "min-w-[80px] min-[350px]:min-w-[90px] min-[600px]:min-w-[100px]"
    : "min-w-[90px] min-[350px]:min-w-[100px] min-[600px]:min-w-[130px]"
  const clickableClass = props.onClick ? "rounded-md cursor-pointer opacity-100 hover:bg-white/5" : ""
  const rootClass = `${rootBase} ${rootMinW} ${clickableClass}`

  const logoBase = "shadow-[0_0_2px_#fff] box-border m-0 mr-4 pointer-events-none"
  const logoSize = compact
    ? "text-[8px] !mr-2.5 w-6 h-6"
    : "w-9 h-9 min-[400px]:w-10 min-[400px]:h-10"
  const logoClass = `${logoBase} ${logoSize}`

  const balanceBase = "mt-0 text-left"
  const balanceText = compact
    ? "text-base [&_span]:!font-light [&_span]:!opacity-100"
    : "text-sm leading-[18px] min-[600px]:text-base min-[600px]:leading-5"
  const balanceClass = `${balanceBase} ${balanceText}`

  const assetCodeClass = `block font-bold ${compact ? "hidden" : ""}`

  return (
    <div
      className={rootClass}
      onClick={props.onClick}
      ref={ref}
    >
      <AssetLogo asset={asset} className={logoClass} testnet={props.testnet} />
      <div className={balanceClass}>
        <span className={assetCodeClass}>
          {props.balance.asset_type === "native"
            ? "XLM"
            : props.balance.asset_type === "liquidity_pool_shares"
            ? "LP"
            : props.balance.asset_code}
        </span>
        <SingleBalance assetCode="" balance={props.balance.balance} inline />
      </div>
    </div>
  )
}

export default React.memo(React.forwardRef(BalanceItem))
