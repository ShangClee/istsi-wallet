import React from "react"
import { useTranslation } from "react-i18next"
import { HiArrowPath } from "react-icons/hi2"
import TextField from "~Generic/components/TextField"
import AccountSettingsItem from "~AccountSettings/components/AccountSettingsItem"
import { QRReader } from "~Generic/components/FormFields"

interface SecretKeyImportProps {
  error?: string
  onEnterSecretKey: (secretKey: string) => void
  secretKey: string
}

function SecretKeyImport(props: SecretKeyImportProps) {
  const { onEnterSecretKey } = props
  const { t } = useTranslation()

  const inputProps = React.useMemo(
    () => ({
      style: { textOverflow: "ellipsis" }
    }),
    []
  )

  const InputProps = React.useMemo(
    () => ({
      endAdornment: <QRReader onScan={onEnterSecretKey} />
    }),
    [onEnterSecretKey]
  )

  const handleInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onEnterSecretKey(event.target.value.trim())
    },
    [onEnterSecretKey]
  )

  return (
    <>
      <AccountSettingsItem icon={<HiArrowPath />}>
        <div className="ml-2">
          <div className="text-base">{t("create-account.options.import.label")}</div>
          <div className="text-sm text-gray-600">{t("create-account.options.import.description")}</div>
        </div>
      </AccountSettingsItem>
      <AccountSettingsItem icon={null} subItem>
        <div style={{ marginLeft: 12, marginRight: 56, marginTop: -8 }}>
          <TextField
            variant="standard"
            error={Boolean(props.error)}
            helperText={props.error ? t("create-account.inputs.import.helper-text") : ""}
            label={props.error || t("create-account.inputs.import.label")}
            placeholder={t("create-account.inputs.import.placeholder")}
            fullWidth
            margin="normal"
            value={props.secretKey}
            onChange={handleInput}
            inputProps={inputProps}
            InputProps={InputProps}
          />
        </div>
      </AccountSettingsItem>
    </>
  )
}

export default React.memo(SecretKeyImport)
