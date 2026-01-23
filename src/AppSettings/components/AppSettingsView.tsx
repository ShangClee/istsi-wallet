import React from "react"
import { useTranslation } from "react-i18next"
// Card and Typography removed - using Tailwind classes
import * as routes from "~App/routes"
import AppSettings from "~AppSettings/components/AppSettings"
import { Box, VerticalLayout } from "~Layout/components/Box"
import MainTitle from "~Generic/components/MainTitle"
import { useIsMobile, useRouter } from "~Generic/hooks/userinterface"
import { matchesRoute } from "~Generic/lib/routes"
import { Section } from "~Layout/components/Page"

import pkg from "../../../package.json"

function SettingsPage() {
  const isSmallScreen = useIsMobile()
  const router = useRouter()
  const { t } = useTranslation()

  const showSettingsOverview = matchesRoute(router.location.pathname, routes.settings(), true)

  const navigateToAllAccounts = React.useCallback(() => {
    router.history.push(routes.allAccounts())
  }, [router.history])

  const navigateToSettingsOverview = React.useCallback(() => router.history.push(routes.settings()), [router.history])

  const headerCard = React.useMemo(
    () => (
      <div
        className="text-white relative bg-transparent shadow-none"
        style={{
          color: "white",
          position: "relative",
          background: "transparent",
          boxShadow: "none"
        }}
      >
        <div className={isSmallScreen ? "p-2 pb-2" : "p-4 pb-2"}>
          <MainTitle
            onBack={showSettingsOverview ? navigateToAllAccounts : navigateToSettingsOverview}
            title={t("app-settings.settings.title")}
            titleColor="inherit"
            style={{ marginTop: -12, marginLeft: 0 }}
          />
        </div>
      </div>
    ),
    [isSmallScreen, navigateToAllAccounts, navigateToSettingsOverview, showSettingsOverview, t]
  )

  return (
    <VerticalLayout height="100%">
      <Section top brandColored grow={0} shrink={0}>
        {headerCard}
      </Section>
      <Section
        bottom={isSmallScreen}
        style={{
          backgroundColor: "#fcfcfc",
          height: "100%",
          flexGrow: 1,
          flexShrink: 1,
          padding: isSmallScreen ? undefined : "0 24px",
          overflowY: "auto"
        }}
      >
        <VerticalLayout height="100%" grow>
          <Box grow overflowY="auto">
            <AppSettings />
          </Box>
          <Box grow={0} margin="16px 0">
            <p className="text-center text-gray-600">
              v{pkg.version}
            </p>
          </Box>
        </VerticalLayout>
      </Section>
    </VerticalLayout>
  )
}

export default SettingsPage
