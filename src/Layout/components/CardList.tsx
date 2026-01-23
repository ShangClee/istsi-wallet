import React from "react"
import { HorizontalLayout } from "./Box"

export function CardListCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, style, ...rest } = props
  return (
    <div
      className={`w-[47%] min-w-[250px] max-w-[500px] grow m-[12px_1%] rounded-lg shadow-md bg-white ${
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
  const { margin = "0 -1%", width = "102%" } = props
  return (
    <HorizontalLayout justifyContent="space-evenly" wrap="wrap" margin={margin} width={width}>
      {props.children}
      {props.addInvisibleCard ? <CardListCard style={{ visibility: "hidden" }} /> : null}
    </HorizontalLayout>
  )
}
