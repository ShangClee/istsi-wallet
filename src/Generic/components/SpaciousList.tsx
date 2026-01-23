import React from "react"
import { List } from "~Layout/components/List"

const Divider = (props: { style?: React.CSSProperties; className?: string }) => (
  <hr className={`border-t border-black/10 m-0 ${props.className || ""}`} style={props.style} />
)

type Props = React.HTMLAttributes<HTMLUListElement> & {
  fitHorizontal?: boolean
}

const SpaciousList = (props: Props) => {
  const { fitHorizontal = false, style: styleProp, children: childrenProp, ...listProps } = props
  const children = React.Children.toArray(childrenProp).filter(child => child !== null)
  const dividerStyle: React.CSSProperties = {
    margin: "1em 0",
    marginLeft: fitHorizontal ? 24 : 0
  }
  const style: React.CSSProperties = {
    ...styleProp,
    ...(fitHorizontal
      ? {
          marginLeft: -24
        }
      : {})
  }
  return (
    <List {...listProps} style={style}>
      {children.map((child, index) => (
        <React.Fragment key={index}>
          {index === 0 ? null : <Divider style={dividerStyle} />}
          {child}
        </React.Fragment>
      ))}
    </List>
  )
}

export default SpaciousList
