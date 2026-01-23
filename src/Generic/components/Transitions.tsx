import React from "react"

interface TransitionProps {
  children: React.ReactElement
  in?: boolean
  onEnter?: () => void
  onExited?: () => void
}

export const SlideUpTransition = React.forwardRef<unknown, TransitionProps>(
  (props, ref) => {
    if (!props.in) return null
    return (
      <div
        ref={ref as any}
        className="transition-transform duration-300 ease-out transform translate-y-0"
        onTransitionEnd={props.onExited}
      >
        {props.children}
      </div>
    )
  }
)

export const SlideLeftTransition = React.forwardRef<unknown, TransitionProps>(
  (props, ref) => {
    if (!props.in) return null
    return (
      <div
        ref={ref as any}
        className="transition-transform duration-300 ease-out transform translate-x-0"
        onTransitionEnd={props.onExited}
      >
        {props.children}
      </div>
    )
  }
)
