import React from "react"

interface FaderProps {
  children: React.ReactNode[]
  className?: string
  current: number
  style?: React.CSSProperties
}

function Fader(props: FaderProps) {
  const rootClass = "block relative h-full overflow-auto w-full"
  const slideClass = "block absolute inset-0 opacity-0 overflow-auto transition-opacity duration-300 will-change-opacity"
  const activeClass = "opacity-100"

  return (
    <div className={`${rootClass} ${props.className || ""}`} style={props.style}>
      {props.children.map((child, index) => (
        <div className={`${slideClass} ${index === props.current ? activeClass : ""}`} key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}

interface VirtualizedCarouselProps {
  className?: string
  current: React.ReactNode
  index: number
  next?: React.ReactNode
  prev?: React.ReactNode
  size: number
  style?: React.CSSProperties
}

function VirtualizedCarousel(props: VirtualizedCarouselProps) {
  const children: React.ReactNode[] = []

  for (let i = 0; i < props.size; i++) {
    let child: React.ReactNode

    if (i === props.index) {
      child = props.current
    } else if (i === props.index - 1) {
      child = props.prev || null
    } else if (i === props.index + 1) {
      child = props.next || null
    } else {
      child = null
    }

    children.push(<React.Fragment key={i}>{child}</React.Fragment>)
  }

  return (
    <Fader className={props.className} current={props.index} style={props.style}>
      {children}
    </Fader>
  )
}

export default React.memo(VirtualizedCarousel)
