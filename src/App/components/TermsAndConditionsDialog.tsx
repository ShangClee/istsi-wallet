import React from "react"
import { useTranslation, Trans } from "react-i18next"
import { VerticalLayout } from "~Layout/components/Box"
import { Section } from "~Layout/components/Page"
import { Dialog } from "~Generic/components/Dialog"

// --- Tailwind Helper Components ---

const Checkbox = ({ checked, onChange, style }: any) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    style={style}
  />
)

const FormControlLabel = ({ control, label, style }: any) => (
  <label className="flex items-start cursor-pointer" style={style}>
    <div className="flex items-center h-5 mr-3">{control}</div>
    <div className="text-sm select-none">{label}</div>
  </label>
)

const Button = ({ disabled, onClick, children, className, style }: any) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`px-6 py-2 rounded text-white font-medium shadow-sm transition-colors
      ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
      ${className || ""}`}
    style={style}
  >
    {children}
  </button>
)

// --- End Helpers ---

function CheckboxLabel(props: { children: React.ReactNode }) {
  return <span style={{ color: "white", fontSize: "120%" }}>{props.children}</span>
}

function ExternalLink(props: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={props.href}
      style={{ color: "inherit", fontWeight: "bold", textDecoration: "underline" }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  )
}

interface Props {
  open: boolean
  onConfirm: () => void
}

function TermsAndConditions(props: Props) {
  const [checkedNotes, setCheckedNotes] = React.useState([false, false])
  const allConfirmed = checkedNotes.every(isChecked => isChecked)
  const { t } = useTranslation()

  const toggleNoteChecked = (index: number) => {
    const updatedNoteChecks = [...checkedNotes]
    updatedNoteChecks[index] = !updatedNoteChecks[index]
    setCheckedNotes(updatedNoteChecks)
  }

  return (
    <Section brandColored top bottom style={{ display: "flex", flexDirection: "column" }}>
      <VerticalLayout grow={1} justifyContent="center" margin="0 auto" padding="3vh 4vw" maxWidth={800}>
        <h4 className="text-3xl font-normal text-inherit m-0">
          {t("app.terms-and-conditions.header")}
        </h4>
        <div style={{ margin: "3em 0" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedNotes[0]}
                onChange={() => toggleNoteChecked(0)}
                style={{ color: "inherit", marginTop: -7 }}
              />
            }
            label={<CheckboxLabel>{t("app.terms-and-conditions.checkbox.1.label")}</CheckboxLabel>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedNotes[1]}
                onChange={() => toggleNoteChecked(1)}
                style={{ color: "inherit", marginTop: -7 }}
              />
            }
            label={
              <CheckboxLabel>
                <Trans i18nKey="app.terms-and-conditions.checkbox.2.label">
                  I have read, understood and agree to the
                  <ExternalLink href="https://solarwallet.io/terms.html">Terms and Conditions</ExternalLink> &amp;
                  <ExternalLink href="https://solarwallet.io/privacy.html">Privacy policy</ExternalLink> of Solar.
                </Trans>
              </CheckboxLabel>
            }
            style={{
              marginTop: 16
            }}
          />
        </div>
        <Button
          disabled={!allConfirmed}
          onClick={props.onConfirm}
          className="text-lg py-3 px-8 self-center"
        >
          {t("app.terms-and-conditions.action.confirm")}
        </Button>
      </VerticalLayout>
    </Section>
  )
}

function TermsAndConditionsDialog(props: Props) {
  // Super important to make sure that the Dialog unmounts on exit, so it won't act as an invisible click blocker!
  return (
    <Dialog
      open={props.open}
      fullScreen
    >
      <TermsAndConditions {...props} />
    </Dialog>
  )
}

export default React.memo(TermsAndConditionsDialog)
