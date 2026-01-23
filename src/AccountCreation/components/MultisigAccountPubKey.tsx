import React from "react"
import { useTranslation } from "react-i18next"
import { HiUserGroup, HiInformationCircle } from "react-icons/hi2"
import TextField from "~Generic/components/TextField"
import Collapse from "~Generic/components/Collapse"
import AccountSettingsItem from "~AccountSettings/components/AccountSettingsItem"
import { QRReader } from "~Generic/components/FormFields"
import { useIsMobile } from "~Generic/hooks/userinterface"

const FundingNote = React.memo(function FundingNote() {
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  return (
    <p className="text-gray-600 text-sm flex items-center mt-2">
      <HiInformationCircle className="text-lg -ml-7 mr-2" />
      {isSmallScreen
        ? t("create-account.inputs.multisig-account.explanation-short")
        : t("create-account.inputs.multisig-account.explanation-long")}
    </p>
  )
})

interface MultisigAccountPubKeyProps {
  enabled: boolean
  error?: string
  import?: boolean
  onEnter: (value: string) => void
  onToggle?: () => void
  value: string
}

function MultisigAccountPubKey(props: MultisigAccountPubKeyProps) {
  const { onEnter } = props
  const { t } = useTranslation()

  const inputProps = React.useMemo(
    () => ({
      style: { textOverflow: "ellipsis" }
    }),
    []
  )

  const InputProps = React.useMemo(
    () => ({
      endAdornment: <QRReader onScan={onEnter} />
    }),
    [onEnter]
  )

  const handleInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onEnter(event.target.value.trim())
    },
    [onEnter]
  )

  return (
    <>
      <AccountSettingsItem
        icon={
          !props.onToggle ? (
            <HiUserGroup className="w-6 h-6" />
          ) : (
            <button
              role="switch"
              aria-checked={props.enabled}
              onClick={props.onToggle}
              className={`${
                props.enabled ? "bg-blue-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span
                className={`${
                  props.enabled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          )
        }
        onClick={props.onToggle}
      >
        {props.import ? (
          <div className="ml-2">
            <div className="text-base font-medium">{t("create-account.options.cosigner-import.label")}</div>
            <div className="text-sm text-gray-600">{t("create-account.options.cosigner-import.description")}</div>
          </div>
        ) : (
          <div className="ml-2">
            <div className="text-base font-medium">{t("create-account.options.cosigner.label")}</div>
            <div className="text-sm text-gray-600">{t("create-account.options.cosigner.description")}</div>
          </div>
        )}
      </AccountSettingsItem>
      <Collapse in={props.enabled}>
        <AccountSettingsItem icon={null} subItem>
          <div className="ml-3 mr-14 -mt-2">
            <TextField
              variant="standard"
              error={Boolean(props.error)}
              helperText={props.error ? t("create-account.inputs.multisig-account.helper-text") : ""}
              label={props.error || t("create-account.inputs.multisig-account.label")}
              placeholder={t("create-account.inputs.multisig-account.placeholder")}
              fullWidth
              margin="normal"
              value={props.value}
              onChange={handleInput}
              inputProps={inputProps}
              InputProps={InputProps}
            />
            {props.import ? null : <FundingNote />}
          </div>
        </AccountSettingsItem>
      </Collapse>
    </>
  )
}

export default React.memo(MultisigAccountPubKey)
