import React from "react"
import { useTranslation } from "react-i18next"
import { DialogContent } from "~Generic/components/Dialog"
import DialogBody from "~Layout/components/DialogBody"
import TrustedServiceSelectionList from "./TrustedServiceSelectionList"

function ManageTrustedServicesDialog() {
  const { t } = useTranslation()

  return (
    <DialogBody>
      <DialogContent style={{ flexGrow: 0, padding: 0 }}>
        <p className="text-justify mt-2 text-base text-gray-700">
          {t("app-settings.trusted-services.info")}
        </p>

        <TrustedServiceSelectionList />
      </DialogContent>
    </DialogBody>
  )
}

export default React.memo(ManageTrustedServicesDialog)
