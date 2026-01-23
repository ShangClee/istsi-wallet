import React from "react"
import { ListItem } from "~Layout/components/List"

interface ButtonListItemProps {
  children: React.ReactNode
  gutterBottom?: boolean
  onClick: () => void
  style?: React.CSSProperties
}

function ButtonListItem(props: ButtonListItemProps) {
  return (
    <ListItem
      button
      className={`
        bg-black/[0.08] rounded-lg shadow-none
        h-12 sm:h-[52px] md:h-14
        m-0 ${props.gutterBottom ? "mb-4" : ""}
        hover:bg-black/[0.12] focus:bg-black/[0.12]
        transition-colors
      `}
      onClick={props.onClick}
      style={props.style}
      primaryText={
        <div className="flex items-center justify-center h-full w-full text-sm sm:text-base">
          {props.children}
        </div>
      }
    />
  )
}

export default React.memo(ButtonListItem)
