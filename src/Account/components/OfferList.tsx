import BigNumber from "big.js"
import React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Operation, Horizon, Transaction } from "stellar-sdk"
import { ArrowRightIcon, ExpandMoreIcon, BarChartIcon } from "~Generic/components/Icons"
import { Account } from "~App/contexts/accounts"
import { trackError } from "~App/contexts/notifications"
import { ActionButton } from "~Generic/components/DialogActions"
import { useHorizon } from "~Generic/hooks/stellar"
import { useLoadingState } from "~Generic/hooks/util"
import { useLiveAccountData, useLiveAccountOffers, useOlderOffers } from "~Generic/hooks/stellar-subscriptions"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { AccountData } from "~Generic/lib/account"
import { offerAssetToAsset } from "~Generic/lib/stellar"
import { createTransaction } from "~Generic/lib/transaction"
import { HorizontalLayout } from "~Layout/components/Box"
import { List, ListItem } from "~Layout/components/List"
import TransactionSender from "~Transaction/components/TransactionSender"
import { SingleBalance } from "./AccountBalances"

function createDismissalTransaction(
  horizon: Horizon.Server,
  account: Account,
  accountData: AccountData,
  offer: Horizon.ServerApi.OfferRecord
): Promise<Transaction> {
  const buying = offerAssetToAsset(offer.buying)
  const selling = offerAssetToAsset(offer.selling)

  if (selling.isNative()) {
    return createTransaction(
      [
        Operation.manageBuyOffer({
          offerId: offer.id,
          buyAmount: "0",
          buying,
          price: offer.price,
          selling
        })
      ],
      { accountData, horizon, walletAccount: account }
    )
  } else {
    return createTransaction(
      [
        Operation.manageSellOffer({
          offerId: offer.id,
          amount: "0",
          buying,
          price: offer.price,
          selling
        })
      ],
      { accountData, horizon, walletAccount: account }
    )
  }
}

interface OfferListItemProps {
  accountPublicKey: string
  offer: Horizon.ServerApi.OfferRecord
  onCancel?: () => void
  style?: React.CSSProperties
}

const OfferListItem = React.memo(function OfferListItem(props: OfferListItemProps) {
  const buying = offerAssetToAsset(props.offer.buying)
  const selling = offerAssetToAsset(props.offer.selling)
  const isSmallScreen = useIsMobile()
  
  return (
    <ListItem
      button={Boolean(props.onCancel)}
      onClick={props.onCancel}
      style={{ minHeight: isSmallScreen ? 58 : 72, ...props.style }}
      leftIcon={<BarChartIcon />}
      primaryText={
        props.offer.seller === props.accountPublicKey && !selling.isNative() ? (
          <span style={{ fontWeight: "bold" }}>
            <Trans i18nKey="account.transactions.offer-list.text.sell">
              Sell
              <SingleBalance
                assetCode={selling.getCode()}
                balance={props.offer.amount}
                inline
                style={{ marginLeft: "0.35em", marginRight: "0.35em" }}
              />
              for
              <SingleBalance
                assetCode={buying.getCode()}
                balance={String(BigNumber(props.offer.amount).mul(props.offer.price))}
                inline
                style={{ marginLeft: "0.35em", marginRight: "0.35em" }}
              />
            </Trans>
          </span>
        ) : (
          <span style={{ fontWeight: "bold" }}>
            <Trans i18nKey="account.transactions.offer-list.text.buy">
              Buy
              <SingleBalance
                assetCode={buying.getCode()}
                balance={String(BigNumber(props.offer.amount).mul(props.offer.price))}
                inline
                style={{ marginLeft: "0.35em", marginRight: "0.35em" }}
              />
              for
              <SingleBalance
                assetCode={selling.getCode()}
                balance={props.offer.amount}
                inline
                style={{ marginLeft: "0.35em", marginRight: "0.35em" }}
              />
            </Trans>
          </span>
        )
      }
      rightIcon={
        !isSmallScreen ? (
          <HorizontalLayout alignItems="center" inline style={{ fontSize: "1.4rem" }}>
            <b>{selling.getCode()}</b>
            &nbsp;
            <ArrowRightIcon style={{ fontSize: "150%" }} />
            &nbsp;
            <b>{buying.getCode()}</b>
          </HorizontalLayout>
        ) : null
      }
    />
  )
})

interface LoadMoreOffersListItemProps {
  onClick: () => void
  pending?: boolean
}

const LoadMoreOffersListItem = React.memo(function LoadMoreOffersListItem(props: LoadMoreOffersListItemProps) {
  const { t } = useTranslation()
  return (
    <ListItem
      style={{ borderBottom: "none", height: 75 }}
      className="flex justify-center"
      primaryText={
        <div className="text-center w-full">
          <ActionButton
            onClick={props.onClick}
            loading={props.pending}
            style={{ margin: "0 auto", paddingLeft: 16, paddingRight: 16 }}
            variant="text"
          >
            {t("account.transactions.transaction-list.load-more.label")}
          </ActionButton>
        </div>
      }
    />
  )
})

interface Props {
  account: Account
  title: React.ReactNode
}

function OfferList(props: Props & { sendTransaction: (tx: Transaction) => Promise<void> }) {
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const horizon = useHorizon(props.account.testnet)
  const offerHistory = useLiveAccountOffers(props.account.publicKey, props.account.testnet)
  const [moreTxsLoadingState, handleMoreTxsFetch] = useLoadingState()
  const fetchMoreOffers = useOlderOffers(props.account.publicKey, props.account.testnet)

  const [expanded, setExpanded] = React.useState(true)

  const handleFetchMoreOffers = React.useCallback(() => handleMoreTxsFetch(fetchMoreOffers()), [
    fetchMoreOffers,
    handleMoreTxsFetch
  ])

  const onCancel = async (offer: Horizon.ServerApi.OfferRecord) => {
    try {
      const tx = await createDismissalTransaction(horizon, props.account, accountData, offer)
      await props.sendTransaction(tx)
    } catch (error) {
      trackError(error)
    }
  }

  if (offerHistory.offers.length === 0) {
    return null
  } else {
    return (
      <List className="bg-transparent">
        <div className="bg-transparent">
          <div
            className="flex items-center justify-start min-h-[48px] p-0 cursor-pointer bg-transparent"
            onClick={() => setExpanded(!expanded)}
          >
             <div className="px-6 py-2 flex-grow text-sm font-medium text-gray-500">
               {props.title}
             </div>
             <div className="pr-4 text-gray-500">
               <ExpandMoreIcon className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
             </div>
          </div>
          {expanded && (
            <div className="block p-0">
              {offerHistory.offers.map(offer => (
                <OfferListItem
                  key={offer.id}
                  accountPublicKey={props.account.accountID}
                  offer={offer}
                  onCancel={() => onCancel(offer)}
                />
              ))}
              {offerHistory.olderOffersAvailable ? (
                <LoadMoreOffersListItem
                  pending={moreTxsLoadingState.type === "pending"}
                  onClick={handleFetchMoreOffers}
                />
              ) : null}
            </div>
          )}
        </div>
      </List>
    )
  }
}

function OfferListContainer(props: Props) {
  return (
    <TransactionSender account={props.account}>
      {({ sendTransaction }) => <OfferList {...props} sendTransaction={sendTransaction} />}
    </TransactionSender>
  )
}

export default OfferListContainer
