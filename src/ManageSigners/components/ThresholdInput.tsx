import React from "react"
import { getSignatureThreshold } from "../lib/editor"
import { MultisigEditorContext } from "./MultisigEditorContext"

interface ThresholdInputProps {
  inputRef?: React.Ref<any>
}

function ThresholdInput(props: ThresholdInputProps) {
  const { editorState, setEditorState } = React.useContext(MultisigEditorContext)
  const { preset } = editorState

  const value = String(getSignatureThreshold(preset))

  const setThreshold = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist()

      setEditorState(prev => {
        const newThreshold = Number.parseInt(event.target.value, 10)

        if ("requiredKeyWeight" in prev.preset) {
          return {
            ...prev,
            preset: {
              ...prev.preset,
              requiredKeyWeight: newThreshold
            }
          }
        } else if ("thresholds" in prev.preset) {
          return {
            ...prev,
            preset: {
              ...prev.preset,
              thresholds: {
                high_threshold: newThreshold,
                med_threshold: newThreshold,
                low_threshold: newThreshold
              }
            }
          }
        } else {
          throw Error(`Cannot update thresholds for multi-sig preset of type "${prev.preset.type}"`)
        }
      })
    },
    [setEditorState]
  )

  return (
    <input
      ref={props.inputRef}
      type="number"
      min={1}
      value={value}
      onChange={setThreshold}
      className="border border-gray-300 rounded px-3.5 py-4 text-center max-w-[32px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )
}

export default React.memo(ThresholdInput)
