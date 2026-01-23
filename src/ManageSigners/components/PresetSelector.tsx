import React from "react"
import { useTranslation } from "react-i18next"
import { HiChevronRight } from "react-icons/hi2"
import AccountSettingsItem from "~AccountSettings/components/AccountSettingsItem"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import Portal from "~Generic/components/Portal"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { RefStateObject } from "~Generic/hooks/userinterface"
import { VerticalLayout } from "~Layout/components/Box"
import { MultisigPreset, MultisigPresets } from "../lib/editor"
import { MultisigEditorContext } from "./MultisigEditorContext"

interface PresetSelectorItemProps {
  onChange: () => void
  primary: React.ReactNode
  secondary: React.ReactNode
  selected: boolean
}

const PresetSelectorItem = React.memo(function PresetSelectorItem(props: PresetSelectorItemProps) {
  return (
    <AccountSettingsItem
      icon={
        <input
          type="radio"
          checked={props.selected}
          onChange={props.onChange}
          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
        />
      }
      onClick={props.onChange}
    >
      <div className="flex-1 min-w-0">
        <div className="text-base font-medium">{props.primary}</div>
        <div className="text-sm text-gray-600">{props.secondary}</div>
      </div>
    </AccountSettingsItem>
  )
})

interface PresetSelectorProps {
  actionsRef: RefStateObject | undefined
  onProceed: () => void
  style?: React.CSSProperties
}

function PresetSelector(props: PresetSelectorProps) {
  const { accountID, editorState, setEditorState, testnet } = React.useContext(MultisigEditorContext)
  const { t } = useTranslation()
  const accountData = useLiveAccountData(accountID, testnet)
  const minKeyWeight = Math.min(...accountData.signers.map(signer => signer.weight))

  // Signers editor only makes sense for multi-sig setups or when switching back to single sig
  const canProceed = editorState.preset.type !== MultisigPresets.Type.SingleSignature || accountData.signers.length > 1

  const setPreset = (preset: MultisigPreset) =>
    setEditorState(prev => ({
      ...prev,
      preset
    }))

  return (
    <VerticalLayout>
      <h6 className="mb-4 mx-2 text-lg font-medium">
        {t("account-settings.manage-signers.preset-selector.title")}
      </h6>
      <div>
        <div style={props.style}>
          <PresetSelectorItem
            onChange={() => setPreset({ type: MultisigPresets.Type.SingleSignature })}
            primary={t("account-settings.manage-signers.preset-selector.options.single-signature.primary")}
            selected={editorState.preset.type === MultisigPresets.Type.SingleSignature}
            secondary={t("account-settings.manage-signers.preset-selector.options.single-signature.secondary")}
          />
          <PresetSelectorItem
            onChange={() =>
              setPreset({
                requiredKeyWeight: accountData.thresholds.high_threshold || minKeyWeight,
                type: MultisigPresets.Type.MOutOfN
              })
            }
            primary={t("account-settings.manage-signers.preset-selector.options.m-out-of-n.primary")}
            selected={editorState.preset.type === MultisigPresets.Type.MOutOfN}
            secondary={t("account-settings.manage-signers.preset-selector.options.m-out-of-n.secondary")}
          />
          <PresetSelectorItem
            onChange={() => setPreset({ type: MultisigPresets.Type.OneOutOfN })}
            primary={t("account-settings.manage-signers.preset-selector.options.one-out-of-n.primary")}
            selected={editorState.preset.type === MultisigPresets.Type.OneOutOfN}
            secondary={t("account-settings.manage-signers.preset-selector.options.one-out-of-n.secondary")}
          />
        </div>
      </div>
      <Portal target={props.actionsRef?.element}>
        <DialogActionsBox desktopStyle={{ margin: 0 }}>
          <ActionButton disabled={!canProceed} icon={<HiChevronRight className="w-5 h-5" />} onClick={props.onProceed} type="submit">
            {t("account-settings.manage-signers.action.proceed")}
          </ActionButton>
        </DialogActionsBox>
      </Portal>
    </VerticalLayout>
  )
}

export default React.memo(PresetSelector)
