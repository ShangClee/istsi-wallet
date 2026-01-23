import React from "react"
import { useIsMobile } from "../hooks/userinterface"
import { Box, HorizontalLayout } from "~Layout/components/Box"

const ArrowBackIcon = (props: { className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    className={props.className}
    style={props.style}
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
)

interface BackButtonProps {
  className?: string
  onClick: () => void
  style?: React.CSSProperties
}

// React.memo()-ing, since for some reason re-rendering the KeyboardArrowLeft icon is slow
const BackButton = React.memo(function BackButton(props: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`p-2 rounded-full hover:bg-black/5 transition-colors text-[32px] flex items-center justify-center ${
        props.className || ""
      }`}
      style={{ color: "inherit", ...props.style }}
    >
      <ArrowBackIcon className="text-[32px]" />
    </button>
  )
})

interface Props {
  actions?: React.ReactNode
  badges?: React.ReactNode
  hideBackButton?: boolean
  leftAction?: React.ReactNode
  nowrap?: boolean
  onBack: () => void
  style?: React.CSSProperties
  title: React.ReactNode
  titleColor?: string
  titleStyle?: React.CSSProperties
}

function MainTitle(props: Props) {
  const isSmallScreen = useIsMobile()
  const isTitleOnSecondRow = isSmallScreen && props.actions && !props.hideBackButton

  const backButtonClassName = `text-[28px] flex-none shrink-0 mr-1.5 ${isSmallScreen ? "-ml-3" : "-ml-1"}`

  return (
    <HorizontalLayout
      alignItems="center"
      wrap={
        isSmallScreen && !props.nowrap
          ? props.hideBackButton && !props.leftAction
            ? "wrap-reverse"
            : "wrap"
          : "nowrap"
      }
      style={{ minHeight: isSmallScreen ? undefined : 56, ...props.style }}
    >
      {props.leftAction ? (
        props.leftAction
      ) : props.hideBackButton ? null : (
        <BackButton onClick={props.onBack} className={backButtonClassName} />
      )}
      <HorizontalLayout
        alignItems="center"
        grow={isSmallScreen ? 1 : props.badges ? undefined : 1}
        minWidth={isTitleOnSecondRow ? "100%" : undefined}
        maxWidth="100%"
        order={isTitleOnSecondRow ? 4 : undefined}
      >
        <h5
          className={`flex-1 shrink text-[20px] h-[48px] leading-[48px] mr-3 min-w-[40%] truncate m-0 font-normal ${
            !isSmallScreen ? "sm:text-[24px]" : ""
          }`}
          style={{ color: props.titleColor, ...props.titleStyle }}
        >
          {props.title}
        </h5>
        {props.badges}
      </HorizontalLayout>
      <Box grow={Boolean(props.actions)} className="text-right">
        {props.actions}
      </Box>
    </HorizontalLayout>
  )
}

export default MainTitle
