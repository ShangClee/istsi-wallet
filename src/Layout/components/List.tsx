import React from "react"

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>((props, ref) => {
  return (
    <ul
      ref={ref}
      className={`w-full py-2 m-0 p-0 list-none relative ${props.className || ""}`}
      style={props.style}
    >
      {props.children}
    </ul>
  )
})

const ListSubheader = (props: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  return (
    <div
      className={`box-border leading-[48px] pl-4 pr-4 font-medium text-sm text-gray-500 sticky top-0 z-10 bg-white/95 ${
        props.className || ""
      }`}
      style={props.style}
    >
      {props.children}
    </div>
  )
}

const noop = () => undefined

const IconDiv = (props: { children: React.ReactNode }) => {
  return <div className="flex-none flex shrink-0 mr-3">{props.children}</div>
}

interface ListItemProps {
  primaryText: React.ReactNode
  secondaryText?: React.ReactNode | null
  button?: boolean
  heading?: React.ReactNode | null
  leftIcon?: React.ReactNode | null
  rightIcon?: React.ReactNode | null
  onClick?: React.MouseEventHandler<any>
  style?: React.CSSProperties
  className?: string
}

const ListItem = (props: ListItemProps) => {
  const isButton = props.button || Boolean(props.onClick)

  return (
    <div
      className={`
        flex items-center justify-start
        relative box-border w-full py-2 px-4
        no-underline transition-colors
        ${isButton ? "cursor-pointer hover:bg-black/[0.04]" : ""}
        ${props.className || ""}
      `}
      onClick={props.onClick || noop}
      style={props.style}
      role={isButton ? "button" : undefined}
      tabIndex={isButton ? 0 : undefined}
    >
      {props.leftIcon ? <div className="flex-none flex shrink-0 mr-4">{props.leftIcon}</div> : null}
      <div className="flex-1 min-w-0 my-1">
        {props.heading ? <div className="block">{props.heading}</div> : null}
        <div className="block text-base leading-6 text-inherit truncate">{props.primaryText}</div>
        {props.secondaryText ? (
          <div className="block text-sm leading-5 text-gray-500 truncate">{props.secondaryText}</div>
        ) : null}
      </div>
      {props.rightIcon ? <div className="flex-none flex shrink-0 ml-4">{props.rightIcon}</div> : null}
    </div>
  )
}

export { List, ListSubheader, ListItem }
