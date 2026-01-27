import React from "react"

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: React.ReactNode
  error?: boolean
  helperText?: React.ReactNode
  fullWidth?: boolean
  multiline?: boolean
  rows?: number
  variant?: "outlined" | "standard" | "filled"
  InputProps?: {
      startAdornment?: React.ReactNode
      endAdornment?: React.ReactNode
      className?: string
      style?: React.CSSProperties
    }
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  InputLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  FormHelperTextProps?: React.HTMLAttributes<HTMLParagraphElement>
  SelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>
  select?: boolean
  margin?: "none" | "dense" | "normal"
  size?: "small" | "medium"
  value?: string | number
  defaultValue?: string | number
  onChange?: (event: React.ChangeEvent<any>) => void
  children?: React.ReactNode
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    error,
    helperText,
    fullWidth = false,
    multiline = false,
    rows,
    variant = "outlined",
    InputProps,
    inputProps,
    InputLabelProps,
    FormHelperTextProps,
    SelectProps,
    select = false,
    margin = "normal",
    size = "medium",
    className = "",
    style,
    ...props
  },
  ref
) {
  // Extract disableUnderline if it exists in props to prevent it from leaking to the DOM
  // @ts-ignore
  const { disableUnderline, ...otherProps } = props
  const baseInputClasses = `
    ${variant === "outlined" ? "border border-gray-300 rounded" : variant === "filled" ? "bg-gray-100 border-b-2 border-gray-300 rounded-t" : "border-b-2 border-gray-300"}
    ${error ? "border-red-500" : ""}
    ${fullWidth ? "w-full" : ""}
    ${size === "small" ? "px-2 py-1.5 text-sm" : "px-3 py-2"}
    ${margin === "dense" ? "my-1" : margin === "normal" ? "my-2" : ""}
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? "focus:ring-red-500" : "focus:ring-blue-500"}
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${className}
  `.trim().replace(/\s+/g, " ")

  const inputElement = multiline ? (
    <textarea
      ref={ref as any}
      rows={rows || 4}
      className={baseInputClasses}
      style={style}
      {...(inputProps as any)}
      {...otherProps}
    />
  ) : (
    <input
      ref={ref}
      className={baseInputClasses}
      style={style}
      {...inputProps}
      {...otherProps}
    />
  )

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1 ${error ? "text-red-600" : "text-gray-700"} ${InputLabelProps?.className || ""}`}
          {...InputLabelProps}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {InputProps?.startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {InputProps.startAdornment}
          </div>
        )}
        <div className={InputProps?.startAdornment ? "pl-10" : InputProps?.endAdornment ? "pr-10" : ""}>
          {select ? (
            <select
              ref={ref as any}
              className={baseInputClasses}
              style={style}
              value={props.value}
              defaultValue={props.defaultValue}
              onChange={props.onChange as any}
              {...SelectProps}
              {...(otherProps as any)}
            >
              {props.children}
            </select>
          ) : (
            inputElement
          )}
        </div>
        {InputProps?.endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {InputProps.endAdornment}
          </div>
        )}
      </div>
      {helperText && (
        <p
          className={`text-xs mt-1 ${error ? "text-red-600" : "text-gray-500"} ${FormHelperTextProps?.className || ""}`}
          {...FormHelperTextProps}
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

export default TextField
