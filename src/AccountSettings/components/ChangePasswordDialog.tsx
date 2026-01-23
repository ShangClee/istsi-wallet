import React from "react"
import { useTranslation } from "react-i18next"
import { DialogActions } from "~Generic/components/Dialog"
import { HiLockClosed, HiLockOpen } from "react-icons/hi2"
import { Account, AccountsContext } from "~App/contexts/accounts"
import { NotificationsContext } from "~App/contexts/notifications"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { renderFormFieldError, isWrongPasswordError } from "~Generic/lib/errors"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import MainTitle from "~Generic/components/MainTitle"
import PasswordField from "~Generic/components/PasswordField"
import { Box, HorizontalLayout } from "~Layout/components/Box"
import DialogBody from "~Layout/components/DialogBody"

const adornmentLock = (
  <div className="flex items-center">
    <HiLockClosed className="w-5 h-5 text-gray-400" />
  </div>
)

const adornmentLockOpen = (
  <div className="flex items-center">
    <HiLockOpen className="w-5 h-5 text-gray-400" />
  </div>
)

interface FormValues {
  nextPassword: string
  nextPasswordRepeat: string
  prevPassword: string
}

type Errors = { [key in keyof FormValues]?: Error | undefined }

function useFormValidation() {
  const { t } = useTranslation()
  return function validate(formValues: FormValues, passwordMode: "change" | "initial" | "remove") {
    const errors: Errors = {}

    if (!formValues.prevPassword && passwordMode !== "initial") {
      errors.prevPassword = new Error(t("account-settings.set-password.validation.previous-password-missing"))
    }
    if (passwordMode !== "remove") {
      if (!formValues.nextPassword) {
        errors.nextPassword = new Error(t("account-settings.set-password.validation.next-password-missing"))
      }
      if (!formValues.nextPasswordRepeat) {
        errors.nextPasswordRepeat = new Error(
          t("account-settings.set-password.validation.next-password-repeat-missing")
        )
      }
      if (formValues.nextPasswordRepeat && formValues.nextPassword !== formValues.nextPasswordRepeat) {
        errors.nextPasswordRepeat = new Error(t("account-settings.set-password.validation.passwords-no-match"))
      }
    }

    const success = Object.keys(errors).length === 0
    return { errors, success }
  }
}

interface ActionsProps {
  isPasswordProtected: boolean
  removePassword: boolean
  onSubmit: () => void
  onToggleRemovePassword: () => void
}

function Actions(props: ActionsProps) {
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  return (
    <DialogActionsBox smallDialog>
      {props.isPasswordProtected ? (
        isSmallScreen ? (
          <ActionButton onClick={props.onToggleRemovePassword} type="secondary">
            {props.removePassword
              ? t("account-settings.set-password.action.change-password.long")
              : t("account-settings.set-password.action.remove-password.long")}
          </ActionButton>
        ) : (
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              role="switch"
              aria-checked={props.removePassword}
              onClick={props.onToggleRemovePassword}
              className={`${
                props.removePassword ? "bg-blue-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span
                className={`${
                  props.removePassword ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span>{t("account-settings.set-password.action.remove-password.long")}</span>
          </label>
        )
      ) : null}
      <ActionButton icon={<HiLockClosed className="w-5 h-5" />} onClick={props.onSubmit} type="primary">
        {isSmallScreen
          ? props.removePassword
            ? t("account-settings.set-password.action.remove-password.long")
            : t("account-settings.set-password.action.change-password.short")
          : props.removePassword
          ? t("account-settings.set-password.action.remove-password.long")
          : t("account-settings.set-password.action.change-password.long")}
      </ActionButton>
    </DialogActionsBox>
  )
}

interface Props {
  account: Account
  onClose: () => void
}

function ChangePasswordDialog(props: Props) {
  const Accounts = React.useContext(AccountsContext)
  const { showError, showNotification } = React.useContext(NotificationsContext)
  const [errors, setErrors] = React.useState<Errors>({})
  const [formValues, setFormValues] = React.useState<FormValues>({
    nextPassword: "",
    nextPasswordRepeat: "",
    prevPassword: ""
  })
  const [removingPassword, setRemovingPassword] = React.useState(false)
  const validate = useFormValidation()
  const { t } = useTranslation()

  const changePassword = () => {
    const { id: accountID, requiresPassword } = props.account
    const { nextPassword, prevPassword } = formValues

    const passwordMode = requiresPassword ? "change" : "initial"

    const validation = validate(formValues, passwordMode)
    setErrors(validation.errors)

    if (validation.success) {
      // TODO: Show confirmation prompt (dialog)
      Accounts.changePassword(accountID, prevPassword, nextPassword)
        .then(() => {
          showNotification(
            "success",
            requiresPassword
              ? t("account-settings.set-password.notification.password-changed")
              : t("account-settings.set-password.notification.password-set")
          )
          props.onClose()
        })
        .catch(error => {
          isWrongPasswordError(error) ? setErrors({ prevPassword: error }) : showError(error)
        })
    }
  }
  const onClose = () => {
    props.onClose()
    setFormValues({
      nextPassword: "",
      nextPasswordRepeat: "",
      prevPassword: ""
    })
  }
  const removePassword = () => {
    const validation = validate(formValues, "remove")
    setErrors(validation.errors)

    if (validation.success) {
      // TODO: Show confirmation prompt (dialog)
      Accounts.removePassword(props.account.id, formValues.prevPassword)
        .then(() => {
          showNotification("success", t("account-settings.set-password.notification.password-removed"))
          props.onClose()
        })
        .catch(error => {
          isWrongPasswordError(error) ? setErrors({ prevPassword: error }) : showError(error)
        })
    }
  }
  const setFormValue = (name: keyof FormValues, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    })
  }
  const toggleRemovePassword = () => setRemovingPassword(!removingPassword)

  return (
    <DialogBody
      noMaxWidth
      preventNotchSpacing
      top={
        <MainTitle
          hideBackButton
          onBack={onClose}
          title={
            props.account.requiresPassword
              ? t("account-settings.set-password.title.change-password")
              : t("account-settings.set-password.title.set-password")
          }
        />
      }
      actions={
        <DialogActions className="mt-8">
          <Actions
            isPasswordProtected={props.account.requiresPassword}
            onSubmit={removingPassword ? removePassword : changePassword}
            onToggleRemovePassword={toggleRemovePassword}
            removePassword={removingPassword}
          />
        </DialogActions>
      }
    >
      <HorizontalLayout
        alignSelf="center"
        justifyContent="space-evenly"
        margin="24px 0 0"
        width="calc(100% + 16px)"
        wrap="wrap"
      >
        <Box basis="400px" grow={0} hidden={!props.account.requiresPassword} margin="0 16px" shrink>
          <PasswordField
            autoFocus={props.account.requiresPassword && process.env.PLATFORM !== "ios"}
            error={Boolean(errors.prevPassword)}
            label={
              errors.prevPassword
                ? renderFormFieldError(errors.prevPassword, t)
                : t("account-settings.set-password.textfield.prev-password.label")
            }
            fullWidth
            margin="normal"
            value={formValues.prevPassword}
            onChange={event => setFormValue("prevPassword", event.target.value)}
            InputProps={{ startAdornment: adornmentLockOpen }}
          />
        </Box>
        <Box basis="400px" grow={0} hidden={removingPassword} margin="0 16px" shrink>
          <PasswordField
            autoFocus={!props.account.requiresPassword && process.env.PLATFORM !== "ios"}
            error={Boolean(errors.nextPassword)}
            label={
              errors.nextPassword
                ? renderFormFieldError(errors.nextPassword, t)
                : t("account-settings.set-password.textfield.next-password.label")
            }
            fullWidth
            margin="normal"
            value={formValues.nextPassword}
            onChange={event => setFormValue("nextPassword", event.target.value)}
            InputProps={{ startAdornment: adornmentLock }}
          />
          <PasswordField
            error={Boolean(errors.nextPasswordRepeat)}
            label={
              errors.nextPasswordRepeat
                ? renderFormFieldError(errors.nextPasswordRepeat, t)
                : t("account-settings.set-password.textfield.next-password-repeat.label")
            }
            fullWidth
            margin="normal"
            value={formValues.nextPasswordRepeat}
            onChange={event => setFormValue("nextPasswordRepeat", event.target.value)}
            InputProps={{ startAdornment: adornmentLock }}
          />
        </Box>
      </HorizontalLayout>
    </DialogBody>
  )
}

export default React.memo(ChangePasswordDialog)
