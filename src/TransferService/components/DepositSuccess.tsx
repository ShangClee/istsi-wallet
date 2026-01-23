import React from "react"
import { useTranslation } from "react-i18next"
import { Deposit } from "@satoshipay/stellar-transfer"
import { RefStateObject } from "~Generic/hooks/userinterface"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import { VerticalLayout } from "~Layout/components/Box"
import Portal from "~Generic/components/Portal"
import { TransferStates } from "../util/statemachine"
import { Paragraph, Summary } from "./Sidebar"

interface DepositSuccessProps {
  dialogActionsRef: RefStateObject | undefined
  onClose: () => void
  state: TransferStates.TransferCompleted<Deposit>
}

function DepositSuccess(props: DepositSuccessProps) {
  const { transferServer } = props.state.deposit!
  const { t } = useTranslation()
  return (
    <VerticalLayout grow>
      <VerticalLayout alignItems="center" margin="24px 0" textAlign="center">
        <h5 className="text-xl font-medium mb-4">{t("transfer-service.deposit-success.body.deposit-pending")}</h5>
        <div className="text-sm my-4">
          <p className="my-2 text-sm">
            {t(
              "transfer-service.deposit-success.body.info.1",
              `${transferServer.domain} is waiting for your deposit.`,
              { domain: transferServer.domain }
            )}
          </p>
          <p className="my-2 text-sm">
            {t("transfer-service.deposit-success.body.info.2")}
          </p>
          {/* TODO: Show nice summary */}
        </div>
        <Portal desktop="inline" target={props.dialogActionsRef && props.dialogActionsRef.element}>
          <DialogActionsBox>
            <ActionButton onClick={props.onClose} type="primary">
              {t("transfer-service.deposit-success.action.close")}
            </ActionButton>
          </DialogActionsBox>
        </Portal>
      </VerticalLayout>
    </VerticalLayout>
  )
}

const Sidebar = () => {
  const { t } = useTranslation()
  return (
    <Summary headline={t("transfer-service.deposit-success.sidebar.headline")}>
      <Paragraph>{t("transfer-service.deposit-success.sidebar.info")}</Paragraph>
    </Summary>
  )
}

const SuccessView = Object.assign(React.memo(DepositSuccess), { Sidebar })

export default SuccessView
