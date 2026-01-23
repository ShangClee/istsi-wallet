import React from "react"
import { useTranslation } from "react-i18next"
import { Horizon } from "stellar-sdk"
import { Account } from "~App/contexts/accounts"
import { Address } from "~Generic/components/PublicKey"

interface SignerSelectorProps {
  accounts: Account[]
  onSelect: (signer: Horizon.HorizonApi.AccountSigner) => void
  selected: Horizon.HorizonApi.AccountSigner | undefined
  signers: Horizon.HorizonApi.AccountSigner[]
  testnet: boolean
}

function SignerSelector(props: SignerSelectorProps) {
  const { t } = useTranslation()
  return (
    <div>
      <div>
        {props.signers.map(signer => (
          <div
            key={signer.key}
            className="flex items-center py-3 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            onClick={() => props.onSelect(signer)}
          >
            <div className="flex-shrink-0 mr-6">
              <input
                type="radio"
                checked={props.selected?.key === signer.key}
                value={signer.key}
                readOnly
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-medium">
                <Address address={signer.key} variant="full" testnet={props.testnet} />
              </div>
              {props.accounts.some(
                account => account.publicKey === signer.key && account.testnet === props.testnet
              ) ? (
                <div className="text-sm text-gray-600">
                  {t("account-settings.manage-signers.signers-editor.list.item.local-key")}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(SignerSelector)
