import React from "react"

import { useIsMobile, RefStateObject } from "~Generic/hooks/userinterface"
import { MobileKeyboardOpenedSelector } from "~App/theme"
import { MainErrorBoundary } from "~Generic/components/ErrorBoundaries"
import { Box, VerticalLayout } from "~Layout/components/Box"
import { Section } from "~Layout/components/Page"

const isRefStateObject = (thing: any): thing is RefStateObject =>
  thing && "element" in thing && typeof thing.update === "function"

function Background(props: { children: React.ReactNode; opacity?: number }) {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.08] text-center -z-10">
      {props.children}
    </div>
  )
}





interface Props {
  actions?: React.ReactNode | RefStateObject
  actionsPosition?: "after-content" | "bottom"
  brandColored?: boolean
  background?: React.ReactNode
  backgroundColor?: React.CSSProperties["backgroundColor"]
  children: React.ReactNode
  excessWidth?: number
  fitToShrink?: boolean
  noMaxWidth?: boolean
  preventActionsPlaceholder?: boolean
  preventNotchSpacing?: boolean
  top?: React.ReactNode
}

function DialogBody(props: Props) {

  const isSmallScreen = useIsMobile()

  const actionsPosition = isSmallScreen ? "bottom" : props.actionsPosition || "after-content"
  const excessWidth = props.excessWidth || 0

  const topContent = React.useMemo(() => (props.top ? <Box className="flex-none relative w-full z-10">{props.top}</Box> : null), [props.top])

  const actionsContent = React.useMemo(
    () =>
      props.actions ? (
        <>
          <style>{`
            ${MobileKeyboardOpenedSelector()} {
              .dialog-body-actions {
                display: none !important;
              }
            }
          `}</style>
          <Box
            basis={isSmallScreen && !props.preventActionsPlaceholder ? 80 : undefined}
            className="dialog-body-actions"
            grow={0}
            position="relative"
            ref={isRefStateObject(props.actions) ? props.actions.update : undefined}
            shrink={0}
            width="100%"
          >
            {isRefStateObject(props.actions) ? null : props.actions}
          </Box>
        </>
      ) : null,
    [isSmallScreen, props.actions, props.preventActionsPlaceholder]
  )

  const background = React.useMemo(
    () => (props.background ? <Background opacity={0.08}>{props.background}</Background> : null),
    [props.background]
  )

  return (
    <MainErrorBoundary>
      <Section
        alignItems="stretch"
        brandColored={props.brandColored}
        backgroundColor={props.backgroundColor}
        display="flex"
        height="100%"
        margin="0 auto"
        maxWidth={props.noMaxWidth ? undefined : 900}
        overflowX="hidden"
        padding={isSmallScreen ? "12px 24px" : "24px 32px"}
        style={{ flexDirection: "column" }}
        top={!props.preventNotchSpacing}
        width="100%"
      >
        <React.Suspense fallback={<div className="flex items-center justify-center w-full h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
          {topContent}
          {background}
          <VerticalLayout
            grow={props.fitToShrink ? 0 : 1}
            margin={`0 -${excessWidth}px`}
            maxHeight="100%"
            overflowX="hidden"
            overflowY="auto"
            padding={`0 ${excessWidth}px`}
            position="relative"
            shrink
          >
            {props.children}
            {actionsPosition === "after-content" ? actionsContent : null}
          </VerticalLayout>
          {actionsPosition === "bottom" ? actionsContent : null}
        </React.Suspense>
      </Section>
    </MainErrorBoundary>
  )
}

export default React.memo(DialogBody)
