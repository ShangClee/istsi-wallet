import React from "react"
import { useTranslation } from "react-i18next"
import { useAssetMetadata } from "~Generic/hooks/stellar"
import { balancelineToAsset } from "~Generic/lib/stellar"
import { SingleBalance } from "~Account/components/AccountBalances"
import { BalanceLine } from "~Generic/lib/account"
import { AccountName } from "~Generic/components/Fetchers"
import AssetLogo from "./AssetLogo"

export const actionsSize = 36

// Styles converted to Tailwind - see className usage below

interface BalanceListItemProps {
  badgeCount?: number | string
  balance: BalanceLine
  className?: string
  hideBalance?: boolean
  hideLogo?: boolean
  onClick?: () => void
  spendableBalance?: boolean
  style?: React.CSSProperties
  testnet: boolean
}

function BalanceListItem(props: BalanceListItemProps) {
  const baseClassName = `flex items-center py-3 px-4 border-b border-gray-100 ${props.onClick ? "cursor-pointer hover:bg-gray-50 active:bg-gray-100" : ""} ${props.className || ""}`

  const asset = React.useMemo(() => balancelineToAsset(props.balance), [props.balance])
  const assetMetadata = useAssetMetadata(asset, props.testnet)
  const { t } = useTranslation()

  const balance = React.useMemo(
    () => (props.hideBalance ? null : <SingleBalance assetCode={""} balance={props.balance.balance} />),
    [props.balance.balance, props.hideBalance]
  )

  if (props.balance.asset_type === "native") {
    return (
      <div className={baseClassName} onClick={props.onClick} style={props.style}>
        <div className="min-w-[56px] max-[350px]:min-w-[48px] flex items-center justify-center">
          <AssetLogo
            asset={asset}
            className={`max-[350px]:w-9 max-[350px]:h-9 ${props.hideLogo ? "invisible" : ""}`}
            testnet={props.testnet}
          />
        </div>
        <div className="flex-1 min-w-0 whitespace-nowrap ml-4">
          <div className="overflow-hidden text-ellipsis text-base max-[400px]:text-[15px] max-[350px]:text-[13px]">
            {props.spendableBalance
              ? t("account.balance-details.item.spendable-balance.primary")
              : "Stellar Lumens (XLM)"}
          </div>
          {!props.spendableBalance && (
            <div className="overflow-hidden text-ellipsis text-sm text-gray-600 max-[400px]:text-sm max-[350px]:text-xs">
              stellar.org
            </div>
          )}
        </div>
        <div className="flex-1 flex-shrink-0 ml-2 text-right">
          <div className="text-[140%] max-[350px]:text-[120%]">{balance}</div>
        </div>
      </div>
    )
  }

  const assetCode =
    (props.balance as any).asset_type === "native"
      ? "XLM"
      : props.balance.asset_type === "liquidity_pool_shares"
      ? "LP"
      : props.balance.asset_code
  const assetIssuer =
    (props.balance as any).asset_type === "native" || props.balance.asset_type === "liquidity_pool_shares"
      ? ""
      : props.balance.asset_issuer

  const assetName = (assetMetadata && assetMetadata.name) || assetCode
  const title = assetName !== assetCode ? `${assetName} (${assetCode})` : assetCode

  return (
    <div className={baseClassName} onClick={props.onClick} style={props.style}>
      <div className="min-w-[56px] max-[350px]:min-w-[48px] flex items-center justify-center relative">
        {props.badgeCount ? (
          <div className="relative">
            <AssetLogo
              asset={asset}
              className={`max-[350px]:w-9 max-[350px]:h-9 ${props.hideLogo ? "invisible" : ""}`}
              dark
              testnet={props.testnet}
            />
            <span className="absolute -top-1 -right-1 bg-brand-main text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-[0_0_3px_1px_white]">
              {props.badgeCount}
            </span>
          </div>
        ) : (
          <AssetLogo
            asset={asset}
            className={`max-[350px]:w-9 max-[350px]:h-9 ${props.hideLogo ? "invisible" : ""}`}
            dark
            testnet={props.testnet}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 whitespace-nowrap ml-4">
        <div className="overflow-hidden text-ellipsis text-base max-[400px]:text-[15px] max-[350px]:text-[13px]">
          {title}
        </div>
        {assetIssuer && (
          <div className="overflow-hidden text-ellipsis text-sm text-gray-600 max-[400px]:text-sm max-[350px]:text-xs">
            <AccountName publicKey={assetIssuer} testnet={props.testnet} />
          </div>
        )}
      </div>
      <div className="flex-1 flex-shrink-0 ml-2 text-right">
        <div className="text-[140%] max-[350px]:text-[120%]">{balance}</div>
      </div>
    </div>
  )
}

export default React.memo(BalanceListItem)
