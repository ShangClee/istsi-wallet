import React from "react"

interface Props {
  height?: string | number
  style?: React.CSSProperties
}

function ViewLoading(props: Props) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: props.height || "100%",
        alignItems: "center",
        flexShrink: 0,
        justifyContent: "center",
        ...props.style
      }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default React.memo(ViewLoading)
