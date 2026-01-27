import React from "react"
import { Asset } from "stellar-sdk"
import TextField, { TextFieldProps } from "./TextField"
import { BalanceLine } from "~Generic/lib/account"
import { balancelineToAsset, stringifyAsset } from "../lib/stellar"

// Styles converted to Tailwind - see className usage below

interface AssetItemProps {
  asset: Asset
  disabled?: boolean
  testnet: boolean
  // value prop is expected here from React/Material-ui validation mechanisms
  value: string
}

const AssetItem = React.memo(
  React.forwardRef(function AssetItem(props: AssetItemProps, ref: React.Ref<HTMLOptionElement>) {
    return (
      <option
        ref={ref}
        value={props.value}
        disabled={props.disabled}
      >
        {props.asset.getCode()}
      </option>
    )
  })
)

// Styles converted to Tailwind - see className usage below

interface AssetSelectorProps {
  autoFocus?: TextFieldProps["autoFocus"]
  assets: Array<Asset | BalanceLine>
  children?: React.ReactNode
  className?: string
  disabledAssets?: Asset[]
  disableUnderline?: boolean
  helperText?: TextFieldProps["helperText"]
  inputError?: string
  label?: TextFieldProps["label"]
  margin?: TextFieldProps["margin"]
  minWidth?: number | string
  name?: string
  onChange?: (asset: Asset) => void
  showXLM?: boolean
  style?: React.CSSProperties
  testnet: boolean
  value?: Asset
}

function AssetSelector(props: AssetSelectorProps) {
  const { onChange } = props

  const assets = React.useMemo(
    () => [
      Asset.native(),
      ...props.assets.map(asset =>
        "code" in asset && "issuer" in asset ? (asset as Asset) : balancelineToAsset(asset)
      )
    ],
    [props.assets]
  )

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<{ name?: any; value: any }>, child: React.ComponentElement<AssetItemProps, any>) => {
      const matchingAsset = assets.find(asset => asset.equals(child.props.asset))

      if (matchingAsset) {
        if (onChange) {
          onChange(matchingAsset)
        }
      } else {
        // tslint:disable-next-line no-console
        console.error(
          `Invariant violation: Trustline ${child.props.asset.getCode()} selected, but no matching asset found.`
        )
      }
    },
    [assets, onChange]
  )

  return (
    <TextField
      variant="standard"
      autoFocus={props.autoFocus}
      className={props.className}
      error={Boolean(props.inputError)}
      helperText={props.helperText}
      label={props.inputError ? props.inputError : props.label}
      margin={props.margin}
      onChange={handleChange as any}
      name={props.name}
      placeholder="Select an asset"
      select
      style={{ flexShrink: 0, ...props.style }}
      value={props.value ? props.value.getCode() : ""}
      FormHelperTextProps={{
        className: "max-w-[100px] whitespace-nowrap"
      }}
      InputProps={{
        className: "min-w-[72px]",
        style: {
          minWidth: props.minWidth
        }
      }}
      SelectProps={{
        className: `text-lg font-normal ${props.value ? "" : "opacity-50"}`,
        style: props.disableUnderline ? { borderBottom: "none" } : undefined
      }}
    >
      {props.value ? null : (
        <option disabled value="">
          Select an asset
        </option>
      )}
      {props.showXLM ? (
        <AssetItem
          asset={Asset.native()}
          disabled={props.disabledAssets && props.disabledAssets.some(someAsset => someAsset.isNative())}
          key={stringifyAsset(Asset.native())}
          testnet={props.testnet}
          value={Asset.native().getCode()}
        />
      ) : null}
      {assets
        .filter(asset => !asset.isNative())
        .map(asset => (
          <AssetItem
            asset={asset}
            disabled={props.disabledAssets && props.disabledAssets.some(someAsset => someAsset.equals(asset))}
            key={stringifyAsset(asset)}
            testnet={props.testnet}
            value={asset.getCode()}
          />
        ))}
    </TextField>
  )
}

export default React.memo(AssetSelector)
