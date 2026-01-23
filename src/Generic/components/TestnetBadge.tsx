import React from "react"
import { useTranslation } from "react-i18next"

const TestnetBadge = (props: { style?: React.CSSProperties }) => {
  const { t } = useTranslation()

  return (
    <div
      className="relative inline-block -top-1 px-1.5 py-0.5 bg-gray-500 rounded text-white text-[10px] leading-[14px] uppercase"
      style={props.style}
    >
      {t("generic.testnet-badge.label")}
    </div>
  )
}

export default TestnetBadge
