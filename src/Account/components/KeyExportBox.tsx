import QRCode from "qrcode.react"
import React from "react"
import { useTranslation } from "react-i18next"
import { useClipboard } from "~Generic/hooks/userinterface"
import { Box, VerticalLayout } from "~Layout/components/Box"

interface Props {
  export: string
  hideTapToCopy?: boolean
  size: number
}

function KeyExportBox(props: Props) {
  const clipboard = useClipboard()
  const copyToClipboard = React.useCallback(() => clipboard.copyToClipboard(props.export), [clipboard, props.export])
  const { t } = useTranslation()

  return (
    <VerticalLayout alignItems="center" justifyContent="center">
      <VerticalLayout>
        <Box onClick={copyToClipboard} margin="0 auto" style={{ cursor: "pointer" }}>
          <QRCode size={props.size} value={props.export} />
        </Box>
        <Box margin="16px auto">
          <p
            className="text-center mb-3"
            style={{ display: props.hideTapToCopy ? "none" : undefined }}
          >
            {t("account-settings.export-key.info.tap-to-copy")}:
          </p>
          <p
            className="text-center cursor-pointer break-words text-base"
            onClick={copyToClipboard}
            role="button"
            style={{ maxWidth: window.innerWidth - 75 }}
          >
            <b className="break-all">{props.export}</b>
          </p>
        </Box>
      </VerticalLayout>
    </VerticalLayout>
  )
}

export default React.memo(KeyExportBox)
