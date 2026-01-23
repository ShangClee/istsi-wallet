import React from "react"
// Button removed - using native button
import { storiesOf } from "@storybook/react"
import { MainErrorBoundary } from "../components/ErrorBoundaries"
import { VerticalLayout } from "~Layout/components/Box"

function Failing() {
  const [failing, setFailing] = React.useState(false)
  const fail = React.useCallback(() => setFailing(true), [])
  if (failing) {
    throw new Error("Exception time!")
  }
  return (
    <VerticalLayout alignItems="center" justifyContent="center">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={fail}
      >
        Throw
      </button>
    </VerticalLayout>
  )
}

storiesOf("MainErrorBoundary", module).add("MainErrorBoundary", () => (
  <VerticalLayout height="400px" justifyContent="center">
    <MainErrorBoundary>
      <Failing />
    </MainErrorBoundary>
  </VerticalLayout>
))
