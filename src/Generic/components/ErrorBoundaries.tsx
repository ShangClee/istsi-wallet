import { HiExclamationCircle } from "react-icons/hi2"
import React from "react"
import { Translation, useTranslation } from "react-i18next"
import { Box, HorizontalLayout, VerticalLayout } from "~Layout/components/Box"
import { getErrorTranslation } from "../lib/errors"

// tslint:disable-next-line
const pkg = require("../../../package.json")

const buttonLabels = ["Oh no", "Drats!", "Nevermind", "Let's try this again", "Not my day"]

interface State {
  error: Error | null
}

function ErrorBoundary<Props extends { children: React.ReactNode }>(
  View: React.FunctionComponent<Props & { error: Error }>
): React.ComponentType<Props> {
  return class ErrorComponent extends React.PureComponent<Props, State> {
    static getDerivedStateFromError(error: Error): State {
      return { error }
    }

    state: State = {
      error: null
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      // tslint:disable-next-line no-console
      console.error(`Component errored: ${error.stack || error}\n${info.componentStack}`)
    }

    render() {
      const { error } = this.state

      if (error) {
        return <View {...this.props} error={error} />
      } else {
        return <>{this.props.children}</>
      }
    }
  }
}

export const HideOnError = ErrorBoundary(function HideOnError() {
  return <React.Fragment />
})

interface InlineErrorBoundaryProps {
  children: React.ReactNode
  height?: React.CSSProperties["height"]
}

export const InlineErrorBoundary = ErrorBoundary<InlineErrorBoundaryProps>(function InlineErrorBoundary(props) {
  const { t } = useTranslation()

  return (
    <HorizontalLayout
      alignItems="center"
      height={props.height}
      className="bg-red-100 rounded-lg text-red-600 font-semibold px-3 py-2"
    >
      <HiExclamationCircle className="w-5 h-5" />
      <span className="ml-2">{getErrorTranslation(props.error, t)}</span>
    </HorizontalLayout>
  )
})

interface MainErrorBoundaryProps {
  children: React.ReactNode
}

export const MainErrorBoundary = ErrorBoundary<MainErrorBoundaryProps>(function MainErrorBoundary(props) {
  const refreshContent = React.useCallback(() => window.location.reload(), [])
  return (
    <VerticalLayout alignItems="center" grow height="100%" justifyContent="center" padding="40px" position="relative">
      <Translation>
        {t => (
          <>
            <Box textAlign="center">
              <h5 className="text-xl font-medium">{t("generic.error.boundary.header")}</h5>
              <p className="my-2 mb-6 text-sm select-text">
                {getErrorTranslation(props.error, t)}
              </p>
              <button
                onClick={refreshContent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {buttonLabels[Math.floor(Math.random() * buttonLabels.length)]}
              </button>
            </Box>
            <Box style={{ position: "absolute", bottom: 8, left: 0, width: "100%", opacity: 0.5 }}>
              <p className="text-center text-gray-900">
                {t("generic.error.boundary.contact-us")}{" "}
                <a
                  href="mailto:hello@solarwallet.io"
                  className="text-inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hello@solarwallet.io
                </a>
              </p>
              <p className="text-center text-gray-900">
                v{pkg.version}
              </p>
            </Box>
          </>
        )}
      </Translation>
    </VerticalLayout>
  )
})
