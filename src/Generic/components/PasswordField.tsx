import React from "react"
import { HiEye, HiEyeSlash } from "react-icons/hi2"
import TextField, { TextFieldProps } from "./TextField"

function PasswordField(props: Omit<TextFieldProps, "type">) {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  return (
    <TextField
      variant="standard"
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <button
            type="button"
            onClick={handleClickShowPassword}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEyeSlash className="w-5 h-5 text-gray-600" /> : <HiEye className="w-5 h-5 text-gray-600" />}
          </button>
        )
      }}
    />
  )
}

export default PasswordField
