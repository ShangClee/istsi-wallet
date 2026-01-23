import BigNumber from "big.js"
import React from "react"
import { useTranslation } from "react-i18next"
import { Asset, FeeBumpTransaction, Horizon, Networks, Operation, Transaction, TransactionBuilder } from "stellar-sdk"
import HumanTime from "react-human-time"
import { AddIcon, CallMadeIcon, CallReceivedIcon, RemoveIcon, SettingsIcon, SwapHorizIcon } from "~Generic/components/Icons"
import { Account } from "~App/contexts/accounts"
import { SettingsContext } from "~App/contexts/settings"
import * as routes from "~App/routes"
import { useIsMobile, useRouter } from "~Generic/hooks/userinterface"
import { getPaymentSummary, PaymentSummary } from "~Generic/lib/paymentSummary"
import { ActionButton } from "~Generic/components/DialogActions"
import { InlineErrorBoundary } from "~Generic/components/ErrorBoundaries"
import { PublicKey } from "~Generic/components/PublicKey"
import { formatBalance } from "~Generic/lib/balances"
import { matchesRoute } from "~Generic/lib/routes"
import { stringifyAssetToReadableString } from "~Generic/lib/stellar"
import { List, ListItem, ListSubheader } from "~Layout/components/List"
import MemoMessage from "~Transaction/components/MemoMessage"
import TransactionReviewDialog from "~TransactionReview/components/TransactionReviewDialog"
import { useOperationTitle } from "~TransactionReview/components/Operations"
import { SingleBalance } from "./AccountBalances"

const dedupe = <T extends any>(array: T[]): T[] => Array.from(new Set(array))

function sum(...amounts: Array<string | number | BigNumber>): BigNumber {
  return amounts.reduce<BigNumber>((total, amount) => total.add(amount), BigNumber(0))
}

function EntryAnimation(props: { children: React.ReactNode; animate: boolean }) {
  const [visible, setVisible] = React.useState(!props.animate)

  React.useEffect(() => {
    if (props.animate) {
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    }
  }, [props.animate])

  return (
    <div className={`transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
      {props.children}
    </div>
  )
}

function OfferDescription(props: {
  amount: BigNumber
  buying: Asset
  offerId: string
  price: BigNumber
  selling: Asset
  type: Operation.ManageBuyOffer["type"] | Operation.ManageSellOffer["type"]
}) {
  const { amount, buying, offerId, price, selling } = props
  const { t } = useTranslation()
  let prefix: string

  if (offerId === "0") {
    prefix = `${t("account.transactions.transaction-list.offer-description.prefix.default")}: `
  } else if (amount.eq(0)) {
    prefix = `${t("account.transactions.transaction-list.offer-description.prefix.cancel")}: `
  } else {
    prefix = `${t("account.transactions.transaction-list.offer-description.prefix.update")}: `
  }

  return (
    <>
      {prefix}
      {props.type === "manageBuyOffer"
        ? t(
            "account.transactions.transaction-list.offer-description.buy",
            `Buy ${amount.eq(0) ? "" : formatBalance(amount.toString())} ${buying.code} for ${
              amount.eq(0) ? "" : formatBalance(amount.mul(price).toString())
            } ${selling.code}`,
            {
              buyingAmount: amount.eq(0) ? "" : formatBalance(amount.toString()),
              buyingCode: buying.code,
              sellingAmount: amount.eq(0) ? "" : formatBalance(amount.mul(price).toString()),
              sellingCode: selling.code
            }
          )
        : t(
            "account.transactions.transaction-list.offer-description.sell",
            `Sell ${amount.eq(0) ? "" : formatBalance(amount.toString())} ${selling.code} for ${
              amount.eq(0) ? "" : formatBalance(amount.mul(price).toString())
            } ${buying.code}`,
            {
              buyingAmount: amount.eq(0) ? "" : formatBalance(amount.mul(price).toString()),
              buyingCode: buying.code,
              sellingAmount: amount.eq(0) ? "" : formatBalance(amount.toString()),
              sellingCode: selling.code
            }
          )}
    </>
  )
}

function RemotePublicKeys(props: { publicKeys: string[]; short?: boolean; testnet: boolean }) {
  const { t } = useTranslation()
  if (props.publicKeys.length === 0) {
    return <>-</>
  } else if (props.publicKeys.length === 1) {
    return (
      <PublicKey publicKey={props.publicKeys[0]} testnet={props.testnet} variant={props.short ? "short" : "full"} />
    )
  } else {
    return (
      <>
        <PublicKey publicKey={props.publicKeys[0]} testnet={props.testnet} variant="short" />{" "}
        <i>
          + {props.publicKeys.length - 1} {t("account.transactions.transaction-list.item.remote-public-keys.more")}
        </i>
      </>
    )
  }
}

const Time = React.memo(function Time(props: { time: string }) {
  const date = new Date(props.time)
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <HumanTime time={date.getTime()} />
    </span>
  )
})

function TransactionIcon(props: { paymentSummary: PaymentSummary; transaction: Transaction }) {
  if (
    props.transaction.operations.length === 1 &&
    ["manageBuyOffer", "manageSellOffer"].includes(props.transaction.operations[0].type)
  ) {
    return <SwapHorizIcon />
  } else if (props.transaction.operations.length === 1 && props.transaction.operations[0].type === "changeTrust") {
    return BigNumber(props.transaction.operations[0].limit).eq(0) ? <RemoveIcon /> : <AddIcon />
  } else if (props.transaction.operations.every(operation => operation.type === "accountMerge")) {
    return <CallReceivedIcon />
  } else if (props.paymentSummary.length === 0) {
    return <SettingsIcon />
  } else if (props.paymentSummary.every(summaryItem => summaryItem.balanceChange.gt(0))) {
    return <CallReceivedIcon />
  } else if (props.paymentSummary.every(summaryItem => summaryItem.balanceChange.lt(0))) {
    return <CallMadeIcon />
  } else {
    return <SwapHorizIcon />
  }
}

interface TitleTextProps {
  accountPublicKey: string
  alwaysShowSource?: boolean
  paymentSummary: PaymentSummary
  style?: React.CSSProperties
  transaction: Transaction
}

const TransactionItemPrimary = React.memo(function TransactionItemPrimary(props: TitleTextProps) {
  const getOperationTitle = useOperationTitle()
  const { t } = useTranslation()
  const remotePublicKeys = props.paymentSummary.reduce(
    (pubKeys, summaryItem) => pubKeys.concat(summaryItem.publicKeys),
    [] as string[]
  )

  const testnet = props.transaction.networkPassphrase === Networks.TESTNET
  const className = `block overflow-hidden text-ellipsis whitespace-nowrap font-bold ${props.style?.fontSize ? "" : "text-base"}`
  const style = props.style

  if (remotePublicKeys.length > 0 && props.paymentSummary.every(summaryItem => summaryItem.balanceChange.gt(0))) {
    return (
      <span className={className} style={style}>
        {t("account.transactions.transaction-list.item.from")}&nbsp;
        <RemotePublicKeys publicKeys={remotePublicKeys} short testnet={testnet} />
      </span>
    )
  } else if (
    remotePublicKeys.length > 0 &&
    props.paymentSummary.every(summaryItem => summaryItem.balanceChange.lt(0))
  ) {
    return (
      <span className={className} style={style}>
        {t("account.transactions.transaction-list.item.to")}&nbsp;
        <RemotePublicKeys publicKeys={remotePublicKeys} short testnet={testnet} />
        {props.alwaysShowSource ? (
          <span>
            &nbsp;{t("account.transactions.transaction-list.item.from")}&nbsp;
            <PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />{" "}
          </span>
        ) : null}
      </span>
    )
  } else if (props.transaction.operations.length === 1 && props.transaction.operations[0].type === "changeTrust") {
    const operation = props.transaction.operations[0] as Operation.ChangeTrust

    return BigNumber(operation.limit).eq(0) ? (
      <span className={className} style={style}>
        {t(
          "account.transactions.transaction-list.item.trust.remove-trust",
          `Remove trust in asset ${stringifyAssetToReadableString(operation.line)}`,
          { asset: stringifyAssetToReadableString(operation.line) }
        )}
        {props.alwaysShowSource ? (
          <>
            {" "}
            (<PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />)
          </>
        ) : null}
      </span>
    ) : (
      <span className={className} style={style}>
        {t(
          "account.transactions.transaction-list.item.trust.add-trust",
          `Trust asset ${stringifyAssetToReadableString(operation.line)}`,
          {
            asset: stringifyAssetToReadableString(operation.line)
          }
        )}
        {props.alwaysShowSource ? (
          <>
            {" "}
            (<PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />)
          </>
        ) : null}
      </span>
    )
  } else if (
    props.transaction.operations.length === 1 &&
    ["manageBuyOffer", "manageSellOffer"].includes(props.transaction.operations[0].type)
  ) {
    const operation = props.transaction.operations[0] as Operation.ManageBuyOffer | Operation.ManageSellOffer
    const amount = BigNumber(operation.type === "manageBuyOffer" ? operation.buyAmount : operation.amount)

    if (String(operation.offerId) === "0") {
      // Create offer
      return (
        <span className={className} style={style}>
          <OfferDescription {...operation} amount={amount} price={BigNumber(operation.price)} />
          {props.alwaysShowSource ? (
            <>
              {" "}
              (<PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />)
            </>
          ) : null}
        </span>
      )
    } else if (amount.eq(0)) {
      // Delete offer
      return (
        <span className={className} style={style}>
          <OfferDescription {...operation} amount={BigNumber(0)} price={BigNumber(operation.price)} />
          {props.alwaysShowSource ? (
            <>
              {" "}
              (<PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />)
            </>
          ) : null}
        </span>
      )
    } else {
      // Update offer
      return (
        <span className={className} style={style}>
          <OfferDescription {...operation} amount={amount} price={BigNumber(operation.price)} />
          {props.alwaysShowSource ? (
            <>
              {" "}
              (<PublicKey publicKey={props.accountPublicKey} testnet={testnet} variant="short" />)
            </>
          ) : null}
        </span>
      )
    }
  } else {
    const formattedOperations = props.transaction.operations.map(getOperationTitle)
    return <span className={className} style={style}>{dedupe(formattedOperations).join(", ")}</span>
  }
})

function TransactionListItemBalance(props: {
  accountPublicKey: string
  paymentSummary: PaymentSummary
  style?: React.CSSProperties
  transaction: Transaction
}) {
  const { paymentSummary } = props
  const isSmallScreen = useIsMobile()

  const creationOps = props.transaction.operations.filter(
    (op): op is Operation.CreateAccount => op.type === "createAccount"
  )
  const paymentOps = props.transaction.operations.filter((op): op is Operation.Payment => op.type === "payment")

  // Handle special edge case: Sending money from an account to itself
  const balanceChange = paymentSummary.every(payment =>
    payment.publicKeys.every(pubkey => pubkey === props.accountPublicKey)
  )
    ? sum(...creationOps.map(op => op.startingBalance), ...paymentOps.map(op => op.amount))
    : paymentSummary[0].balanceChange

  return (
    <div className="flex-shrink-0 text-right" style={props.style}>
      {paymentSummary.length === 0 ? null : (
        <SingleBalance
          assetCode={paymentSummary[0].asset.getCode()}
          balance={balanceChange.toString()}
          style={isSmallScreen ? { fontSize: "1rem" } : { fontSize: "1.4rem" }}
        />
      )}
    </div>
  )
}

interface TransactionListItemProps {
  accountPublicKey: string
  alwaysShowSource?: boolean
  className?: string
  createdAt: string
  icon?: React.ReactElement<any>
  onOpenTransaction?: (transactionHash: string) => void
  style?: React.CSSProperties
  testnet: boolean
  transactionEnvelopeXdr: string
}

export const TransactionListItem = React.memo(function TransactionListItem(props: TransactionListItemProps) {
  const { hideMemos } = React.useContext(SettingsContext)
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  const { onOpenTransaction } = props
  const restoredTransaction = React.useMemo(
    () => TransactionBuilder.fromXDR(props.transactionEnvelopeXdr, props.testnet ? Networks.TESTNET : Networks.PUBLIC),
    [props.testnet, props.transactionEnvelopeXdr]
  )

  const transaction =
    restoredTransaction instanceof FeeBumpTransaction ? restoredTransaction.innerTransaction : restoredTransaction

  const paymentSummary = getPaymentSummary(props.accountPublicKey, transaction)
  const onOpen = onOpenTransaction ? () => onOpenTransaction(restoredTransaction.hash().toString("hex")) : undefined

  const secondary = (
    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
      <Time time={props.createdAt} />
      {(!hideMemos) && transaction.memo.type !== "none" ? (
        <>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <MemoMessage
            prefix={<>{t("account.transactions.transaction-list.item.memo")}:&nbsp;</>}
            memo={transaction.memo}
          />
        </>
      ) : null}
    </span>
  )

  return (
    <ListItem
      button={Boolean(onOpen)}
      className={props.className || ""}
      onClick={onOpen}
      style={props.style}
      leftIcon={props.icon || <TransactionIcon paymentSummary={paymentSummary} transaction={transaction} />}
      primaryText={
        <TransactionItemPrimary
          accountPublicKey={props.accountPublicKey}
          alwaysShowSource={props.alwaysShowSource}
          paymentSummary={paymentSummary}
          style={{
            fontSize: isSmallScreen ? "0.8rem" : undefined,
            fontWeight: "bold",
            overflow: "hidden",
            paddingRight: 0,
            textOverflow: "ellipsis"
          }}
          transaction={transaction}
        />
      }
      secondaryText={secondary}
      rightIcon={
        <TransactionListItemBalance
          accountPublicKey={props.accountPublicKey}
          paymentSummary={paymentSummary}
          style={{ paddingRight: 0 }}
          transaction={transaction}
        />
      }
    />
  )
})

interface LoadMoreTransactionsListItemProps {
  onClick: () => void
  pending?: boolean
}

const LoadMoreTransactionsListItem = React.memo(function LoadMoreTransactionsListItem(
  props: LoadMoreTransactionsListItemProps
) {
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

interface TransactionListProps {
  account: Account
  background?: React.CSSProperties["background"]
  loadingMoreTransactions?: boolean
  olderTransactionsAvailable?: boolean
  onFetchMoreTransactions: () => void
  testnet: boolean
  title: React.ReactNode
  transactions: Horizon.HorizonApi.TransactionResponse[]
}

function TransactionList(props: TransactionListProps) {
  const isSmallScreen = useIsMobile()
  const router = useRouter()

  const openedTxHash = matchesRoute(router.location.pathname, routes.showTransaction("*", "*"))
    ? (router.match.params as { id: string; subaction: string }).subaction
    : null

  const openedTransaction = React.useMemo(() => {
    if (!openedTxHash) {
      return null
    }

    const network = props.account.testnet ? Networks.TESTNET : Networks.PUBLIC
    const txResponse = props.transactions.find(recentTx => recentTx.hash === openedTxHash)

    let tx = txResponse ? TransactionBuilder.fromXDR(txResponse.envelope_xdr, network) : null

    if (tx instanceof FeeBumpTransaction) {
      tx = tx.innerTransaction
    }

    // tslint:disable-next-line prefer-object-spread
    return tx && txResponse ? Object.assign(tx, { created_at: txResponse.created_at }) : tx
  }, [openedTxHash, props.account.testnet, props.transactions])

  const openTransaction = React.useCallback(
    (transactionHash: string) => {
      router.history.push(routes.showTransaction(props.account.id, transactionHash))
    },
    [props.account.id, router.history]
  )

  const closeTransaction = React.useCallback(() => {
    router.history.push(routes.account(props.account.id))

    // A little hack to prevent :focus style being set again on list item after closing the dialog
    setTimeout(() => {
      if (document.activeElement) {
        ;(document.activeElement as HTMLElement).blur()
      }
    }, 0)
  }, [props.account.id, router.history])

  const transactionListItems = React.useMemo(
    () => (
      <>
        {props.transactions.map(transaction => (
          <EntryAnimation
            key={transaction.hash}
            // Animate only if it's a new tx, not if we just haven't rendered it before
            animate={Date.now() - new Date(transaction.created_at).getTime() < 10_000}
          >
            <InlineErrorBoundary height={72}>
              <TransactionListItem
                key={transaction.hash}
                accountPublicKey={props.account.publicKey}
                className={isSmallScreen ? "px-6" : "px-6"}
                createdAt={transaction.created_at}
                onOpenTransaction={openTransaction}
                testnet={props.account.testnet}
                transactionEnvelopeXdr={transaction.envelope_xdr}
              />
            </InlineErrorBoundary>
          </EntryAnimation>
        ))}
      </>
    ),
    [props.transactions, props.account.publicKey, props.account.testnet, isSmallScreen, openTransaction]
  )

  return (
    <List style={{ background: props.background || "transparent" }}>
      {props.title ? (
        <ListSubheader
          style={{ background: "transparent", lineHeight: "18px", marginBottom: 8, paddingLeft: 24 }}
        >
          {props.title}
        </ListSubheader>
      ) : null}
      {transactionListItems}
      {props.olderTransactionsAvailable ? (
        <LoadMoreTransactionsListItem
          onClick={props.onFetchMoreTransactions}
          pending={props.loadingMoreTransactions}
        />
      ) : null}
      <TransactionReviewDialog
        account={props.account}
        onClose={closeTransaction}
        onSubmitTransaction={() => Promise.resolve()}
        open={Boolean(openedTransaction)}
        showSubmissionProgress={false}
        transaction={openedTransaction}
      />
    </List>
  )
}

export default TransactionList