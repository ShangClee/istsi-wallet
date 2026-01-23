import React from "react"
import { useTranslation } from "react-i18next"
import { Horizon } from "stellar-sdk"
import { HiPlus, HiUser, HiXCircle } from "react-icons/hi2"
import { AccountsContext } from "~App/contexts/accounts"
import { trackError } from "~App/contexts/notifications"
import ButtonListItem from "~Generic/components/ButtonListItem"
import { Address } from "~Generic/components/PublicKey"
import { useFederationLookup } from "~Generic/hooks/stellar"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { isPublicKey, isStellarAddress } from "~Generic/lib/stellar-address"
import { requiresSignatureThreshold } from "../lib/editor"
import { MultisigEditorContext } from "./MultisigEditorContext"
import NewSignerForm from "./NewSignerForm"
import ThresholdInput from "./ThresholdInput"

interface SignerFormValues {
  publicKey: string
  weight: string
}

interface SignerFormErrors {
  publicKey?: Error
  weight?: Error
}

function useFormValidation() {
  const { t } = useTranslation()
  return function validateNewSignerValues(
    values: SignerFormValues,
    signers: Horizon.HorizonApi.AccountSigner[]
  ): SignerFormErrors {
    const errors: SignerFormErrors = {}

    if (!isPublicKey(values.publicKey) && !isStellarAddress(values.publicKey)) {
      errors.publicKey = new Error(
        t("account-settings.manage-signers.signers-editor.validation.invalid-stellar-address")
      )
    } else if (signers.find(existingSigner => existingSigner.key === values.publicKey)) {
      errors.publicKey = new Error(t("account-settings.manage-signers.signers-editor.validation.existing-signer"))
    }
    if (!values.weight.match(/^[0-9]+$/)) {
      errors.weight = new Error(t("account-settings.manage-signers.signers-editor.validation.integer-required"))
    }

    return errors
  }
}

const listItemStyles: React.CSSProperties = {
  background: "white",
  boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.1)"
}

interface SignersEditorProps {
  signers: Horizon.HorizonApi.AccountSigner[]
  showKeyWeights?: boolean
  testnet: boolean
}

function SignersEditor(props: SignersEditorProps) {
  const { accounts } = React.useContext(AccountsContext)
  const { editorState, setEditorState, testnet } = React.useContext(MultisigEditorContext)
  const { lookupFederationRecord } = useFederationLookup()
  const isSmallScreen = useIsMobile()
  const validateNewSignerValues = useFormValidation()
  const thresholdInputRef = React.createRef<HTMLInputElement>()

  const { t } = useTranslation()
  const { preset } = editorState

  const [isEditingNewSigner, setIsEditingNewSigner] = React.useState(false)
  const [newSignerErrors, setNewSignerErrors] = React.useState<SignerFormErrors>({})
  const [newSignerValues, setNewSignerValues] = React.useState<SignerFormValues>({
    publicKey: "",
    weight: "1"
  })

  const editNewSigner = React.useCallback(() => setIsEditingNewSigner(true), [setIsEditingNewSigner])

  const addSigner = (signer: Horizon.HorizonApi.AccountSigner) =>
    setEditorState(prev => ({
      ...prev,
      signersToAdd: [...prev.signersToAdd, signer]
    }))

  const removeSigner = (signer: Horizon.HorizonApi.AccountSigner) => {
    setEditorState(prev => ({
      ...prev,
      signersToAdd: prev.signersToAdd.filter(someSignerToBeAddd => someSignerToBeAddd.key !== signer.key),
      signersToRemove: [...prev.signersToRemove, signer]
    }))
    thresholdInputRef.current?.focus()
  }

  const createCosigner = async () => {
    try {
      const federationRecord =
        newSignerValues.publicKey.indexOf("*") > -1 ? await lookupFederationRecord(newSignerValues.publicKey) : null

      const cosignerPublicKey = federationRecord ? federationRecord.account_id : newSignerValues.publicKey
      const errors = validateNewSignerValues(newSignerValues, props.signers)

      if (Object.keys(errors).length > 0) {
        return setNewSignerErrors(errors)
      }

      addSigner({
        key: cosignerPublicKey,
        type: "ed25519_public_key",
        weight: parseInt(newSignerValues.weight, 10)
      })

      setIsEditingNewSigner(false)
      setNewSignerErrors({})
      setNewSignerValues({
        publicKey: "",
        weight: "1"
      })

      thresholdInputRef.current?.focus()
    } catch (error) {
      trackError(error)
    }
  }

  const updateNewSignerValues = (values: Partial<SignerFormValues>) => {
    setNewSignerValues(prevValues => ({
      ...prevValues,
      ...values
    }))
  }

  return (
    <div className={isSmallScreen ? "p-0" : ""}>
      {isEditingNewSigner ? (
        <NewSignerForm
          errors={newSignerErrors}
          onCancel={() => setIsEditingNewSigner(false)}
          onSubmit={createCosigner}
          onUpdate={updateNewSignerValues}
          style={listItemStyles}
          values={newSignerValues}
        />
      ) : (
        <ButtonListItem gutterBottom onClick={editNewSigner}>
          <HiPlus className="w-6 h-6" />
          &nbsp;&nbsp;
          {t("account-settings.manage-signers.action.add-signer")}
        </ButtonListItem>
      )}
      {props.signers.map(signer => (
        <div key={signer.key} className="flex items-center py-3 px-4 border-b border-gray-100" style={listItemStyles}>
          <div className="flex-shrink-0 mr-6">
            <HiUser className="text-[2rem]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-medium">
              <Address address={signer.key} testnet={props.testnet} variant="full" />
            </div>
            <div className="text-sm text-gray-600">
              {props.showKeyWeights ? (
                <span className="mr-6">
                  {t("account-settings.manage-signers.signers-editor.list.item.weight")}: {signer.weight}
                </span>
              ) : null}
              {accounts.some(account => account.publicKey === signer.key && account.testnet === testnet) ? (
                <span>{t("account-settings.manage-signers.signers-editor.list.item.local-key")}</span>
              ) : null}
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              type="button"
              aria-label="Remove"
              disabled={props.signers.length === 1}
              onClick={() => removeSigner(signer)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiXCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
      {requiresSignatureThreshold(preset) ? (
        <>
          <div className="flex items-center py-3 px-4 border-b border-gray-100" style={listItemStyles}>
            <div className="flex-shrink-0 mr-6 w-6" />
            <div className="flex-1 min-w-0 mr-8 flex-grow-0">
              <div className="text-base font-medium">
                {t("account-settings.manage-signers.signers-editor.threshold.primary")}
              </div>
              <div className="text-sm text-gray-600">
                {t("account-settings.manage-signers.signers-editor.threshold.secondary")}
              </div>
            </div>
            <div className="flex-1">
              <ThresholdInput ref={thresholdInputRef} />
            </div>
          </div>
          <hr className="my-1 border-gray-200" />
        </>
      ) : null}
    </div>
  )
}

export default SignersEditor
