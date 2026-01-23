import React from "react"
import { Asset } from "stellar-sdk"
import { useAssetMetadata } from "~Generic/hooks/stellar"
import LumenIcon from "~Icons/components/Lumen"

const paddedAssetIconsRegex = /bitbondsto\.com/

interface AssetLogoProps {
  asset: Asset
  className?: string
  dark?: boolean
  imageURL?: string
  style?: React.CSSProperties
}

function AssetLogo(props: AssetLogoProps) {
  const className = props.className || ""

  if (props.asset.isNative()) {
    return (
      <div
        className={`${className} w-12 h-12 rounded-full bg-white box-border text-black text-xs p-2 flex items-center justify-center`}
        style={props.style}
        role="img"
        aria-label="Stellar Lumens (XLM)"
      >
        <LumenIcon className="w-full h-full" />
      </div>
    )
  } else {
    const applyPadding = props.imageURL && props.imageURL.match(paddedAssetIconsRegex)
    const assetCode =
      props.asset.code.length < 5 ? props.asset.code : props.asset.code.substr(0, 2) + props.asset.code.substr(-2)
    const name = props.asset.code

    const avatarClasses = [
      className,
      "w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium",
      props.imageURL
        ? "bg-white"
        : props.dark
          ? "bg-brand-dark border border-brand-main15"
          : "bg-gradient-to-br from-brand-main via-brand-dark to-brand-main border border-white/66 text-white"
    ].join(" ")
    const iconClasses = applyPadding ? "w-3/4 h-3/4" : "w-full h-full"

    return (
      <div className={avatarClasses} style={props.style} role="img" aria-label={name}>
        {props.imageURL ? <img className={iconClasses} src={props.imageURL} alt={name} /> : assetCode}
      </div>
    )
  }
}

interface SuspendingAssetLogoProps {
  asset: Asset
  className?: string
  dark?: boolean
  style?: React.CSSProperties
  testnet: boolean
}

function SuspendingAssetLogo(props: SuspendingAssetLogoProps) {
  const metadata = useAssetMetadata(props.asset, props.testnet)
  return <AssetLogo {...props} imageURL={metadata ? metadata.image : undefined} />
}

function AssetLogoWithFallback(props: SuspendingAssetLogoProps) {
  return (
    <React.Suspense fallback={<AssetLogo {...props} />}>
      <SuspendingAssetLogo {...props} />
    </React.Suspense>
  )
}

export default React.memo(AssetLogoWithFallback)
