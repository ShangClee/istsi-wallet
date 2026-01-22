import React from "react"
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar"
import SnackbarContent from "@mui/material/SnackbarContent"
import { styled } from "@mui/material/styles"
import CheckIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt"
import blue from "@mui/material/colors/blue"
import green from "@mui/material/colors/green"
import grey from "@mui/material/colors/grey"
import { Notification, NotificationType } from "~App/contexts/notifications"
import theme from "~App/theme"

const icons: { [key in NotificationType]: React.ComponentType<any> } = {
  connection: OfflineBoltIcon,
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon
}

const StyledSnackbar = styled(Snackbar, {
  shouldForwardProp: prop => prop !== "clickable"
})<{ clickable?: boolean }>(({ clickable }) => ({
  ...(clickable && {
    cursor: "pointer"
  })
}))

const StyledSnackbarContent = styled(SnackbarContent, {
  shouldForwardProp: prop => prop !== "notificationType"
})<{ notificationType: NotificationType }>(({ notificationType }) => ({
  backgroundColor:
    notificationType === "connection"
      ? grey["500"]
      : notificationType === "error"
      ? theme.palette.error.dark
      : notificationType === "info"
      ? blue["500"]
      : green["500"]
}))

const MessageContainer = styled("div")({
  alignItems: "center",
  display: "flex",
  overflow: "hidden",
  [theme.breakpoints.down(600)]: {
    width: "90vw"
  }
})

const StyledIcon = styled("span")({
  fontSize: 20,
  opacity: 0.9,
  marginRight: theme.spacing(1),
  display: "flex",
  alignItems: "center"
})

const MessageText = styled("span")({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap"
})

interface NotificationProps {
  anchorOrigin?: SnackbarOrigin
  autoHideDuration?: number
  contentStyle?: React.CSSProperties
  icon?: React.ComponentType<{ className: string }>
  message: string
  type: NotificationType
  open?: boolean
  onClick?: () => void
  onClose?: () => void
  style?: React.CSSProperties
}

function Notification(props: NotificationProps) {
  const { open = true } = props

  const Icon = props.icon || icons[props.type]

  return (
    <StyledSnackbar
      anchorOrigin={props.anchorOrigin}
      autoHideDuration={props.autoHideDuration}
      clickable={!!props.onClick}
      open={open}
      onClick={props.onClick}
      onClose={props.onClose}
      style={props.style}
    >
      <StyledSnackbarContent
        notificationType={props.type}
        message={
          <MessageContainer>
            <StyledIcon>
              <Icon className="" />
            </StyledIcon>
            <MessageText>{props.message}</MessageText>
          </MessageContainer>
        }
        style={props.contentStyle}
      />
    </StyledSnackbar>
  )
}

export default React.memo(Notification)
