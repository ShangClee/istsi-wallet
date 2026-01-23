import React from "react"
import { useTranslation } from "react-i18next"
import { AddIcon, GroupIcon } from "~Generic/components/Icons"
import AccountBalances from "~Account/components/AccountBalances"
import { CardList, CardListCard } from "~Layout/components/CardList"
import { Account } from "../contexts/accounts"
import { SignatureDelegationContext } from "../contexts/signatureDelegation"
import { InlineErrorBoundary } from "~Generic/components/ErrorBoundaries"
import InlineLoader from "~Generic/components/InlineLoader"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { useRouter } from "~Generic/hooks/userinterface"
import { containsThirdPartySigner } from "~Generic/lib/third-party-security"
import { MultisigTransactionResponse } from "~Generic/lib/multisig-service"
import { Box, HorizontalLayout, VerticalLayout } from "~Layout/components/Box"
import * as routes from "../routes"

// --- Tailwind Helper Components ---

const Tooltip = ({ title, children }: any) => (
  <div className="group relative flex">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
      {title}
    </span>
  </div>
)

const Badge = ({ badgeContent, children, className, style }: any) => (
  <div className={`relative inline-flex ${className || ""}`} style={style}>
    {children}
    {badgeContent ? (
      <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
        {badgeContent}
      </span>
    ) : null}
  </div>
)

// --- End Helpers ---

const StyledCard = (props: {
  children?: React.ReactNode
  elevation?: number
  onClick?: () => void
  style?: React.CSSProperties
}) => {
  return (
    <CardListCard onClick={props.onClick} style={props.style} className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
      <div className="w-full h-full p-4 box-border relative">
        {/* Ripple effect simulation or replacement could go here if strictly needed */}
        {props.children}
      </div>
    </CardListCard>
  )
}

const StyledBadge = (props: any) => {
  return props.badgeContent ? (
    <Badge {...props} />
  ) : (
    <div className="mt-1 -mr-0.5" style={props.style}>
      {props.children}
    </div>
  )
}

function Badges(props: { account: Account }) {
  const { t } = useTranslation()
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const securityService = containsThirdPartySigner(accountData.signers)

  const multiSigIcon = securityService ? (
    <Tooltip
      title={t("app.account-list.badges.tooltip.security-service", `${securityService.name} Protection`, {
        service: securityService.name
      })}
    >
      {securityService.icon({ style: { marginTop: 6 } })}
    </Tooltip>
  ) : (
    <Tooltip title={t("app.account-list.badges.tooltip.multi-sig")}>
      <GroupIcon style={{ marginTop: 6 }} />
    </Tooltip>
  )
  return <Box>{accountData.signers.length > 1 || props.account.cosignerOf ? multiSigIcon : null}</Box>
}

interface AccountCardProps {
  account: Account
  pendingSignatureRequests: MultisigTransactionResponse[]
  style?: React.CSSProperties
}

function AccountCard(props: AccountCardProps) {
  const router = useRouter()

  const onClick = () => router.history.push(routes.account(props.account.id))
  const pendingSignatureRequests = props.pendingSignatureRequests.filter(
    req =>
      req.signers.some(signer => signer === props.account.publicKey) &&
      !req.signed_by.find(signer => signer === props.account.publicKey)
  )
  const badgeContent = pendingSignatureRequests.length > 0 ? pendingSignatureRequests.length : null

  return (
    <StyledCard elevation={5} onClick={onClick} style={{ background: "white", color: "black" }}>
      <StyledBadge badgeContent={badgeContent} color="secondary" style={{ width: "100%" }}>
        <VerticalLayout minHeight="100px" justifyContent="space-evenly" textAlign="left" width="100%">
          <InlineErrorBoundary>
            <HorizontalLayout margin="0 0 12px">
              <h5 style={{ flexGrow: 1, fontSize: 20, margin: 0, fontWeight: 400 }}>
                {props.account.name}
              </h5>
              <React.Suspense fallback={null}>
                <Badges account={props.account} />
              </React.Suspense>
            </HorizontalLayout>
            <Box fontSize="120%">
              <React.Suspense fallback={<InlineLoader />}>
                <AccountBalances
                  publicKey={props.account.cosignerOf || props.account.publicKey}
                  testnet={props.account.testnet}
                />
              </React.Suspense>
            </Box>
          </InlineErrorBoundary>
        </VerticalLayout>
      </StyledBadge>
    </StyledCard>
  )
}

function AddAccountCard(props: { onClick: () => any; style?: React.CSSProperties }) {
  const style = {
    ...props.style,
    background: "transparent",
    border: "2px solid white",
    boxShadow: "none",
    color: "white"
  }
  const { t } = useTranslation()
  return (
    <StyledCard onClick={props.onClick} style={style}>
      <VerticalLayout height="100px" justifyContent="center" fontSize="1.3rem" textAlign="center">
        <div>
          <AddIcon style={{ fontSize: "200%" }} />
        </div>
        <div>{t("app.account-list.add-account-card.label")}</div>
      </VerticalLayout>
    </StyledCard>
  )
}

interface AccountListProps {
  accounts: Account[]
  testnet: boolean
  onCreatePubnetAccount: () => any
  onCreateTestnetAccount: () => any
}

function AccountList(props: AccountListProps) {
  const accounts = props.accounts.filter(account => account.testnet === props.testnet)
  const { pendingSignatureRequests } = React.useContext(SignatureDelegationContext)

  return (
    <CardList addInvisibleCard={accounts.length % 2 === 0}>
      <AddAccountCard onClick={props.testnet ? props.onCreateTestnetAccount : props.onCreatePubnetAccount} />
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} pendingSignatureRequests={pendingSignatureRequests} />
      ))}
    </CardList>
  )
}

export default React.memo(AccountList)
