import React from "react"

export function CardListCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, style, ...rest } = props
  return (
    <div
      className={`w-full h-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        className || ""
      }`}
      style={style}
      {...rest}
    />
  )
}

interface CardListProps {
  addInvisibleCard?: boolean
  children: React.ReactNode
  margin?: string
  width?: string
}

export function CardList(props: CardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-7xl mx-auto">
      {props.children}
    </div>
  )
}
