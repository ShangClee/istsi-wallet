import React from "react"
import { useTranslation } from "react-i18next"
import { Asset, AssetType, Horizon, Operation, Transaction } from "stellar-sdk"
import { Dialog } from "~Generic/components/Dialog"
import { HiPlus } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { trackError } from "~App/contexts/notifications"
import * as routes from "~App/routes"
// CompactDialogTransition removed - using CSS transitions in Dialog component
import ButtonListItem from "~Generic/components/ButtonListItem"
import { AccountName } from "~Generic/components/Fetchers"
import { SearchField } from "~Generic/components/FormFields"
import MainTitle from "~Generic/components/MainTitle"
import ViewLoading from "~Generic/components/ViewLoading"
import { FixedSizeList } from "~Generic/components/VirtualList"
import { AssetRecord, useTickerAssets, useWellKnownAccounts } from "~Generic/hooks/stellar-ecosystem"
import { useRouter } from "~Generic/hooks/userinterface"
import { AccountData } from "~Generic/lib/account"
import * as popularAssets from "~Generic/lib/popularAssets"
import { assetRecordToAsset, stringifyAsset } from "~Generic/lib/stellar"
import { createTransaction } from "~Generic/lib/transaction"
import { VerticalLayout } from "~Layout/components/Box"
import DialogBody from "~Layout/components/DialogBody"
import TransactionSender from "~Transaction/components/TransactionSender"
import BalanceDetailsListItem from "./BalanceDetailsListItem"
import CustomTrustlineDialog from "./CustomTrustline"

function assetRecordMatches(assetRecord: AssetRecord, search: string) {
  search = search.toLowerCase()
  return assetRecord.code.toLowerCase().startsWith(search) || assetRecord.name.toLowerCase().startsWith(search)
}

function issuerMatches(issuerDetails: AssetRecord["issuer_detail"], search: string) {
  search = search.toLowerCase()
  return issuerDetails.name.toLowerCase().startsWith(search)
}

function assetToBalance(asset: Asset): Horizon.HorizonApi.BalanceLineAsset {
  return {
    asset_code: asset.getCode(),
    asset_issuer: asset.getIssuer(),
    asset_type: asset.getAssetType() as AssetType.credit4 | AssetType.credit12,
    balance: "0",
    is_authorized: true,
    is_authorized_to_maintain_liabilities: true,
    last_modified_ledger: 0,
    limit: "0",
    buying_liabilities: "0",
    selling_liabilities: "0",
    is_clawback_enabled: false
  }
}

function groupAssets(values: AssetRecord[], createKey: (arg: AssetRecord) => string) {
  const map: { [issuer: string]: AssetRecord[] } = {}

  for (const value of values) {
    const key = createKey(value)
    const existingValues = map[key]
    existingValues ? existingValues.push(value) : (map[key] = [value])
  }

  return map
}

interface PopularAssetsProps {
  assets: Asset[]
  onOpenAssetDetails: (asset: Asset) => void
  testnet: boolean
}

const PopularAssets = React.memo(function PopularAssets(props: PopularAssetsProps) {
  return (
    <>
      {props.assets.map(asset => (
        <BalanceDetailsListItem
          key={stringifyAsset(asset)}
          balance={assetToBalance(asset)}
          hideBalance
          onClick={() => props.onOpenAssetDetails(asset)}
          testnet={props.testnet}
        />
      ))}
    </>
  )
})

const searchResultRowHeight = 73

// Styles converted to Tailwind - see className usage below

function createSearchResultRow(
  account: Account,
  assetsByIssuer: Record<string, AssetRecord[]>,
  openAssetDetails: (asset: Asset) => void
) {
  // tslint:disable-next-line interface-over-type-literal
  type AssetItemRecord = { type: "asset"; issuer: string; record: AssetRecord }
  // tslint:disable-next-line interface-over-type-literal
  type IssuerItemRecord = { type: "issuer"; issuer: string }

  const itemRenderMap: Array<AssetItemRecord | IssuerItemRecord> = []

  for (const issuer of Object.keys(assetsByIssuer)) {
    itemRenderMap.push({
      type: "issuer",
      issuer
    })
    itemRenderMap.push(
      ...assetsByIssuer[issuer].map(
        (assetRecord: AssetRecord): AssetItemRecord => ({
          type: "asset",
          issuer,
          record: assetRecord
        })
      )
    )
  }

  function SearchResultRow(props: { index: number; style: React.CSSProperties }) {
    const item = itemRenderMap[props.index]
    const { t } = useTranslation()

    return (
      <div style={props.style}>
        <React.Suspense fallback={<ViewLoading />}>
          {item.type === "issuer" ? (
            <div key={item.issuer} className="bg-white rounded-lg h-[73px] flex items-center px-4">
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium overflow-hidden text-ellipsis">
                  {item.issuer === "native" ? (
                    "stellar.org"
                  ) : (
                    <AccountName publicKey={item.issuer} testnet={account.testnet} />
                  )}
                </div>
                <div className="text-sm text-gray-600 overflow-hidden text-ellipsis">
                  {assetsByIssuer[item.issuer].length === 1
                    ? t("account.add-asset.item.issuer.secondary.one-asset")
                    : t("account.add-asset.item.issuer.secondary.more-than-one-asset", {
                        amount: assetsByIssuer[item.issuer].length
                      })}
                </div>
              </div>
            </div>
          ) : null}
          {item.type === "asset" ? (
            <BalanceDetailsListItem
              balance={assetToBalance(assetRecordToAsset(item.record))}
              className="rounded-none h-[73px]"
              hideBalance
              onClick={() => openAssetDetails(assetRecordToAsset(item.record))}
              style={{ paddingLeft: 32 }}
              testnet={account.testnet}
            />
          ) : null}
        </React.Suspense>
      </div>
    )
  }

  function NoResultRow() {
    const { t } = useTranslation()

    return (
      <div key={0} className="bg-white rounded-lg h-[73px] flex items-center px-4">
        <div className="flex-1">
          <div className="text-base font-medium">{t("account.add-asset.item.no-result.primary")}</div>
          <div className="text-sm text-gray-600">{t("account.add-asset.item.no-result.secondary")}</div>
        </div>
      </div>
    )
  }

  if (itemRenderMap.length > 0) {
    SearchResultRow.count = itemRenderMap.length
    return SearchResultRow
  } else {
    NoResultRow.count = 1
    return NoResultRow
  }
}

interface AddAssetDialogProps {
  account: Account
  accountData: AccountData
  horizon: Horizon.Server
  hpadding: number
  itemHPadding: number
  onClose: () => void
  sendTransaction: (transaction: Transaction, signatureRequest?: null) => void
}

const AddAssetDialog = React.memo(function AddAssetDialog(props: AddAssetDialogProps) {
  const assets = props.account.testnet ? popularAssets.testnet : popularAssets.mainnet
  const containerRef = React.useRef<HTMLUListElement | null>(null)
  const allAssets = useTickerAssets(props.account.testnet)
  const router = useRouter()
  const { t } = useTranslation()
  const wellKnownAccounts = useWellKnownAccounts(props.account.testnet)
  const [customTrustlineDialogOpen, setCustomTrustlineDialogOpen] = React.useState(false)
  const [searchFieldValue, setSearchFieldValue] = React.useState("")
  const [txCreationPending, setTxCreationPending] = React.useState(false)

  const openAssetDetails = React.useCallback(
    (asset: Asset) => router.history.push(routes.assetDetails(props.account.id, stringifyAsset(asset))),
    [router.history, props.account.id]
  )

  const openCustomTrustlineDialog = () => setCustomTrustlineDialogOpen(true)
  const closeCustomTrustlineDialog = () => setCustomTrustlineDialogOpen(false)

  const createAddAssetTransaction = async (asset: Asset, options: { limit?: string } = {}) => {
    const operations = [Operation.changeTrust({ asset, limit: options.limit })]
    return createTransaction(operations, {
      accountData: props.accountData,
      horizon: props.horizon,
      walletAccount: props.account
    })
  }

  const sendTransaction = async (createTransactionToSend: () => Promise<Transaction>) => {
    try {
      setTxCreationPending(true)
      const transaction = await createTransactionToSend()
      setTxCreationPending(false)
      await props.sendTransaction(transaction)
    } catch (error) {
      setTxCreationPending(false)
      trackError(error)
    }
  }

  const isAssetAlreadyAdded = (asset: Asset) => {
    return props.accountData.balances.some(
      (balance: any) => balance.asset_code === asset.code && balance.asset_issuer === asset.issuer
    )
  }

  const wellknownAccountMatches = React.useCallback(
    (accountID: string, search: string) => {
      const lowerCasedSearch = search.toLowerCase()
      const record = wellKnownAccounts.lookup(accountID)

      if (!record) {
        return false
      }
      return (
        record.domain.toLowerCase().includes(lowerCasedSearch) || record.name.toLowerCase().includes(lowerCasedSearch)
      )
    },
    [wellKnownAccounts]
  )

  const notYetAddedAssets = assets.filter(asset => !isAssetAlreadyAdded(asset))

  const onSearchFieldChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setSearchFieldValue(event.target.value)
  }, [])

  const assetsByIssuer = React.useMemo(() => {
    const filteredAssets = allAssets.filter(
      assetRecord =>
        assetRecordMatches(assetRecord, searchFieldValue) ||
        issuerMatches(assetRecord.issuer_detail, searchFieldValue) ||
        wellknownAccountMatches(assetRecord.issuer, searchFieldValue)
    )

    return groupAssets(filteredAssets, assetRecord => assetRecord.issuer)
  }, [allAssets, searchFieldValue, wellknownAccountMatches])

  const SearchResultRow = React.useMemo(() => createSearchResultRow(props.account, assetsByIssuer, openAssetDetails), [
    props.account,
    assetsByIssuer,
    openAssetDetails
  ])

  return (
    <DialogBody excessWidth={24} top={<MainTitle onBack={props.onClose} title={t("account.add-asset.title")} />}>
      <VerticalLayout grow margin="16px 0 0">
        <SearchField
          autoFocus
          className="bg-white flex-shrink-0 flex-grow-0 mb-4"
          inputProps={{
            className: "text-base"
          }}
          onChange={onSearchFieldChange}
          value={searchFieldValue}
          placeholder={t("account.add-asset.search-field.placeholder")}
        />
        <div className="mt-4 p-0">
          <ButtonListItem onClick={openCustomTrustlineDialog}>
            <HiPlus className="w-6 h-6" />
            &nbsp;&nbsp;{t("account.add-asset.button.add-custom-asset.label")}
          </ButtonListItem>
        </div>
        <React.Suspense fallback={<ViewLoading />}>
          {searchFieldValue ? (
            <ul className="mt-4 p-0 flex-grow" ref={containerRef}>
              <FixedSizeList
                container={containerRef.current}
                itemCount={SearchResultRow.count}
                itemSize={searchResultRowHeight}
              >
                {SearchResultRow}
              </FixedSizeList>
            </ul>
          ) : (
            <div className="mt-4 p-0 flex-grow">
              <PopularAssets
                assets={notYetAddedAssets}
                onOpenAssetDetails={openAssetDetails}
                testnet={props.account.testnet}
              />
            </div>
          )}
        </React.Suspense>
      </VerticalLayout>
      <Dialog
        open={customTrustlineDialogOpen}
        onClose={closeCustomTrustlineDialog}
      >
        <React.Suspense fallback={<ViewLoading />}>
          <CustomTrustlineDialog
            account={props.account}
            accountData={props.accountData}
            createAddAssetTransaction={createAddAssetTransaction}
            horizon={props.horizon}
            onClose={closeCustomTrustlineDialog}
            sendTransaction={sendTransaction}
            txCreationPending={txCreationPending}
          />
        </React.Suspense>
      </Dialog>
    </DialogBody>
  )
})

function ConnectedAddAssetDialog(props: Omit<AddAssetDialogProps, "horizon" | "sendTransaction">) {
  return (
    <TransactionSender account={props.account} onSubmissionCompleted={props.onClose}>
      {({ horizon, sendTransaction }) => (
        <AddAssetDialog {...props} horizon={horizon} sendTransaction={sendTransaction} />
      )}
    </TransactionSender>
  )
}

export default React.memo(ConnectedAddAssetDialog)
