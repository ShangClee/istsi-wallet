import React from "react"

const Container = (props: { children: React.ReactNode; style?: React.CSSProperties }) => {
  return <span style={{ display: "flex", alignItems: "center", height: 24, ...props.style }}>{props.children}</span>
}

const Icon = (props: { children: React.ReactNode }) => {
  return <span style={{ display: "flex", alignItems: "center", flexGrow: 1, marginRight: 8 }}>{props.children}</span>
}

const Label = (props: { children: React.ReactNode }) => {
  return (
    <span style={{ display: "flex", alignItems: "center", flexGrow: 1, lineHeight: "100%" }}>{props.children}</span>
  )
}

interface Props {
  children?: React.ReactNode | null
  label: React.ReactNode
  loading?: boolean
  loaderColor?: string
  style?: React.CSSProperties
}

const ButtonIconLabel = (props: Props) => {
  const loader = (
    <div
      className="animate-spin rounded-full border-b-2"
      style={{ width: "1.2em", height: "1.2em", borderColor: props.loaderColor || "currentColor" }}
    />
  )
  return (
    <Container style={props.style}>
      {props.children || props.loading ? <Icon>{props.loading ? loader : props.children}</Icon> : null}
      <Label>{props.label}</Label>
    </Container>
  )
}

export default ButtonIconLabel
