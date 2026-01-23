import React from "react"
import { useTranslation } from "react-i18next"
import MenuIcon from "@mui/icons-material/Menu"
import SettingsIcon from "@mui/icons-material/Settings"
import UpdateIcon from "@mui/icons-material/SystemUpdateAlt"
import DialogBody from "~Layout/components/DialogBody"
import { Box, VerticalLayout } from "~Layout/components/Box"
import { Section } from "~Layout/components/Page"
import MainTitle from "~Generic/components/MainTitle"
import { useRouter } from "~Generic/hooks/userinterface"
import getUpdater from "~Platform/updater"
import AppNotificationPermission from "~Toasts/components/AppNotificationPermission"
import { AccountsContext } from "../contexts/accounts"
import { NotificationsContext, trackError } from "../contexts/notifications"
import { SettingsContext } from "../contexts/settings"
import * as routes from "../routes"
import AccountList from "./AccountList"
import TermsAndConditions from "./TermsAndConditionsDialog"

// --- Tailwind Helper Components ---

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query, matches])
  return matches
}

const IconButton = ({ children, onClick, className, style, ...props }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-black/5 transition-colors ${className || ""}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

const Switch = ({ checked, onChange, color }: any) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`${
      checked ? (color === "secondary" ? "bg-pink-500" : "bg-blue-500") : "bg-gray-300"
    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
  >
    <span
      className={`${
        checked ? "translate-x-6" : "translate-x-1"
      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
    />
  </button>
)

const FormControlLabel = ({ control, label, style }: any) => (
  <label className="flex items-center cursor-pointer ml-3" style={style}>
    {control}
    <span className="ml-2 text-base font-medium text-gray-700">{label}</span>
  </label>
)

const Menu = ({ anchorEl, open, onClose, children }: any) => {
  if (!open || !anchorEl) return null
  const rect = anchorEl.getBoundingClientRect()
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded shadow-lg py-1 min-w-[150px] ring-1 ring-black ring-opacity-5 focus:outline-none"
        style={{ top: rect.bottom, left: rect.left }}
      >
        {children}
      </div>
    </>
  )
}

const MenuItem = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
  >
    {children}
  </button>
)

const ListItemIcon = ({ children }: any) => <div className="inline-flex min-w-[36px] text-gray-500">{children}</div>

const ListItemText = ({ primary }: any) => <span>{primary}</span>

const Tooltip = ({ title, children }: any) => (
  <div className="group relative flex">
    {children}
    <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap z-50">
      {title}
    </span>
  </div>
)

// --- End Helpers ---


function AllAccountsPage() {
  const { accounts, networkSwitch, toggleNetwork } = React.useContext(AccountsContext)
  const router = useRouter()
  const settings = React.useContext(SettingsContext)
  const { showNotification } = React.useContext(NotificationsContext)
  const testnetAccounts = React.useMemo(() => accounts.filter(account => account.testnet), [accounts])
  const [isUpdateInProgress, setUpdateInProgress] = React.useState(false)
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null)
  }, [])

  const isWidthMax450 = useMediaQuery("(max-width:450px)")

  const updater = getUpdater()

  const startUpdate = React.useCallback(async () => {
    if (settings.updateAvailable && !updater.isUpdateStarted() && !updater.isUpdateDownloaded()) {
      try {
        showNotification("info", t("app.all-accounts.update.notification.start"))
        setUpdateInProgress(true)
        await updater.startUpdate()
        showNotification("success", t("app.all-accounts.update.notification.success"))
      } catch (error) {
        trackError(error)
      } finally {
        setUpdateInProgress(false)
      }
    }
  }, [settings.updateAvailable, showNotification, updater, t])

  const updateButton = (
    <Tooltip title={t("app.all-accounts.update.tooltip")}>
      <IconButton
        onClick={startUpdate}
        style={{ marginLeft: isWidthMax450 ? 0 : 8, marginRight: -12, color: "inherit" }}
      >
        <UpdateIcon className="animate-glowing"></UpdateIcon>
      </IconButton>
    </Tooltip>
  )

  const networkSwitchButton = (
    <FormControlLabel
      control={<Switch checked={networkSwitch === "testnet"} color="secondary" onChange={toggleNetwork} />}
      label={t("app.all-accounts.switch.label")}
      style={{ marginRight: 0 }}
    />
  )

  const headerContent = React.useMemo(
    () => (
      <MainTitle
        title={networkSwitch === "testnet" ? t("app.all-accounts.title.testnet") : t("app.all-accounts.title.mainnet")}
        titleColor="inherit"
        titleStyle={isWidthMax450 ? { marginRight: 0 } : {}}
        hideBackButton
        onBack={() => undefined}
        leftAction={
          <>
            <IconButton
              onClick={handleMenuOpen}
              style={{ color: "inherit" }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  router.history.push(routes.settings())
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={t("app.menu.settings")} />
              </MenuItem>
            </Menu>
          </>
        }
        actions={
          <Box style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            {settings.showTestnet || networkSwitch === "testnet" || testnetAccounts.length > 0
              ? networkSwitchButton
              : null}
            {settings.updateAvailable &&
              !isUpdateInProgress &&
              !updater.isUpdateStarted() &&
              !updater.isUpdateDownloaded()
              ? updateButton
              : null}
            <IconButton
              onClick={() => router.history.push(routes.settings())}
              style={{ marginLeft: isWidthMax450 ? 0 : 8, color: "inherit" }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        }
      />
    ),
    [
      anchorEl,
      handleMenuClose,
      handleMenuOpen,
      isUpdateInProgress,
      isWidthMax450,
      networkSwitch,
      networkSwitchButton,
      router.history,
      settings.showTestnet,
      settings.updateAvailable,
      testnetAccounts.length,
      updater,
      updateButton,
      t
    ]
  )

  return (
    <Section bottom brandColored noPadding className="h-screen">
      <DialogBody backgroundColor="unset" top={headerContent}>
        <VerticalLayout justifyContent="space-between" grow margin="16px 0 0">
          <AccountList
            accounts={accounts}
            testnet={networkSwitch === "testnet"}
            onCreatePubnetAccount={() => router.history.push(routes.newAccount(false))}
            onCreateTestnetAccount={() => router.history.push(routes.newAccount(true))}
          />
          <AppNotificationPermission />
        </VerticalLayout>
      </DialogBody>
      <TermsAndConditions
        // Do not render T&Cs while loading settings; 99.9% chance we will unmount it immediately
        open={settings.initialized && !settings.agreedToTermsAt}
        onConfirm={settings.confirmToC}
      />
    </Section>
  )
}

export default React.memo(AllAccountsPage)
