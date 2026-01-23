import React from "react"
import { useTranslation } from "react-i18next"
import {
  HiArrowRight,
  HiArrowDownTray,
  HiListBullet,
  HiCurrencyDollar,
  HiCog,
  HiArrowsRightLeft
} from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { SettingsContextType } from "~App/contexts/settings"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { useIsMobile } from "~Generic/hooks/userinterface"
import ContextMenu, { AnchorRenderProps } from "~Generic/components/ContextMenu"

// Styles converted to Tailwind - see className usage below

interface ItemProps {
  disabled?: boolean
  hidden?: boolean
  icon: React.ReactElement<any>
  label: string
  onClick: () => void
}

const AccountContextMenuItem = React.memo(
  React.forwardRef((props: ItemProps, ref: React.Ref<HTMLButtonElement>) => {
    if (props.hidden) {
      return null
    }
    return (
      <button
        ref={ref}
        onClick={props.onClick}
        disabled={props.disabled}
        className={`
          w-full text-left px-4 py-3 flex items-center gap-6
          hover:bg-gray-50 active:bg-gray-100
          transition-colors
          ${props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `.trim().replace(/\s+/g, " ")}
      >
        <span className="flex-shrink-0 w-6 min-w-[24px]">{props.icon}</span>
        <span className="flex-1 text-base">{props.label}</span>
      </button>
    )
  })
)

interface MenuProps {
  account: Account
  children: (anchorProps: AnchorRenderProps) => React.ReactNode
  onAccountSettings?: () => void
  onAccountTransactions?: () => void
  onDeposit?: () => void
  onManageAssets?: () => void
  onPurchaseLumens?: () => void
  onTrade?: () => void
  onWithdraw?: () => void
  settings: SettingsContextType
  showingSettings: boolean
}

function LiveAccountContextMenuItems(
  props: MenuProps & { closeAndCall: (fn: (() => void) | undefined) => () => void }
) {
  const { closeAndCall } = props

  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const isFunded = accountData.balances.length > 0
  const isSigner = accountData.signers.some(signer => signer.key === props.account.publicKey)
  const activated = isFunded && isSigner
  const { t } = useTranslation()

  return (
    <>
      <AccountContextMenuItem
        disabled={!activated || !props.onTrade}
        icon={<HiArrowsRightLeft className="w-6 h-6 scale-125" />}
        label={t("account.context-menu.trade.label")}
        onClick={closeAndCall(props.onTrade)}
      />
      <AccountContextMenuItem
        disabled={!isSigner || !props.onDeposit}
        icon={<HiArrowDownTray className="w-6 h-6" />}
        label={t("account.context-menu.deposit.label")}
        onClick={closeAndCall(accountData.balances.length > 1 ? props.onDeposit : props.onPurchaseLumens)}
      />
      <AccountContextMenuItem
        disabled={!activated || !props.onWithdraw}
        icon={<HiArrowRight className="w-6 h-6" />}
        label={t("account.context-menu.withdraw.label")}
        onClick={closeAndCall(props.onWithdraw)}
      />
      <hr className="my-1 border-gray-200" />
      <AccountContextMenuItem
        disabled={!activated || !props.onManageAssets}
        icon={<HiCurrencyDollar className="w-6 h-6" />}
        label={t("account.context-menu.assets-and-balances.label")}
        onClick={closeAndCall(props.onManageAssets)}
      />
    </>
  )
}

function AccountContextMenu(props: MenuProps) {
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  return (
    <ContextMenu
      anchor={props.children}
      menu={({ anchorEl, open, onClose, closeAndCall }) => (
        <div
          className={`
            fixed z-50 bg-white shadow-lg rounded-lg min-w-[200px] py-2
            ${open ? "block" : "hidden"}
            ${isSmallScreen ? "bottom-0 left-0 right-0 rounded-b-none" : ""}
          `.trim().replace(/\s+/g, " ")}
          style={
            isSmallScreen
              ? {}
              : anchorEl
                ? {
                    position: "absolute",
                    top: anchorEl.getBoundingClientRect().bottom + window.scrollY,
                    left: anchorEl.getBoundingClientRect().left + window.scrollX
                  }
                : {}
          }
          onClick={e => e.stopPropagation()}
        >
          <React.Suspense fallback={null}>
            <LiveAccountContextMenuItems closeAndCall={closeAndCall} {...props} />
          </React.Suspense>
          {props.showingSettings ? (
            <AccountContextMenuItem
              disabled={!props.onAccountTransactions}
              icon={<HiListBullet className="w-6 h-6" />}
              label={t("account.context-menu.transactions.label")}
              onClick={closeAndCall(props.onAccountTransactions)}
            />
          ) : (
            <AccountContextMenuItem
              disabled={!props.onAccountSettings}
              icon={<HiCog className="w-6 h-6" />}
              label={t("account.context-menu.account-settings.label")}
              onClick={closeAndCall(props.onAccountSettings)}
            />
          )}
        </div>
      )}
    />
  )
}

export default React.memo(AccountContextMenu)
