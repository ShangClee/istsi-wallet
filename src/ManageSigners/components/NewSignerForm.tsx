import React from "react"
import { useTranslation } from "react-i18next"
import TextField from "~Generic/components/TextField"
import { HiCheck, HiXMark, HiUserPlus } from "react-icons/hi2"
import { useIsSmallMobile, useIsMobile } from "~Generic/hooks/userinterface"
import { HorizontalLayout } from "~Layout/components/Box"

interface FormValues {
  publicKey: string
  weight: string
}

interface FormErrors {
  publicKey?: Error
  weight?: Error
}

interface Props {
  errors: FormErrors
  values: FormValues
  onCancel: () => void
  onSubmit: () => void
  onUpdate: (values: Partial<FormValues>) => void
  style?: React.CSSProperties
}

function NewSignerForm(props: Props) {
  const isSmallScreen = useIsMobile()
  const isTinyScreen = useIsSmallMobile()
  const { t } = useTranslation()

  return (
    <div className="flex items-center py-3 px-4 border-b border-gray-100" style={props.style}>
      <div className="flex-shrink-0 mr-6">
        <HiUserPlus className="text-[2rem]" />
      </div>
      <div className="flex-1 min-w-0">
        <HorizontalLayout>
          <TextField
            variant="standard"
            autoFocus={process.env.PLATFORM !== "ios"}
            error={!!props.errors.publicKey}
            label={
              props.errors.publicKey
                ? props.errors.publicKey.message
                : t("account-settings.manage-signers.signers-editor.new-signer.label")
            }
            placeholder={
              isSmallScreen
                ? t("account-settings.manage-signers.signers-editor.new-signer.placeholder.short")
                : t("account-settings.manage-signers.signers-editor.new-signer.placeholder.long")
            }
            onChange={event => props.onUpdate({ publicKey: event.target.value.trim() })}
            style={{ flexGrow: 1 }}
            InputProps={isTinyScreen ? { style: { fontSize: "0.8rem" } } : undefined}
            value={props.values.publicKey}
          />
        </HorizontalLayout>
      </div>
      <div className="flex-shrink-0 ml-2 min-w-0">
        <button
          type="button"
          onClick={props.onSubmit}
          className="p-2 border-2 border-brand-main rounded-full hover:bg-brand-main/10 transition-colors"
        >
          <HiCheck className="w-6 h-6 text-brand-main" />
        </button>
      </div>
      <div className="flex-shrink-0 min-w-0">
        <button
          type="button"
          onClick={props.onCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <HiXMark className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

export default NewSignerForm
