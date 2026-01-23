import React from "react"
import { useTranslation } from "react-i18next"
import { HorizontalLayout } from "~Layout/components/Box"
import { ReadOnlyTextfield } from "~Generic/components/FormFields"
import { ListItem } from "~Layout/components/List"

interface SummaryDetailsFieldProps {
  fullWidth?: boolean
  helperText?: React.ReactNode
  label: React.ReactNode
  style?: React.CSSProperties
  value: React.ReactNode
}

/** Based on TextField */
export const SummaryDetailsField = React.memo(function SummaryDetailsField(props: SummaryDetailsFieldProps) {
  return (
    <div style={{ flex: props.fullWidth ? "0 0 100%" : "0 0 48%", marginBottom: "10px", ...props.style }}>
      <label className="block text-sm font-medium mb-1 text-gray-700" style={{ whiteSpace: "nowrap" }}>
        {props.label}
      </label>
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          wordBreak: "break-word"
        }}
      >
        {props.value}
      </div>
      {props.helperText && <p className="mt-1 text-sm text-gray-500">{props.helperText}</p>}
    </div>
  )
})

const summaryDetailsLineStyle: React.CSSProperties = {
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 8,
  width: "100%"
}

interface SummaryDetailsLineProps {
  children: React.ReactNode
}

function SummaryDetailsLine(props: SummaryDetailsLineProps) {
  return <HorizontalLayout style={summaryDetailsLineStyle}>{props.children}</HorizontalLayout>
}

interface SummaryItemProps {
  children: React.ReactNode
  heading?: React.ReactNode
}

export function SummaryItem(props: SummaryItemProps) {
  return (
    <div className="flex flex-col items-start border-none py-[1px] w-full">
      {props.heading ? (
        <div className="block py-4 text-lg font-normal text-left text-gray-500 leading-[18px]">
          {props.heading}
        </div>
      ) : null}
      <SummaryDetailsLine>{props.children}</SummaryDetailsLine>
    </div>
  )
}

const ExpandIcon = () => (
  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
  </svg>
)

interface ShowMoreItemProps {
  onClick: () => void
  style?: React.CSSProperties
}

export const ShowMoreItem = React.memo(function ShowMoreItem(props: ShowMoreItemProps) {
  const { t } = useTranslation()
  return (
    <ListItem
      button
      className="border-none -my-2 py-2 hover:bg-transparent"
      onClick={props.onClick}
      style={props.style}
      primaryText={
        <div className="flex items-center justify-center font-medium uppercase text-sm">
          {t("account.transaction-review.action.show-more")} <ExpandIcon />
        </div>
      }
    />
  )
})
