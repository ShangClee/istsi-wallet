import React from "react"

const removeNullValueProps = (object: { [key: string]: any }) => {
  return Object.keys(object).reduce((result, propKey) => {
    const propValue = object[propKey]
    if (propValue !== null) {
      return { ...result, [propKey]: propValue }
    } else {
      return result
    }
  }, {})
}

interface SizingStyles {
  width?: React.CSSProperties["width"]
  height?: React.CSSProperties["height"]
  minWidth?: React.CSSProperties["minWidth"]
  maxWidth?: React.CSSProperties["maxWidth"]
  minHeight?: React.CSSProperties["minHeight"]
  maxHeight?: React.CSSProperties["maxHeight"]
  padding?: React.CSSProperties["padding"]
}

interface FlexParentStyles {
  alignItems?: React.CSSProperties["alignItems"]
  justifyContent?: React.CSSProperties["justifyContent"] | "start" | "end"
  wrap?: React.CSSProperties["flexWrap"]
}

interface FlexChildStyles {
  alignSelf?: React.CSSProperties["alignSelf"]
  basis?: number | string
  fixed?: boolean
  grow?: boolean | number
  order?: React.CSSProperties["order"]
  shrink?: boolean | number
}

interface TextStyles {
  fontSize?: React.CSSProperties["fontSize"]
  fontWeight?: React.CSSProperties["fontWeight"]
  textAlign?: React.CSSProperties["textAlign"]
}

export type BoxStyles = SizingStyles &
  FlexParentStyles &
  FlexChildStyles &
  TextStyles & {
    display?: React.CSSProperties["display"]
    hidden?: boolean
    margin?: React.CSSProperties["margin"]
    overflow?: React.CSSProperties["overflow"]
    overflowX?: React.CSSProperties["overflow"]
    overflowY?: React.CSSProperties["overflow"]
    position?: React.CSSProperties["position"]
  }

const clsx = (...args: (string | undefined | null | false)[]) => args.filter(Boolean).join(" ")

const createBoxStyle = (styleProps: BoxStyles) => {
  const { hidden = false, margin, overflow = "visible", overflowX, overflowY, display, position } = styleProps

  const classNames: string[] = []
  const inlineStyles: any = {}

  // Layout & Visibility
  if (hidden) classNames.push("hidden")
  else if (display) inlineStyles.display = display

  if (position) inlineStyles.position = position

  // Sizing
  if (styleProps.width) inlineStyles.width = styleProps.width
  if (styleProps.height) inlineStyles.height = styleProps.height
  if (styleProps.minWidth) inlineStyles.minWidth = styleProps.minWidth
  if (styleProps.maxWidth) inlineStyles.maxWidth = styleProps.maxWidth
  if (styleProps.minHeight) inlineStyles.minHeight = styleProps.minHeight
  if (styleProps.maxHeight) inlineStyles.maxHeight = styleProps.maxHeight
  if (styleProps.padding) inlineStyles.padding = styleProps.padding
  if (margin) inlineStyles.margin = margin

  // Overflow
  if (overflow && overflow !== "visible") inlineStyles.overflow = overflow
  if (overflowX) inlineStyles.overflowX = overflowX
  if (overflowY) inlineStyles.overflowY = overflowY

  // Flex Parent
  if (styleProps.alignItems) inlineStyles.alignItems = styleProps.alignItems === "start" ? "flex-start" : styleProps.alignItems === "end" ? "flex-end" : styleProps.alignItems
  if (styleProps.justifyContent) inlineStyles.justifyContent = styleProps.justifyContent === "start" ? "flex-start" : styleProps.justifyContent === "end" ? "flex-end" : styleProps.justifyContent
  if (styleProps.wrap) inlineStyles.flexWrap = styleProps.wrap

  // Flex Child
  if (styleProps.alignSelf) inlineStyles.alignSelf = styleProps.alignSelf
  if (styleProps.basis) inlineStyles.flexBasis = styleProps.basis
  if (styleProps.order) inlineStyles.order = styleProps.order

  if (typeof styleProps.grow !== "undefined") inlineStyles.flexGrow = typeof styleProps.grow === "boolean" ? (styleProps.grow ? 1 : 0) : styleProps.grow
  if (typeof styleProps.shrink !== "undefined") inlineStyles.flexShrink = typeof styleProps.shrink === "boolean" ? (styleProps.shrink ? 1 : 0) : styleProps.shrink

  if (styleProps.fixed) {
    inlineStyles.flexGrow = 0
    inlineStyles.flexShrink = 0
  }

  // Text
  if (styleProps.fontSize) inlineStyles.fontSize = styleProps.fontSize
  if (styleProps.fontWeight) inlineStyles.fontWeight = styleProps.fontWeight
  if (styleProps.textAlign) inlineStyles.textAlign = styleProps.textAlign

  // Always use border-box
  inlineStyles.boxSizing = "border-box"

  return {
    className: clsx(...classNames),
    style: removeNullValueProps(inlineStyles)
  }
}

export default createBoxStyle
