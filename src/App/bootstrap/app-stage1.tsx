import React from "react"
import { createRoot } from "react-dom/client"
import { HashRouter as Router } from "react-router-dom"
import ViewLoading from "~Generic/components/ViewLoading"
import { ContextProviders } from "./context"

const Stage2 = React.lazy(() => import("./app-stage2"))

export const Providers = (props: { children: React.ReactNode }) => (
  /* @ts-expect-error - react-router-dom v5 types are outdated but runtime works correctly */
  <Router>
    <ContextProviders>{props.children}</ContextProviders>
  </Router>
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
if (import.meta.hot) {
  import.meta.hot.accept()
}
