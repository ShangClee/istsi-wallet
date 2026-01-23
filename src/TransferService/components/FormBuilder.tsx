import React from "react"
import { useTranslation } from "react-i18next"
import TextField from "~Generic/components/TextField"
import { TransferInfoFields } from "@satoshipay/stellar-transfer"
import { formatDescriptionText, formatIdentifier } from "../util/formatters"
import FormLayout from "./FormLayout"

interface FormBuilderFieldProps {
  descriptor: TransferInfoFields[""]
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  style?: React.CSSProperties
  value?: string
}

export function FormBuilderField(props: FormBuilderFieldProps) {
  const { description, choices, optional = false } = props.descriptor
  const { t } = useTranslation()

  const formattedDescription = formatDescriptionText(description)
  const formattedName = formatIdentifier(props.name)
  const placeholder = optional
    ? t("transfer-service.form-builder.placeholder.optional", `(Optional) ${formattedName}`, { name: formattedName })
    : formattedName

  if (choices) {
    return (
      <TextField
        variant="standard"
        helperText={formattedDescription}
        label={formattedName}
        onChange={props.onChange}
        placeholder={placeholder}
        select
        style={{ flexGrow: 1, ...props.style }}
        value={props.value}
      >
        {choices.map((choice, index) => (
          <option key={index} value={choice}>
            {formatIdentifier(choice)}
          </option>
        ))}
      </TextField>
    )
  } else {
    return (
      <TextField
        variant="standard"
        helperText={formattedDescription}
        label={formattedName}
        onChange={props.onChange}
        placeholder={placeholder}
        style={{ flexGrow: 1, ...props.style }}
        value={props.value || ""}
      />
    )
  }
}

interface Props {
  fields: TransferInfoFields
  fieldStyle?: React.CSSProperties
  formValues: { [fieldName: string]: string }
  onSetFormValue: (fieldName: string, newValue: string) => void
  style?: React.CSSProperties
}

export function FormBuilder(props: Props) {
  // We had issues with illegal properties in the fields data
  const fields = Object.entries(props.fields).filter(
    ([fieldName, descriptor]) => descriptor && typeof descriptor === "object"
  )
  return (
    <FormLayout>
      {fields.map(([fieldName, descriptor]) => (
        <FormBuilderField
          key={fieldName}
          descriptor={descriptor}
          name={fieldName}
          onChange={event => props.onSetFormValue(fieldName, event.target.value)}
          style={props.fieldStyle}
          value={props.formValues[fieldName]}
        />
      ))}
    </FormLayout>
  )
}
