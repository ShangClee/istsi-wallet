import React from "react"
import { Account } from "~App/contexts/accounts"
import InlineLoader from "~Generic/components/InlineLoader"
import { List, ListItem } from "~Layout/components/List"
import AccountBalances from "./AccountBalances"

const isMobileDevice = process.env.PLATFORM === "android" || process.env.PLATFORM === "ios"

const Radio = (props: { checked: boolean; disabled?: boolean }) => (
  <div
    className={`
    w-5 h-5 rounded-full border-2 flex items-center justify-center
    ${props.disabled ? "border-gray-300" : props.checked ? "border-gray-600" : "border-gray-500"}
    transition-colors
  `}
  >
    {props.checked && <div className={`w-2.5 h-2.5 rounded-full ${props.disabled ? "bg-gray-300" : "bg-gray-600"}`} />}
  </div>
)

interface AccountSelectionListProps {
  accounts: Account[]
  disabled?: boolean
  testnet: boolean
  onChange?: (account: Account) => void
}

function AccountSelectionList(props: AccountSelectionListProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  function handleListItemClick(event: React.MouseEvent, index: number) {
    if (props.disabled) return
    setSelectedIndex(index)
    if (props.onChange) {
      props.onChange(props.accounts[index])
    }
  }

  return (
    <List className="bg-transparent px-0">
      {props.accounts.map((account, index) => (
        <AccountSelectionListItem
          account={account}
          disabled={props.disabled}
          index={index}
          key={account.id}
          onClick={handleListItemClick}
          selected={index === selectedIndex}
        />
      ))}
      {props.accounts.length === 0 ? <div className="text-center opacity-70 mt-4">(No accounts)</div> : null}
    </List>
  )
}

interface AccountSelectionListItemProps {
  account: Account
  disabled?: boolean
  index: number
  onClick: (event: React.MouseEvent, index: number) => void
  selected: boolean
  style?: React.CSSProperties
}

const AccountSelectionListItem = React.memo(
  // tslint:disable-next-line no-shadowed-variable
  function AccountSelectionListItem(props: AccountSelectionListItemProps) {
    return (
      <ListItem
        button={!props.disabled}
        className={`
          bg-white shadow-[0_8px_16px_0_rgba(0,0,0,0.1)]
          mb-2 rounded-lg
          ${props.disabled ? "opacity-50 cursor-not-allowed" : isMobileDevice ? "" : "hover:bg-gray-100"}
        `}
        onClick={event => props.onClick(event, props.index)}
        leftIcon={<Radio checked={props.selected && !props.disabled} disabled={props.disabled} />}
        primaryText={props.account.name}
        secondaryText={
          <React.Suspense fallback={<InlineLoader />}>
            <AccountBalances publicKey={props.account.accountID} testnet={props.account.testnet} />
          </React.Suspense>
        }
      />
    )
  } as React.ComponentType<AccountSelectionListItemProps>
)

export default AccountSelectionList
