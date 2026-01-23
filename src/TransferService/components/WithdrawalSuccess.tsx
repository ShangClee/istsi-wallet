import React from "react"
import { useTranslation } from "react-i18next"
import { Withdrawal } from "@satoshipay/stellar-transfer"
import { RefStateObject } from "~Generic/hooks/userinterface"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import { VerticalLayout } from "~Layout/components/Box"
import Portal from "~Generic/components/Portal"
import { TransferStates } from "../util/statemachine"
import { Paragraph, Summary } from "./Sidebar"

interface WithdrawalSuccessProps {
  dialogActionsRef: RefStateObject | undefined
  onClose: () => void
  state: TransferStates.TransferCompleted<Withdrawal>
}

function WithdrawalSuccess(props: WithdrawalSuccessProps) {
  const { transferServer } = props.state.withdrawal!
  const { t } = useTranslation()
  return (
    <VerticalLayout grow>
      <VerticalLayout alignItems="center" margin="24px 0" textAlign="center">
        <h5 className="text-xl font-medium mb-4">{t("transfer-service.withdrawal-success.body.withdrawal-in-progress")}</h5>
        <div className="text-sm my-4">
          <p className="my-2 text-sm">
            {t(
              "transfer-service.withdrawal-success.body.info.1",
              `${transferServer.domain} is conducting the withdrawal.`,
              { domain: transferServer.domain }
            )}
          </p>
          <p className="my-2 text-sm">
            {t("transfer-service.withdrawal-success.body.info.2")}
          </p>
          {/* TODO: Show nice summary */}
        </div>
        <Portal desktop="inline" target={props.dialogActionsRef && props.dialogActionsRef.element}>
          <DialogActionsBox>
            <ActionButton onClick={props.onClose} type="primary">
              {t("transfer-service.withdrawal-success.action.close")}
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
    <Summary headline={t("transfer-service.withdrawal-success.sidebar.headline")}>
      <Paragraph>{t("transfer-service.withdrawal-success.sidebar.info")}</Paragraph>
    </Summary>
  )
}

const SuccessView = Object.assign(React.memo(WithdrawalSuccess), { Sidebar })

export default SuccessView
