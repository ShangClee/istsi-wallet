import React from "react"
import { useTranslation } from "react-i18next"
import { HiBars3, HiCog, HiArrowPath } from "react-icons/hi2"
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

// Modern Sidebar Drawer Menu
const DrawerMenu = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">{children}</div>
        </div>
      </div>
    </>
  )
}

const MenuItem = ({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-6 py-4 text-base text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-4 transition-colors border-b border-gray-100 last:border-b-0"
  >
    {icon && <span className="text-gray-500">{icon}</span>}
    <span className="flex-1">{children}</span>
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  </button>
)


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
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleMenuOpen = React.useCallback(() => {
    setMenuOpen(true)
  }, [])

  const handleMenuClose = React.useCallback(() => {
    setMenuOpen(false)
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
        <HiArrowPath className="animate-glowing w-6 h-6"></HiArrowPath>
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
          <IconButton
            onClick={handleMenuOpen}
            style={{ color: "inherit" }}
            aria-label="menu"
          >
            <HiBars3 className="w-6 h-6" />
          </IconButton>
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
              <HiCog className="w-6 h-6" />
            </IconButton>
          </Box>
        }
      />
    ),
    [
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
          <AppNotificationPermission onHide={() => {}} open={false} />
        </VerticalLayout>
      </DialogBody>
      <DrawerMenu open={menuOpen} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            router.history.push(routes.settings())
          }}
          icon={<HiCog className="w-5 h-5" />}
        >
          {t("app.menu.settings")}
        </MenuItem>
        {settings.showTestnet || networkSwitch === "testnet" || testnetAccounts.length > 0 ? (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700">{t("app.all-accounts.switch.label")}</span>
              <Switch
                checked={networkSwitch === "testnet"}
                color="secondary"
                onChange={toggleNetwork}
              />
            </div>
          </div>
        ) : null}
      </DrawerMenu>
      <TermsAndConditions
        // Do not render T&Cs while loading settings; 99.9% chance we will unmount it immediately
        open={settings.initialized && !settings.agreedToTermsAt}
        onConfirm={settings.confirmToC}
      />
    </Section>
  )
}

export default React.memo(AllAccountsPage)
