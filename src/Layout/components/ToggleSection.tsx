import React from "react"
import { Box } from "./Box"

// Styles converted to Tailwind - see className usage below

interface Props {
  checked: boolean
  children: React.ReactNode
  disabled?: boolean
  title: React.ReactNode
  onChange?: () => void
  style?: React.CSSProperties
}

function ToggleSection(props: Props) {
  const onChange = props.onChange && !props.disabled ? props.onChange : undefined
  return (
    <Box className="flex flex-col mt-6 pl-1 first:mt-0" style={props.style}>
      <Box className="flex flex-nowrap" alignItems="center">
        <Box className="flex-shrink-0 -ml-3 w-[70px]">
          <button
            role="switch"
            aria-checked={props.checked}
            disabled={props.disabled}
            onClick={props.onChange}
            className={`${
              props.checked ? "bg-blue-500" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span
              className={`${
                props.checked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </Box>
        <Box className="flex-grow flex-shrink-0 w-[calc(100%-70px)]">
          <h6 className="flex items-center text-lg h-12 leading-6">
            <span className={onChange ? "cursor-pointer" : ""} onClick={onChange}>
              {props.title}
            </span>
          </h6>
        </Box>
      </Box>
      <Box className="flex flex-nowrap">
        <Box className="flex-shrink-0 -ml-3 w-[70px]">{null}</Box>
        <Box className="flex-grow flex-shrink-0 w-[calc(100%-70px)]">{props.children}</Box>
      </Box>
    </Box>
  )
}

export default React.memo(ToggleSection)
