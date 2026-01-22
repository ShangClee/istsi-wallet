/// <reference types="parcel-env" />

import React from "react"
import { createRoot } from "react-dom/client"
import { HashRouter as Router } from "react-router-dom"
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles"
import ViewLoading from "~Generic/components/ViewLoading"
import { ContextProviders } from "./context"
import theme from "../theme"

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const Stage2 = React.lazy(() => import("./app-stage2"))

export const Providers = (props: { children: React.ReactNode }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Router>
        <ContextProviders>{props.children}</ContextProviders>
      </Router>
    </ThemeProvider>
  </StyledEngineProvider>
)

const App = () => (
  <Providers>
    <React.Suspense fallback={<ViewLoading />}>
      <Stage2 />
    </React.Suspense>
  </Providers>
)

const rootElement = document.getElementById("app")
if (!rootElement) {
  throw new Error("Failed to find the root element")
}
const root = createRoot(rootElement)
root.render(<App />)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
