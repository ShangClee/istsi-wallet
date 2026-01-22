import React from "react"
import { TransitionProps } from "@mui/material/transitions"
import Slide from "@mui/material/Slide"

export const SlideUpTransition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement }>(
  (props, ref) => <Slide direction="up" ref={ref} {...props} />
)

export const SlideLeftTransition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement }>(
  (props, ref) => <Slide direction="left" ref={ref} {...props} />
)
