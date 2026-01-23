import React from "react"
// Button removed - using native button
import { storiesOf } from "@storybook/react"
import { Asset, Horizon, Transaction } from "stellar-sdk"
import TransactionReviewDialog from "../components/TransactionReviewDialog"
import { Account, AccountsContext, AccountsProvider } from "~App/contexts/accounts"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { createPaymentOperation, createTransaction } from "~Generic/lib/transaction"

interface DialogContainerProps {
  account: Account
  children: (props: { open: boolean; onClose: () => void; transaction: Transaction }) => React.ReactNode
}

function DialogContainer(props: DialogContainerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [transaction, setTransaction] = React.useState<Transaction | null>(null)
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)

  React.useEffect(() => {
    const createDemoTx = async () => {
      return createTransaction(
        [
          await createPaymentOperation({
            amount: "1",
            asset: Asset.native(),
            destination: "GA2CZKBI2C55WHALSTNPG54FOQCLC6Y4EIATZEIJOXWQPSEGN4CWAXFT",
            horizon: new Horizon.Server("https://horizon-testnet.stellar.org")
          })
        ],
        {
          accountData,
          horizon: new Horizon.Server("https://horizon-testnet.stellar.org"),
          walletAccount: props.account
        }
      )
    }
    createDemoTx().then(tx => setTransaction(tx))
  }, [accountData, props.account])

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Open
      </button>
      {transaction
        ? props.children({
            open: isOpen,
            onClose: () => setIsOpen(false),
            transaction: (transaction as any) as Transaction
          })
        : null}
    </>
  )
}

storiesOf("Dialogs", module)
  .addDecorator(story => <AccountsProvider>{story()}</AccountsProvider>)
  .add("TxConfirmationDrawer without password", () => (
    <AccountsContext.Consumer>
      {({ accounts }) =>
        accounts[0] ? (
          <DialogContainer account={accounts[0]}>
            {({ open, onClose, transaction }) => (
              <TransactionReviewDialog
                account={accounts[0]}
                open={open}
                onClose={onClose}
                onSubmitTransaction={() => undefined}
                showSubmissionProgress={false}
                transaction={transaction}
              />
            )}
          </DialogContainer>
        ) : null
      }
    </AccountsContext.Consumer>
  ))
  .add("TxConfirmationDrawer with password", () => (
    <AccountsContext.Consumer>
      {({ accounts }) =>
        accounts[1] ? (
          <DialogContainer account={accounts[1]}>
            {({ open, onClose, transaction }) => (
              <TransactionReviewDialog
                account={accounts[1]}
                open={open}
                onClose={onClose}
                onSubmitTransaction={() => undefined}
                showSubmissionProgress={false}
                transaction={transaction}
              />
            )}
          </DialogContainer>
        ) : null
      }
    </AccountsContext.Consumer>
  ))
