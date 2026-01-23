import React from "react"
import { useTranslation } from "react-i18next"
import {
  HiChevronRight,
  HiFingerPrint,
  HiUserGroup,
  HiLanguage,
  HiChatBubbleLeftRight,
  HiCurrencyDollar,
  HiShieldCheck
} from "react-icons/hi2"
import { availableLanguages, languageNames } from "../../../i18n/index"
import AppSettingsItem from "./AppSettingsItem"

interface SettingsToggleProps {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

function SettingsToggle(props: SettingsToggleProps) {
  const { checked, disabled, onChange } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${
        checked ? "bg-blue-500" : "bg-gray-300"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  )
}

interface SettingProps {
  onToggle: () => void
  value: boolean
}

// Styles converted to Tailwind - see className usage below

interface BiometricLockSettingProps {
  enrolled: boolean
  onToggle: () => void
  value: boolean
}

export const BiometricLockSetting = React.memo(function BiometricLockSetting(props: BiometricLockSettingProps) {
  const { t } = useTranslation()
  return (
    <AppSettingsItem
      actions={
        // pass empty onChange handler to prevent calling onToggle twice
        <SettingsToggle checked={props.enrolled && props.value} disabled={!props.enrolled} onChange={() => undefined} />
      }
      icon={<HiFingerPrint className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      onClick={props.enrolled ? props.onToggle : undefined}
      primaryText={
        process.env.PLATFORM === "ios"
          ? t("app-settings.settings.biometric-lock.text.primary.ios")
          : t("app-settings.settings.biometric-lock.text.primary.default")
      }
      secondaryText={
        !props.enrolled
          ? t("app-settings.settings.biometric-lock.text.secondary.not-enrolled")
          : props.value
          ? t("app-settings.settings.biometric-lock.text.secondary.enabled")
          : t("app-settings.settings.biometric-lock.text.secondary.disabled")
      }
    />
  )
})

export const HideMemoSetting = React.memo(function HideMemoSetting(props: SettingProps) {
  const { t } = useTranslation()
  return (
    <AppSettingsItem
      actions={<SettingsToggle checked={!props.value} onChange={props.onToggle} />}
      icon={<HiChatBubbleLeftRight className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      onClick={props.onToggle}
      primaryText={t("app-settings.settings.memo.text.primary")}
      secondaryText={
        props.value
          ? t("app-settings.settings.memo.text.secondary.hidden")
          : t("app-settings.settings.memo.text.secondary.shown")
      }
    />
  )
})

interface LanguageSettingProps {
  onSelect: (language: string) => void
  value: string | null | undefined
}

export const LanguageSetting = React.memo(function LanguageSetting(props: LanguageSettingProps) {
  const { onSelect } = props
  const { t } = useTranslation()

  const browserLanguage = navigator.language.substr(0, 2)

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onSelect(event.target.value)
    },
    [onSelect]
  )

  return (
    <AppSettingsItem
      actions={
        <select
          onChange={handleChange}
          className="ml-2 border-none bg-transparent cursor-pointer focus:outline-none text-base"
          value={props.value || ""}
          style={{ paddingLeft: 8 }}
        >
          {[...availableLanguages].sort().map(lang => (
            <option key={lang} value={lang}>
              {languageNames[lang]} {lang === browserLanguage && "(Auto)"}
            </option>
          ))}
        </select>
      }
      icon={<HiLanguage className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      primaryText={t("app-settings.settings.language.text.primary")}
      secondaryText={t("app-settings.settings.language.text.secondary")}
    />
  )
})

export const MultiSigSetting = React.memo(function MultiSigSetting(props: SettingProps) {
  const { t } = useTranslation()
  return (
    <AppSettingsItem
      actions={<SettingsToggle checked={props.value} onChange={props.onToggle} />}
      icon={<HiUserGroup className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      onClick={props.onToggle}
      primaryText={t("app-settings.settings.multi-sig.text.primary")}
      secondaryText={
        props.value
          ? t("app-settings.settings.multi-sig.text.secondary.enabled")
          : t("app-settings.settings.multi-sig.text.secondary.disabled")
      }
    />
  )
})

interface TestnetSettingProps {
  hasTestnetAccount: boolean
  onToggle: () => void
  value: boolean
}

export const TestnetSetting = React.memo(function TestnetSetting(props: TestnetSettingProps) {
  const { t } = useTranslation()
  return (
    <AppSettingsItem
      actions={<SettingsToggle checked={props.value} disabled={props.hasTestnetAccount} onChange={props.onToggle} />}
      icon={<HiCurrencyDollar className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      onClick={props.hasTestnetAccount ? undefined : props.onToggle}
      primaryText={t("app-settings.settings.testnet.text.primary")}
      secondaryText={
        props.hasTestnetAccount
          ? t("app-settings.settings.testnet.text.secondary.cannot-disable")
          : props.value
          ? t("app-settings.settings.testnet.text.secondary.shown")
          : t("app-settings.settings.testnet.text.secondary.hidden")
      }
    />
  )
})

interface TrustedServicesSettingProps {
  onClick: () => void
}

export const TrustedServicesSetting = React.memo(function TrustedServicesSetting(props: TrustedServicesSettingProps) {
  const { t } = useTranslation()
  return (
    <AppSettingsItem
      actions={
        <div className="text-[48px] text-black/35 flex items-center justify-center -mr-2 w-12">
          <HiChevronRight className="text-[48px]" />
        </div>
      }
      icon={<HiShieldCheck className="text-[28px] mr-1 w-7 flex items-center justify-center" />}
      onClick={props.onClick}
      primaryText={t("app-settings.settings.trusted-services.text.primary")}
      secondaryText={t("app-settings.settings.trusted-services.text.secondary")}
    />
  )
})
