import React from "react"
import { animated, useSpring } from "react-spring"
import { useDrag } from "react-use-gesture"
import { Asset, Horizon } from "stellar-sdk"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { stringifyAsset } from "~Generic/lib/stellar"
// breakpoints removed - using Tailwind responsive classes
import InlineLoader from "~Generic/components/InlineLoader"
import { BalanceLine } from "~Generic/lib/account"
import { sortBalances } from "~Generic/lib/balances"
import ScrollableBalanceItem, { getBalanceItemMinMaxWidth } from "./ScrollableBalanceItem"

function isAssetMatchingBalance(asset: Asset, balance: BalanceLine): boolean {
  if (balance.asset_type === "liquidity_pool_shares") {
    return false
  }

  return balance.asset_type === "native"
    ? asset.isNative()
    : !asset.isNative() && balance.asset_code === asset.getCode() && balance.asset_issuer === asset.getIssuer()
}

// Styles converted to Tailwind - see className usage below

interface ScrollableBalancesProps {
  account: Account
  compact?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

function ScrollableBalances(props: ScrollableBalancesProps) {
  const { onClick } = props
  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const balanceItemsRef = React.useRef<Map<number, HTMLElement | null>>(new Map())
  const latestStepRef = React.useRef(0)
  const mouseState = React.useRef({ currentlyDragging: false, latestMouseMoveEndTime: 0 })
  const swipeableContainerRef = React.useRef<HTMLDivElement | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [spring, setSpring] = useSpring(() => ({ x: 0 }))

  const nativeBalance: Horizon.HorizonApi.BalanceLineNative = accountData.balances.find(
    (balance): balance is Horizon.HorizonApi.BalanceLineNative => balance.asset_type === "native"
  ) || {
    asset_type: "native",
    balance: "0",
    buying_liabilities: "0",
    selling_liabilities: "0"
  }

  const isAccountActivated = Number.parseFloat(nativeBalance.balance) > 0

  const trustedAssets = sortBalances(accountData.balances)
    .filter((balance): balance is Horizon.HorizonApi.BalanceLineAsset => balance.asset_type !== "native")
    .map(balance => new Asset(balance.asset_code, balance.asset_issuer))

  const balancesPerStep = Math.max(Math.floor((window.innerWidth - 32 - 32) / getBalanceItemMinMaxWidth()[1]), 2)
  const stepCount = Math.ceil(accountData.balances.length / balancesPerStep)

  const getStepX = (step: number) => {
    step = Math.min(Math.max(step, 0), stepCount - 1)
    const balanceIndex = step * balancesPerStep

    if (step === 0) {
      // first step - need to check first as for a single step the last-step check would be true
      return 0
    } else if (step === stepCount - 1 && swipeableContainerRef.current) {
      // last step - make it align to the right
      return -(swipeableContainerRef.current.scrollWidth - swipeableContainerRef.current.clientWidth + 8)
    } else if (step > 0 && balanceItemsRef.current.has(balanceIndex)) {
      return -balanceItemsRef.current.get(balanceIndex)!.offsetLeft + (step > 0 ? 32 : 0)
    }
    return 0
  }

  const scrollTo = (newStep: number) => {
    latestStepRef.current = newStep
    setCurrentStep(newStep)
    setSpring({ x: getStepX(newStep) })
  }
  const scrollLeft = () => scrollTo(Math.max(latestStepRef.current - 1, 0))
  const scrollRight = () => scrollTo(Math.min(latestStepRef.current + 1, stepCount - 1))

  const bind = useDrag(({ cancel, delta, direction, distance, down }) => {
    const lastXBeforeGesture = getStepX(latestStepRef.current)

    if (down && Math.abs(delta[0]) > 50) {
      mouseState.current.currentlyDragging = false
      direction[0] < 0 ? scrollRight() : scrollLeft()
      cancel!()
    } else {
      mouseState.current.currentlyDragging = true
      setSpring({ x: down ? lastXBeforeGesture + delta[0] : lastXBeforeGesture })
    }

    if (distance > 5) {
      mouseState.current.latestMouseMoveEndTime = Date.now()
    }
  })

  const handleClick = React.useCallback(() => {
    const mouseDragJustHappened = Date.now() - mouseState.current.latestMouseMoveEndTime < 100

    if (onClick && !mouseDragJustHappened) {
      onClick()
    }
  }, [onClick])

  const canScrollLeft = currentStep > 0
  const canScrollRight = currentStep < stepCount - 1

  const className = [
    "mx-2 overflow-x-hidden",
    canScrollLeft || canScrollRight
      ? "mask-gradient"
      : "",
    canScrollLeft && canScrollRight
      ? "mask-gradient-both"
      : canScrollLeft
      ? "mask-gradient-left"
      : canScrollRight
      ? "mask-gradient-right"
      : ""
  ]
    .filter(Boolean)
    .join(" ")

  const balanceItems = React.useMemo(
    () => [
      ...trustedAssets.map((asset, index) => (
        <ScrollableBalanceItem
          key={stringifyAsset(asset)}
          ref={domElement => (domElement ? balanceItemsRef.current.set(index, domElement) : undefined)}
          balance={accountData.balances.find(balance => isAssetMatchingBalance(asset, balance))!}
          compact={props.compact}
          onClick={props.onClick && isAccountActivated ? handleClick : undefined}
          testnet={props.account.testnet}
        />
      )),
      <ScrollableBalanceItem
        key={stringifyAsset(Asset.native())}
        ref={domElement =>
          domElement ? balanceItemsRef.current.set(accountData.balances.length - 1, domElement) : undefined
        }
        balance={nativeBalance}
        compact={props.compact}
        onClick={props.onClick && isAccountActivated ? handleClick : undefined}
        testnet={props.account.testnet}
      />
    ],
    [
      accountData.balances,
      handleClick,
      isAccountActivated,
      nativeBalance,
      props.account.testnet,
      props.compact,
      props.onClick,
      trustedAssets
    ]
  )

  return (
    <div className="-mx-[10px] sm:-mx-6 relative" style={props.style}>
      <div className={className}>
        <animated.div
          {...bind()}
          className="flex"
          ref={swipeableContainerRef}
          style={{ transform: spring.x.interpolate(xi => `translate3d(${xi}px, 0, 0)`) }}
        >
          {balanceItems}
        </animated.div>
      </div>
      <button
        className={`absolute top-1/2 -mt-[22px] p-0.5 w-10 h-10 sm:w-9 sm:h-9 sm:mt-[22px] sm:p-1 bg-black/5 hover:bg-black/12 active:bg-black/8 left-1.5 sm:left-3 rounded-full flex items-center justify-center transition-colors ${
          !canScrollLeft ? "hidden" : ""
        }`}
        onClick={scrollLeft}
        type="button"
      >
        <HiChevronLeft className="text-white text-[40px] sm:text-[36px]" />
      </button>
      <button
        className={`absolute top-1/2 -mt-[22px] p-0.5 w-10 h-10 sm:w-9 sm:h-9 sm:mt-[22px] sm:p-1 bg-black/5 hover:bg-black/12 active:bg-black/8 right-1.5 sm:right-3 rounded-full flex items-center justify-center transition-colors ${
          !canScrollRight ? "hidden" : ""
        }`}
        onClick={scrollRight}
        type="button"
      >
        <HiChevronRight className="text-white text-[40px] sm:text-[36px]" />
      </button>
    </div>
  )
}

function ScrollableBalancesWithFallback(props: ScrollableBalancesProps) {
  return (
    <React.Suspense fallback={<InlineLoader />}>
      <ScrollableBalances {...props} />
    </React.Suspense>
  )
}

export default React.memo(ScrollableBalancesWithFallback)
