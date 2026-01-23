import React from "react"
import { useTranslation } from "react-i18next"
import { HiEye, HiTrash, HiUserGroup, HiKey } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { SettingsContext } from "~App/contexts/settings"
import * as routes from "~App/routes"
import { Address } from "~Generic/components/PublicKey"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { useIsMobile, useRouter } from "~Generic/hooks/userinterface"
import { matchesRoute } from "~Generic/lib/routes"
import Carousel from "~Layout/components/Carousel"
import ManageSignersDialog from "~ManageSigners/components/ManageSignersDialog"
import AccountDeletionDialog from "./AccountDeletionDialog"
import AccountSettingsItem from "./AccountSettingsItem"
import ChangePasswordDialog from "./ChangePasswordDialog"
import ExportKeyDialog from "./ExportKeyDialog"

function SettingsDialogs(props: Props) {
  const router = useRouter()

  const showChangePassword = matchesRoute(router.location.pathname, routes.changeAccountPassword("*"))
  const showDeleteAccount = matchesRoute(router.location.pathname, routes.deleteAccount("*"))
  const showExportKey = matchesRoute(router.location.pathname, routes.exportSecretKey("*"))
  const showManageSigners = matchesRoute(router.location.pathname, routes.manageAccountSigners("*"))

  const navigateTo = React.useMemo(
    () => ({
      accountSettings: () => router.history.push(routes.accountSettings(props.account.id)),
      allAccounts: () => router.history.push(routes.allAccounts())
    }),
    [router.history, props.account]
  )

  return (
    <>
      <div style={{ display: showChangePassword ? undefined : "none", height: "100%" }}>
        <ChangePasswordDialog account={props.account} onClose={navigateTo.accountSettings} />
      </div>
      <div style={{ display: showDeleteAccount ? undefined : "none", height: "100%" }}>
        <AccountDeletionDialog
          account={props.account}
          onClose={navigateTo.accountSettings}
          onDeleted={navigateTo.allAccounts}
        />
      </div>
      <div style={{ display: showExportKey ? undefined : "none", height: "100%" }}>
        <ExportKeyDialog account={props.account} onClose={navigateTo.accountSettings} variant="export" />
      </div>
      <div style={{ display: showManageSigners ? undefined : "none", height: "100%" }}>
        <ManageSignersDialog account={props.account} onClose={navigateTo.accountSettings} />
      </div>
    </>
  )
}

interface SuspendedItemProps {
  account: Account
  listItemTextStyle?: React.CSSProperties
  onClick: () => void
}

function MultiSigItem(props: SuspendedItemProps) {
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  const disabled = Boolean(
    !accountData.balances.length || !accountData.signers.some(signer => signer.key === props.account.publicKey)
  )

  const ListItemSecondaryContent = props.account.cosignerOf ? (
    <>
      {t("account-settings.settings.multi-sig.text.secondary.cosigner-of")}{" "}
      <Address address={props.account.cosignerOf} testnet={props.account.testnet} />
    </>
  ) : isSmallScreen ? (
    t("account-settings.settings.multi-sig.text.secondary.short")
  ) : (
    t("account-settings.settings.multi-sig.text.secondary.long")
  )

  return (
    <AccountSettingsItem
      caret="right"
      disabled={disabled}
      icon={<HiUserGroup className="text-[28px]" />}
      onClick={props.onClick}
    >
      <div className="flex-1 min-w-0" style={props.listItemTextStyle}>
        <div className="text-base font-medium">{t("account-settings.settings.multi-sig.text.primary")}</div>
        <div className="text-sm text-gray-600">{ListItemSecondaryContent}</div>
      </div>
    </AccountSettingsItem>
  )
}

function DeleteAccountItem(props: SuspendedItemProps) {
  // call useLiveAccountData to make sure this item is suspended until the account data is available
  // necessary because the AccountDeletion dialog needs account data and would be suspended anyways
  useLiveAccountData(props.account.publicKey, props.account.testnet)
  const { t } = useTranslation()

  return (
    <AccountSettingsItem caret="right" icon={<HiTrash className="text-[28px]" />} onClick={props.onClick}>
      <div className="flex-1 min-w-0" style={props.listItemTextStyle}>
        <div className="text-base font-medium">{t("account-settings.settings.delete-account.text.primary")}</div>
      </div>
    </AccountSettingsItem>
  )
}

interface Props {
  account: Account
}

function AccountSettings(props: Props) {
  const isSmallScreen = useIsMobile()
  const router = useRouter()
  const { t } = useTranslation()
  const settings = React.useContext(SettingsContext)

  const navigateTo = React.useMemo(
    () => ({
      changePassword: () => router.history.push(routes.changeAccountPassword(props.account.id)),
      deleteAccount: () => router.history.push(routes.deleteAccount(props.account.id)),
      exportSecretKey: () => router.history.push(routes.exportSecretKey(props.account.id)),
      manageSigners: () => router.history.push(routes.manageAccountSigners(props.account.id))
    }),
    [router.history, props.account]
  )

  const showSettingsOverview = matchesRoute(router.location.pathname, routes.accountSettings(props.account.id), true)

  const listItemTextStyle: React.CSSProperties = React.useMemo(
    () => ({
      paddingRight: isSmallScreen ? 0 : undefined
    }),
    [isSmallScreen]
  )

  return (
    <Carousel current={showSettingsOverview ? 0 : 1}>
      <div className={isSmallScreen ? "p-0" : "px-4 py-6"}>
        <AccountSettingsItem
          caret="right"
          icon={<HiKey className="text-[28px]" />}
          onClick={navigateTo.changePassword}
        >
          <div className="flex-1 min-w-0" style={listItemTextStyle}>
            <div className="text-base font-medium">
              {props.account.requiresPassword
                ? t("account-settings.settings.set-password.text.primary.account-protected")
                : t("account-settings.settings.set-password.text.primary.account-not-protected")}
            </div>
            <div className="text-sm text-gray-600">
              {props.account.requiresPassword
                ? t("account-settings.settings.set-password.text.secondary.account-protected")
                : t("account-settings.settings.set-password.text.secondary.account-not-protected")}
            </div>
          </div>
        </AccountSettingsItem>
        {settings.multiSignature ? (
          <React.Suspense fallback={null}>
            <MultiSigItem {...props} listItemTextStyle={listItemTextStyle} onClick={navigateTo.manageSigners} />
          </React.Suspense>
        ) : null}
        <AccountSettingsItem
          caret="right"
          icon={<HiEye className="text-[28px]" />}
          onClick={navigateTo.exportSecretKey}
        >
          <div className="flex-1 min-w-0" style={listItemTextStyle}>
            <div className="text-base font-medium">{t("account-settings.settings.export-secret-key.text.primary")}</div>
            <div className="text-sm text-gray-600">{t("account-settings.settings.export-secret-key.text.secondary")}</div>
          </div>
        </AccountSettingsItem>
        <React.Suspense fallback={null}>
          <DeleteAccountItem {...props} listItemTextStyle={listItemTextStyle} onClick={navigateTo.deleteAccount} />
        </React.Suspense>
      </div>
      <SettingsDialogs account={props.account} />
    </Carousel>
  )
}

export default React.memo(AccountSettings)
