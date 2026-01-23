import React from "react"
import { useTranslation } from "react-i18next"
import Collapse from "~Generic/components/Collapse"
import AccountSettingsItem from "~AccountSettings/components/AccountSettingsItem"
import PasswordField from "~Generic/components/PasswordField"

interface PasswordSettingProps {
  error?: string
  password: string
  onEnterPassword: (password: string) => void
  onRepeatPassword: (password: string) => void
  onTogglePassword: () => void
  repeatedPassword: string
  requiresPassword: boolean
}

function PasswordSetting(props: PasswordSettingProps) {
  const { t } = useTranslation()

  return (
    <>
      <AccountSettingsItem
        caret={props.requiresPassword ? "down" : "right"}
        icon={
          <button
            role="switch"
            aria-checked={props.requiresPassword}
            onClick={props.onTogglePassword}
            className={`${
              props.requiresPassword ? "bg-blue-500" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <span
              className={`${
                props.requiresPassword ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        }
        onClick={props.onTogglePassword}
      >
        <div className="ml-2">
          <div className="text-base font-medium">{t("create-account.options.password.label")}</div>
          <div className="text-sm text-gray-600">
            {props.requiresPassword
              ? t("create-account.options.password.protected")
              : t("create-account.options.password.unprotected")}
          </div>
        </div>
      </AccountSettingsItem>
      <Collapse in={props.requiresPassword}>
        <AccountSettingsItem icon={null} subItem>
          <div className="ml-3 mr-14 -mt-2">
            <PasswordField
              error={Boolean(props.error)}
              fullWidth
              label={t("create-account.inputs.password.label")}
              margin="normal"
              onChange={event => props.onEnterPassword(event.target.value)}
              placeholder={t("create-account.inputs.password.placeholder")}
              value={props.password}
            />
            <PasswordField
              error={Boolean(props.error)}
              fullWidth
              helperText={props.error}
              label={t("create-account.inputs.password-repeat.label")}
              margin="normal"
              onChange={event => props.onRepeatPassword(event.target.value)}
              placeholder={t("create-account.inputs.password-repeat.placeholder")}
              value={props.repeatedPassword}
            />
          </div>
        </AccountSettingsItem>
      </Collapse>
    </>
  )
}

export default React.memo(PasswordSetting)
