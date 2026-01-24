import React from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Asset, Horizon, Operation, Transaction } from "stellar-sdk"
import TextField from "~Generic/components/TextField"
import { HiChevronDown, HiPaperAirplane } from "react-icons/hi2"
import { Account } from "~App/contexts/accounts"
import { trackError } from "~App/contexts/notifications"

// useMediaQuery replacement
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query, matches])
  return matches
}
import AssetSelector from "~Generic/components/AssetSelector"
import { ActionButton, DialogActionsBox } from "~Generic/components/DialogActions"
import { ReadOnlyTextfield } from "~Generic/components/FormFields"
import Portal from "~Generic/components/Portal"
import { useHorizon } from "~Generic/hooks/stellar"
import { useLiveOrderbook } from "~Generic/hooks/stellar-subscriptions"
import { RefStateObject, useIsMobile } from "~Generic/hooks/userinterface"
import { AccountData } from "~Generic/lib/account"
import { CustomError } from "~Generic/lib/errors"
import {
  balancelineToAsset,
  findMatchingBalanceLine,
  getAccountMinimumBalance,
  getSpendableBalance
} from "~Generic/lib/stellar"
import { FormBigNumber, isValidAmount } from "~Generic/lib/form"
import { createTransaction } from "~Generic/lib/transaction"
import { HorizontalLayout, VerticalLayout } from "~Layout/components/Box"
import { bigNumberToInputValue, TradingFormValues, useCalculation } from "../hooks/form"
import TradingPrice from "./TradingPrice"

// Styles converted to Tailwind - see className usage below

interface Props {
  account: Account
  accountData: AccountData
  className?: string
  dialogActionsRef: RefStateObject | null
  initialPrimaryAsset?: Asset
  primaryAction: "buy" | "sell"
  sendTransaction: (transaction: Transaction) => void
  style?: React.CSSProperties
  trustlines: Horizon.HorizonApi.BalanceLineAsset[]
}

function TradingForm(props: Props) {
  const isSmallScreen = useIsMobile()
  const isSmallHeightScreen = useMediaQuery("(max-height: 500px)")
  const isSmallScreenXY = isSmallScreen || isSmallHeightScreen
  const { t } = useTranslation()

  const [expanded, setExpanded] = React.useState(false)
  const [priceMode, setPriceMode] = React.useState<"primary" | "secondary">("secondary")
  const [pending, setPending] = React.useState(false)

  const form = useForm<TradingFormValues>({
    defaultValues: {
      primaryAsset: props.initialPrimaryAsset,
      primaryAmountString: "",
      secondaryAsset: Asset.native(),
      manualPrice: "0"
    }
  })

  const sendTransaction = props.sendTransaction
  const { primaryAsset, secondaryAsset, manualPrice } = form.watch()

  React.useEffect(() => {
    if (!primaryAsset && props.initialPrimaryAsset) {
      form.setValue("primaryAsset", props.initialPrimaryAsset)
    }
  }, [form, primaryAsset, props.initialPrimaryAsset])

  const horizon = useHorizon(props.account.testnet)
  const tradePair = useLiveOrderbook(primaryAsset || Asset.native(), secondaryAsset, props.account.testnet)

  const assets = React.useMemo(() => props.trustlines.map(balancelineToAsset), [props.trustlines])

  const calculation = useCalculation({
    accountData: props.accountData,
    priceMode,
    primaryAction: props.primaryAction,
    tradePair,
    values: form.getValues()
  })

  const {
    maxPrimaryAmount,
    primaryBalance,
    defaultPrice,
    effectivePrice,
    primaryAmount,
    relativeSpread,
    secondaryAmount,
    secondaryBalance,
    spendablePrimaryBalance,
    spendableSecondaryBalance
  } = calculation

  if (form.formState.touched.primaryAmountString) {
    // trigger delayed validation to make sure that primaryAmountString is validated with latest calculation results
    setTimeout(() => form.triggerValidation("primaryAmountString"), 0)
  }

  const setPrimaryAmountToMax = () => {
    form.setValue("primaryAmountString", maxPrimaryAmount.toFixed(7))
  }

  const validateManualPrice = React.useCallback(() => {
    const value = FormBigNumber(manualPrice).gt(0) ? manualPrice : defaultPrice
    const valid = isValidAmount(value) && FormBigNumber(value).gt(0)
    if (!valid) {
      if (!expanded) {
        setExpanded(true)
      }
      return t<string>("trading.validation.invalid-price")
    }
  }, [defaultPrice, expanded, manualPrice, t])

  const submitForm = React.useCallback(async () => {
    try {
      setPending(true)

      const error = validateManualPrice()
      if (error) {
        form.setError("manualPrice", "invalid-amount", error)
        return
      }

      if (!primaryAsset) {
        throw CustomError(
          "InvariantViolationError",
          "Invariant violation: Should not be able to submit form without having selected the primary asset.",
          { message: "Should not be able to submit form without having selected the primary asset." }
        )
      }

      const spendableXLMBalance = getSpendableBalance(
        getAccountMinimumBalance(props.accountData),
        findMatchingBalanceLine(props.accountData.balances, Asset.native())
      )
      if (spendableXLMBalance.minus(0.5).cmp(0) <= 0) {
        throw CustomError("LowReserveOrderError", "Cannot place order because spendable XLM balance is too low.")
      }

      const tx = await createTransaction(
        [
          props.primaryAction === "buy"
            ? Operation.manageBuyOffer({
                buyAmount: primaryAmount.toFixed(7),
                buying: primaryAsset,
                offerId: 0,
                price: effectivePrice.toFixed(7),
                selling: secondaryAsset
              })
            : Operation.manageSellOffer({
                amount: primaryAmount.toFixed(7),
                buying: secondaryAsset,
                offerId: 0,
                price: effectivePrice.toFixed(7),
                selling: primaryAsset
              })
        ],
        {
          accountData: props.accountData,
          horizon,
          walletAccount: props.account
        }
      )
      await sendTransaction(tx)
    } catch (error) {
      trackError(error)
    } finally {
      setPending(false)
    }
  }, [
    form,
    effectivePrice,
    horizon,
    primaryAsset,
    props.account,
    props.accountData,
    props.primaryAction,
    primaryAmount,
    secondaryAsset,
    sendTransaction,
    validateManualPrice
  ])

  return (
    // set minHeight to prevent wrapping of layout when keyboard is shown
    <VerticalLayout
      alignItems="stretch"
      alignSelf={isSmallScreenXY ? undefined : "center"}
      grow={1}
      minHeight={300}
      maxHeight="100%"
      margin={isSmallScreen ? undefined : "32px 0 0"}
      padding="16px 0"
      shrink={1}
      width="100%"
    >
      <VerticalLayout
        alignItems="stretch"
        alignSelf={isSmallScreen ? "stretch" : "center"}
        minWidth={isSmallScreen ? "75%" : 450}
        maxWidth={isSmallScreen ? "100%" : 500}
        padding="0 2px"
        shrink={0}
        width="100%"
      >
        <HorizontalLayout margin="8px 0">
          <Controller
            as={
              <AssetSelector
                assets={assets}
                inputError={form.errors.primaryAsset && form.errors.primaryAsset.message}
                label={
                  props.primaryAction === "buy"
                    ? t("trading.inputs.primary-asset-selector.label.buy")
                    : t("trading.inputs.primary-asset-selector.label.sell")
                }
                minWidth={75}
                showXLM
                style={{ flexGrow: 1, marginRight: 24, maxWidth: 150, width: "25%" }}
                testnet={props.account.testnet}
                value={primaryAsset}
              />
            }
            control={form.control}
            name="primaryAsset"
            rules={{
              required: t<string>("trading.validation.primary-asset-missing")
            }}
          />
          <TextField
            variant="standard"
            name="primaryAmountString"
            ref={form.register({
              required: t<string>("trading.validation.primary-amount-missing"),
              validate: value => {
                const amountInvalid = primaryAmount.lt(0) || (value.length > 0 && primaryAmount.eq(0))
                const exceedsBalance =
                  (props.primaryAction === "sell" && primaryBalance && primaryAmount.gt(spendablePrimaryBalance)) ||
                  (props.primaryAction === "buy" && secondaryBalance && secondaryAmount.gt(spendableSecondaryBalance))

                if (amountInvalid) {
                  return t<string>("trading.validation.invalid-amount")
                } else if (exceedsBalance) {
                  return t<string>("trading.validation.not-enough-balance")
                } else {
                  return true
                }
              }
            })}
            error={Boolean(form.errors.primaryAmountString)}
            inputProps={{
              pattern: "^[0-9]*(.[0-9]+)?$",
              inputMode: "decimal",
              min: "0.0000001",
              max: maxPrimaryAmount.toFixed(7),
              style: { height: 27 }
            }}
            InputProps={{
              endAdornment:
                props.primaryAction === "buy" ? (
                  undefined
                ) : (
                  <button
                    type="button"
                    disabled={!primaryAsset || !primaryBalance}
                    onClick={setPrimaryAmountToMax}
                    className="px-3 py-1.5 text-sm font-normal border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("trading.inputs.primary-amount.max-button.label")}
                  </button>
                )
            }}
            label={
              form.errors.primaryAmountString && form.errors.primaryAmountString.message
                ? form.errors.primaryAmountString.message
                : props.primaryAction === "buy"
                ? t("trading.inputs.primary-amount.label.buy")
                : t("trading.inputs.primary-amount.label.sell")
            }
            placeholder={t(
              "trading.inputs.primary-amount.placeholder",
              `Max. ${bigNumberToInputValue(maxPrimaryAmount)}`,
              {
                amount: bigNumberToInputValue(maxPrimaryAmount)
              }
            )}
            required
            style={{ flexGrow: 1, flexShrink: 1, width: "55%" }}
          />
        </HorizontalLayout>
        <HorizontalLayout margin="8px 0 32px">
          <Controller
            as={
              <AssetSelector
                assets={assets}
                label={
                  props.primaryAction === "buy"
                    ? t("trading.inputs.secondary-asset-selector.label.buy")
                    : t("trading.inputs.secondary-asset-selector.label.sell")
                }
                minWidth={75}
                showXLM
                style={{ flexGrow: 1, marginRight: 24, maxWidth: 150, width: "25%" }}
                testnet={props.account.testnet}
                value={secondaryAsset}
              />
            }
            control={form.control}
            name="secondaryAsset"
            rules={{ required: t<string>("trading.validation.secondary-asset-missing") }}
          />
          <ReadOnlyTextfield
            disableUnderline
            inputProps={{
              style: { height: 27 }
            }}
            label={
              props.primaryAction === "buy"
                ? t("trading.inputs.estimated-costs.label.buy")
                : t("trading.inputs.estimated-costs.label.sell")
            }
            placeholder={`Max. ${secondaryBalance ? secondaryBalance.balance : "0"}`}
            style={{ flexGrow: 1, flexShrink: 1, width: "55%" }}
            inputMode="decimal"
            type="number"
            value={
              // Format amount without thousands grouping, since it may lead to illegal number input values (#831)
              bigNumberToInputValue(secondaryAmount, { groupThousands: false })
            }
          />
        </HorizontalLayout>
        <div className="bg-transparent my-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between min-h-[48px] p-0"
          >
            <p className="text-center flex-1 text-base">{t("trading.advanced.header")}</p>
            <HiChevronDown className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="flex justify-start pl-0 pr-0 pt-3">
            <Controller
              as={
                <TradingPrice
                  defaultPrice={!form.formState.touched.manualPrice ? defaultPrice : undefined}
                  inputError={form.errors.manualPrice && form.errors.manualPrice.message}
                  onSetPriceDenotedIn={setPriceMode}
                  priceDenotedIn={priceMode}
                  primaryAsset={primaryAsset}
                  secondaryAsset={secondaryAsset}
                  selectOnFocus
                  style={{ flexGrow: 1, maxWidth: 250, width: "55%" }}
                />
              }
              control={form.control}
              name="manualPrice"
              rules={{
                validate: value => {
                  const valid = isValidAmount(value)
                  return valid || t<string>("trading.validation.invalid-price")
                }
              }}
              valueName="manualPrice"
            />
            </div>
          )}
        </div>
        {relativeSpread >= 0.015 ? (
          <div className="my-8 px-3 py-2 bg-warning rounded">
            <b>{t("trading.warning.title")}</b>
            <br />
            {t(
              "trading.warning.message",
              `The spread between buying and selling price is about ${(relativeSpread * 100).toFixed(1)}%.`,
              { spread: (relativeSpread * 100).toFixed(1) }
            )}
          </div>
        ) : null}
        <Portal target={props.dialogActionsRef?.element}>
          <DialogActionsBox desktopStyle={{ marginTop: 32 }}>
            <ActionButton loading={pending} icon={<HiPaperAirplane className="w-5 h-5" />} onClick={form.handleSubmit(submitForm)} type="primary">
              {t("trading.action.submit")}
            </ActionButton>
          </DialogActionsBox>
        </Portal>
      </VerticalLayout>
    </VerticalLayout>
  )
}

export default React.memo(TradingForm)
