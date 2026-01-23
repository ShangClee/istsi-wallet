import React from "react"

export const IconProps = {
  className: "",
  style: {} as React.CSSProperties
}

export type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>

function createIcon(path: React.ReactNode, viewBox: string = "0 0 24 24") {
  return React.memo(function Icon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="currentColor"
        width="1em"
        height="1em"
        className={className}
        style={style}
      >
        {path}
      </svg>
    )
  })
}

export const ArrowRightIcon = createIcon(<path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />)
export const ExpandMoreIcon = createIcon(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />)
export const BarChartIcon = createIcon(<path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />)
export const AddIcon = createIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />)
export const CallMadeIcon = createIcon(<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z" />)
export const CallReceivedIcon = createIcon(<path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z" />)
export const RemoveIcon = createIcon(<path d="M19 13H5v-2h14v2z" />)
export const SettingsIcon = createIcon(
  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
)
export const SwapHorizIcon = createIcon(<path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />)
export const CheckIcon = createIcon(<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />)
export const ClearIcon = createIcon(<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />)
export const EditIcon = createIcon(<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />)
export const GroupIcon = createIcon(<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />)
export const VerifiedUserIcon = createIcon(<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />)
export const OpenInNewIcon = createIcon(<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />)
export const SendIcon = createIcon(<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />)
export const DoneAllIcon = createIcon(<path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />)
export const CreditCardIcon = createIcon(<path d="M20 4H4c-1.11 0-2.01.89-2.01 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v4z" />)
export const UpdateIcon = createIcon(<path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.51-3.47-3.51-9.11 0-12.58 3.51-3.47 9.21-3.47 12.72 0l2.74-2.82V10.12z" />)
