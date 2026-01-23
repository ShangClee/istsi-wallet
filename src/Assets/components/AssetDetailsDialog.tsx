import React from "react"
import { useTranslation } from "react-i18next"
import { Asset } from "stellar-sdk"
// Styles converted to Tailwind - see className usage below
import { Account } from "~App/contexts/accounts"
import { useAccountData, useAssetMetadata, useStellarToml } from "~Generic/hooks/stellar"
import { useClipboard, useIsMobile } from "~Generic/hooks/userinterface"
import { BASE_RESERVE, parseAssetID } from "~Generic/lib/stellar"
import { openLink } from "~Platform/links"
// breakpoints removed - using Tailwind responsive classes
import { StellarTomlCurrency } from "~shared/types/stellar-toml"
import { SingleBalance } from "~Account/components/AccountBalances"
import DialogBody from "~Layout/components/DialogBody"
import { AccountName } from "~Generic/components/Fetchers"
import { ReadOnlyTextfield } from "~Generic/components/FormFields"
import { VerticalLayout } from "~Layout/components/Box"
import MainTitle from "~Generic/components/MainTitle"
import AssetDetailsActions from "./AssetDetailsActions"
import AssetLogo from "./AssetLogo"
import SpendableBalanceBreakdown from "./SpendableBalanceBreakdown"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"

const capitalize = (text: string) => text[0].toUpperCase() + text.substr(1)

// Styles converted to Tailwind - see className usage below

interface LumenDetailProps {
  account: Account
}

const LumenDetails = React.memo(function LumenDetails(props: LumenDetailProps) {
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const { t } = useTranslation()

  return (
    <>
      <div className="bg-[#fbfbfb] rounded-lg my-3 -mx-2 overflow-y-auto">
        <div className="relative px-4 py-2">
          <ReadOnlyTextfield
            disableUnderline
            fullWidth
            label={t("account.asset-details.lumen.description.label")}
            multiline
            value={t("account.asset-details.lumen.description.text")}
          />
        </div>
      </div>
      <div className="bg-[#fbfbfb] rounded-lg my-3 -mx-2 overflow-y-auto">
        <div className="relative px-4 py-2">
          <SpendableBalanceBreakdown account={props.account} accountData={accountData} baseReserve={BASE_RESERVE} />
        </div>
      </div>
    </>
  )
})

interface AssetDetailProps {
  account: Account
  asset: Asset
  metadata: StellarTomlCurrency | undefined
}

const AssetDetails = React.memo(function AssetDetails({ account, asset, metadata }: AssetDetailProps) {
  const issuingAccountData = useAccountData(asset.issuer, account.testnet)
  const stellarToml = useStellarToml(issuingAccountData.home_domain)

  const clipboard = useClipboard()
  const { t } = useTranslation()

  const copyIssuerToClipboard = React.useCallback(() => clipboard.copyToClipboard(asset.getIssuer()), [
    asset,
    clipboard
  ])

  return (
    <>
      <div className="bg-[#fbfbfb] rounded-lg my-3 -mx-2 overflow-y-auto">
        <div className="relative px-4 py-2">
          {metadata && metadata.desc ? (
            <ReadOnlyTextfield
              disableUnderline
              fullWidth
              label={t("account.asset-details.general.description.label")}
              margin="dense"
              multiline
              value={metadata.desc}
            />
          ) : null}
          <ReadOnlyTextfield
            disableUnderline
            fullWidth
            label={t("account.asset-details.general.issuing-account.label")}
            margin="dense"
            onClick={copyIssuerToClipboard}
            value={asset.getIssuer()}
            inputProps={{
              style: {
                cursor: "pointer",
                textOverflow: "ellipsis"
              }
            }}
          />
          <ReadOnlyTextfield
            disableUnderline
            fullWidth
            label={t("account.asset-details.general.account-flags.label")}
            margin="dense"
            multiline
            value={capitalize(
              [
                issuingAccountData.flags.auth_required
                  ? `• ${t("account.asset-details.general.account-flags.auth-required")}`
                  : `• ${t("account.asset-details.general.account-flags.auth-not-required")}`,
                issuingAccountData.flags.auth_revocable
                  ? `• ${t("account.asset-details.general.account-flags.auth-revocable")}`
                  : `• ${t("account.asset-details.general.account-flags.auth-not-revocable")}`,
                issuingAccountData.flags.auth_immutable
                  ? `• ${t("account.asset-details.general.account-flags.auth-immutable")}`
                  : `• ${t("account.asset-details.general.account-flags.auth-mutable")}`
              ].join("\n")
            )}
          />
          {metadata && metadata.conditions ? (
            <ReadOnlyTextfield
              disableUnderline
              fullWidth
              label={t("account.asset-details.general.conditions.label")}
              margin="dense"
              multiline
              value={metadata.conditions}
            />
          ) : null}
          {metadata && metadata.anchor_asset_type ? (
            <ReadOnlyTextfield
              disableUnderline
              fullWidth
              label={t("account.asset-details.general.anchor-asset.label")}
              margin="dense"
              multiline
              value={
                metadata.anchor_asset
                  ? `${capitalize(metadata.anchor_asset)} (${capitalize(metadata.anchor_asset_type)})`
                  : capitalize(metadata.anchor_asset_type)
              }
            />
          ) : null}
          {metadata && metadata.redemption_instructions ? (
            <ReadOnlyTextfield
              disableUnderline
              fullWidth
              label={t("account.asset-details.general.redemption-instructions.label")}
              margin="dense"
              multiline
              value={metadata.redemption_instructions}
            />
          ) : null}
        </CardContent>
      </Card>
      {stellarToml && stellarToml.DOCUMENTATION ? (
        <div className="bg-[#fbfbfb] rounded-lg my-3 -mx-2 overflow-y-auto">
          <div className="relative px-4 py-2">
            {stellarToml.DOCUMENTATION.ORG_LOGO ? (
              <div className="absolute top-2 right-2 w-18 h-18 bg-white rounded-full shadow-[0_0_2px_2px_rgba(0,0,0,0.2)] overflow-hidden">
                <img
                  alt="Organization logo"
                  className="w-full h-full object-cover"
                  src={stellarToml.DOCUMENTATION.ORG_LOGO}
                />
              </div>
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_NAME ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.name.label")}
                margin="dense"
                value={stellarToml.DOCUMENTATION.ORG_NAME}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_DBA ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.dba.label")}
                margin="dense"
                value={stellarToml.DOCUMENTATION.ORG_DBA}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_URL ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.website.label")}
                margin="dense"
                onClick={() => openLink(stellarToml!.DOCUMENTATION!.ORG_URL!)}
                value={stellarToml.DOCUMENTATION.ORG_URL}
                inputProps={{
                  style: {
                    cursor: "pointer",
                    textDecoration: "underline"
                  }
                }}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_DESCRIPTION ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.description.label")}
                margin="dense"
                multiline
                value={stellarToml.DOCUMENTATION.ORG_DESCRIPTION}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_PHYSICAL_ADDRESS ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.address.label")}
                margin="dense"
                multiline
                value={stellarToml.DOCUMENTATION.ORG_PHYSICAL_ADDRESS}
                inputProps={{
                  style: {
                    whiteSpace: "pre"
                  }
                }}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_OFFICIAL_EMAIL ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.email.label")}
                margin="dense"
                multiline
                onClick={() => openLink("mailto:" + stellarToml!.DOCUMENTATION!.ORG_OFFICIAL_EMAIL!)}
                value={stellarToml.DOCUMENTATION.ORG_OFFICIAL_EMAIL}
                inputProps={{
                  style: {
                    cursor: "pointer",
                    textDecoration: "underline"
                  }
                }}
              />
            ) : null}
            {stellarToml.DOCUMENTATION.ORG_PHONE_NUMBER ? (
              <ReadOnlyTextfield
                disableUnderline
                fullWidth
                label={t("account.asset-details.general.organisation.phone-number.label")}
                margin="dense"
                multiline
                value={stellarToml.DOCUMENTATION.ORG_PHONE_NUMBER}
              />
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </>
  )
})

// Styles converted to Tailwind - see className usage below

interface Props {
  account: Account
  assetID: string
  onClose: () => void
}

function AssetDetailsDialog(props: Props) {
  const accountData = useAccountData(props.account.accountID, props.account.testnet)
  const asset = React.useMemo(() => parseAssetID(props.assetID), [props.assetID])
  const isSmallScreen = useIsMobile()

  const balance = accountData.balances.find(
    asset.isNative()
      ? bal => bal.asset_type === "native"
      : bal =>
          bal.asset_type !== "native" &&
          bal.asset_type !== "liquidity_pool_shares" &&
          bal.asset_issuer === asset.issuer &&
          bal.asset_code === asset.code
  )

  const metadata = useAssetMetadata(asset, props.account.testnet)

  const dialogActions = React.useMemo(
    () => (asset.isNative() ? null : <AssetDetailsActions account={props.account} asset={asset} />),
    [props.account, asset]
  )

  return (
    <DialogBody
      excessWidth={8}
      top={
        <>
          <MainTitle
            nowrap
            onBack={props.onClose}
            style={{ position: "relative", zIndex: 1 }}
            title={
              asset.isNative()
                ? "Stellar Lumens (XLM)"
                : metadata && metadata.name
                ? `${metadata.name} (${asset.getCode()})`
                : asset.getCode()
            }
            titleStyle={{
              maxWidth: isSmallScreen ? "calc(100% - 75px)" : "calc(100% - 100px)",
              textShadow: "0 0 5px white, 0 0 5px white, 0 0 5px white"
            }}
          />
          <p className="text-base font-medium">
            {balance ? (
              <SingleBalance assetCode={asset.getCode()} balance={balance.balance} />
            ) : asset.isNative() ? (
              "stellar.org"
            ) : (
              <AccountName publicKey={asset.getIssuer()} testnet={props.account.testnet} />
            )}
          </p>
          <AssetLogo
            asset={asset}
            className="absolute top-1 -right-1 w-24 h-24 sm:w-16 sm:h-16 text-2xl sm:text-lg shadow-[0_0_8px_2px_rgba(0,0,0,0.2)]"
            testnet={props.account.testnet}
          />
        </>
      }
      actions={dialogActions}
      actionsPosition="bottom"
      fitToShrink
    >
      <VerticalLayout margin="0 4px" padding={`0 0 ${isSmallScreen ? 68 : 0}px`} shrink={0}>
        {asset.isNative() ? (
          <LumenDetails account={props.account} />
        ) : (
          <AssetDetails account={props.account} asset={asset} metadata={metadata} />
        )}
      </VerticalLayout>
    </DialogBody>
  )
}

export default AssetDetailsDialog
