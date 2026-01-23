import React from "react"
import { HiMagnifyingGlass } from "react-icons/hi2"
import { trackError } from "~App/contexts/notifications"
import QRImportDialog from "~Generic/components/QRImport"
import QRReaderIcon from "~Icons/components/QRReader"
import TextField, { TextFieldProps } from "./TextField"

// useMediaQuery replacement
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query, matches])
  return matches
}

// Export TextField types for compatibility
export type { TextFieldProps }
export type OutlinedTextFieldProps = TextFieldProps

const desktopQRIconStyle: React.CSSProperties = { fontSize: 20 }
const mobileQRIconStyle: React.CSSProperties = {}

interface Props {
  onScan: (data: string) => void
}

export const QRReader = React.memo(function QRReader(props: Props) {
  const { onScan } = props
  const isTouchScreen = useMediaQuery("(hover: none)")
  const [isQRReaderOpen, setQRReaderOpen] = React.useState(false)
  const closeQRReader = React.useCallback(() => setQRReaderOpen(false), [])
  const openQRReader = React.useCallback(() => setQRReaderOpen(true), [])

  const handleQRScan = React.useCallback(
    (data: string | null) => {
      if (data) {
        onScan(data)
        closeQRReader()
      }
    },
    [closeQRReader, onScan]
  )

  return (
    <>
      <button
        onClick={openQRReader}
        tabIndex={99}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        type="button"
        aria-label="QR Reader"
      >
        <QRReaderIcon style={isTouchScreen ? mobileQRIconStyle : desktopQRIconStyle} />
      </button>
      <QRImportDialog open={isQRReaderOpen} onClose={closeQRReader} onError={trackError} onScan={handleQRScan} />
    </>
  )
})

type PriceInputProps = TextFieldProps & {
  assetCode: React.ReactNode
  assetStyle?: React.CSSProperties
  readOnly?: boolean
}

export const PriceInput = React.memo(function PriceInput(props: PriceInputProps) {
  const { assetCode, assetStyle, readOnly, ...textfieldProps } = props
  return (
    <TextField
      {...textfieldProps}
      disabled={readOnly}
      readOnly={readOnly}
      inputProps={{
        pattern: "[0-9]*",
        inputMode: "decimal",
        ...textfieldProps.inputProps
      }}
      InputProps={{
        endAdornment: (
          <div
            style={{
              pointerEvents: typeof assetCode === "string" ? "none" : undefined,
              ...assetStyle
            }}
          >
            {assetCode}
          </div>
        ),
        ...textfieldProps.InputProps
      }}
      style={{
        pointerEvents: props.readOnly ? "none" : undefined,
        ...textfieldProps.style
      }}
    />
  )
})

type ReadOnlyTextfieldProps = TextFieldProps & {
  disableUnderline?: boolean
  multiline?: boolean
}

export const ReadOnlyTextfield = React.memo(function ReadOnlyTextfield(props: ReadOnlyTextfieldProps) {
  const { disableUnderline, multiline, className = "", ...textfieldProps } = props
  return (
    <TextField
      variant={disableUnderline === false ? "standard" : "outlined"}
      {...textfieldProps}
      multiline={multiline}
      disabled
      readOnly
      className={`focus:outline-none ${className}`}
      tabIndex={-1}
    />
  )
})

export const SearchField = React.memo(function SearchField(props: Omit<OutlinedTextFieldProps, "variant">) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      InputProps={{
        endAdornment: <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />,
        ...props.InputProps
      }}
    />
  )
})
