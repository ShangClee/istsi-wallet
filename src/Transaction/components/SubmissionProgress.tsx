import React from "react"
import { useTranslation } from "react-i18next"
import Async from "react-promise"
import { ActionButton, CloseButton, DialogActionsBox } from "~Generic/components/DialogActions"
import ErrorIcon from "~Icons/components/Error"
import { HiArrowPath } from "react-icons/hi2"
import SuccessIcon from "~Icons/components/Success"
import { Box, VerticalLayout } from "~Layout/components/Box"
import { explainSubmissionErrorResponse } from "~Generic/lib/horizonErrors"
import { getErrorTranslation } from "~Generic/lib/errors"
import { useIsMobile } from "~Generic/hooks/userinterface"

function Container(props: { children: React.ReactNode }) {
  const isSmallScreen = useIsMobile()
  return (
    <Box width="100%" maxWidth={isSmallScreen ? undefined : "40vw"} height="100%">
      <VerticalLayout padding={10} height="100%" alignItems="center" justifyContent="center">
        {props.children}
      </VerticalLayout>
    </Box>
  )
}

function Heading(props: { children: React.ReactNode }) {
  return (
    <p className="text-center text-base font-medium break-words">
      {props.children}
    </p>
  )
}

export enum SubmissionType {
  default,
  multisig,
  thirdParty
}

const successMessages: { [type: number]: string } = {
  [SubmissionType.default]: "generic.submission-progress.success.default",
  [SubmissionType.multisig]: "generic.submission-progress.success.multisig",
  [SubmissionType.thirdParty]: "generic.submission-progress.success.third-party"
}

interface SubmissionProgressProps {
  onClose?: () => void
  onRetry?: () => Promise<void>
  promise: Promise<any>
  type: SubmissionType
}

function SubmissionProgress(props: SubmissionProgressProps) {
  const { onRetry } = props
  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  const retry = React.useCallback(() => {
    if (onRetry) {
      setLoading(true)
      onRetry().finally(() => setLoading(false))
    }
  }, [onRetry, setLoading])

  return (
    <Async
      promise={props.promise}
      pending={
        <Container>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-blue-600 mb-6" />
          <Heading>{t("generic.submission-progress.pending")}</Heading>
        </Container>
      }
      then={() => (
        <Container>
          <SuccessIcon size={100} />
          <Heading>{t(successMessages[props.type])}</Heading>
        </Container>
      )}
      catch={error => (
        <Container>
          <ErrorIcon size={100} />
          <Heading>
            {error.response
              ? explainSubmissionErrorResponse(error.response, t).message || JSON.stringify(error)
              : getErrorTranslation(error, t)}
          </Heading>
          <DialogActionsBox>
            {props.onRetry && (
              <ActionButton icon={<HiArrowPath className="w-5 h-5" />} loading={loading} onClick={retry} type="primary">
                {t("generic.dialog-actions.retry.label")}
              </ActionButton>
            )}
            <CloseButton onClick={props.onClose} />
          </DialogActionsBox>
        </Container>
      )}
    />
  )
}

export default SubmissionProgress
