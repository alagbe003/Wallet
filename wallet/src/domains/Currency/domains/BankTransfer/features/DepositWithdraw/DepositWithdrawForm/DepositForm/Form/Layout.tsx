import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar as CurrencyAvatar } from 'src/domains/Currency/components/Avatar'
import {
    KycStatus,
    OffRampAccount,
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { getCryptoAmountInDefaultCurrency } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getCryptoAmountInDefaultCurrency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedFeeInDefaultCurrencyWhichCanBeZero } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrencyWhichCanBeZero'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from '@zeal/domains/Money/components/FormattedTokenBalances'
import { sub } from '@zeal/domains/Money/helpers/sub'
import { Network } from '@zeal/domains/Network'
import { FancyButton as NetworkFancyButton } from 'src/domains/Network/components/FancyButton'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { noop, notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { AmountInput2 } from 'src/uikit/Input/AmountInput2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { LimitBanner } from '@zeal/uikit/LimitBanner'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { TabHeader } from '@zeal/uikit/TabHeader'
import { Text2 } from 'src/uikit/Text2'
import {
    BannerError,
    DepositPollable,
    FormErrors,
    validateBeforeSubmit,
    validateOnSubmit,
} from './validation'
import { NextStepSeparator } from 'src/uikit/NextStepSeparator'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'

type Props = {
    pollable: DepositPollable
    currencies: BankTransferCurrencies
    unblockUser: UnblockUser
    portfolioMap: PortfolioMap
    keyStoreMap: KeyStoreMap
    account: Account
    offRampAccounts: OffRampAccount[]
    onRampTransactions: OnRampTransaction[]
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_withdraw_tab_click' }
    | { type: 'on_currency_selector_click' }
    | { type: 'on_fee_info_click' }
    | { type: 'on_time_info_click' }
    | { type: 'on_submit_form_click'; form: OnRampFeeParams }
    | { type: 'on_kyc_banner_click' }

const getDefaultCryptoCurrencyBalance = (
    portfolioMap: PortfolioMap,
    account: Account,
    defaultCryptoCurrency: CryptoCurrency
): Money => {
    const portfolio = portfolioMap[account.address]
    const token = portfolio.tokens.find(
        (t) => t.balance.currencyId === defaultCryptoCurrency.id
    )

    return (
        token?.balance || {
            currencyId: defaultCryptoCurrency.id,
            amount: BigInt(0),
        }
    )
}

const getCryptoAmount = (
    pollable: DepositPollable,
    knownCurrencies: KnownCurrencies
): { grossAmount: Money | null; netAmount: Money | null } => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            const grossAmount = applyRate(
                {
                    amount: amountToBigint(
                        pollable.params.form.amount,
                        pollable.params.form.inputCurrency.fraction
                    ),
                    currencyId: pollable.params.form.inputCurrency.id,
                },
                pollable.data.rate,
                knownCurrencies
            )

            const feeAmount = applyRate(
                pollable.data.fee.amount,
                {
                    rate: amountToBigint(
                        '1',
                        knownCurrencies[grossAmount.currencyId].rateFraction
                    ),
                    base: pollable.data.fee.amount.currencyId,
                    quote: grossAmount.currencyId,
                },
                knownCurrencies
            )

            const netAmount = sub(grossAmount, feeAmount)

            return { grossAmount, netAmount }

        case 'loading':
        case 'error':
            return { grossAmount: null, netAmount: null }
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

export const Layout = ({
    currencies,
    pollable,
    network,
    account,
    keyStoreMap,
    unblockUser,
    onRampTransactions,
    onMsg,
    portfolioMap,
}: Props) => {
    const [submitAttempted, setSubmitAttempted] = useState<boolean>(false)
    const { formatMessage } = useIntl()
    const formatTokenBalance = useFormatTokenBalance()

    const { amount, inputCurrency, outputCurrency } = pollable.params.form
    const { defaultCryptoCurrency, knownCurrencies } = currencies

    const result = submitAttempted
        ? validateOnSubmit(
              pollable,
              unblockUser,
              onRampTransactions,
              knownCurrencies
          )
        : validateBeforeSubmit(
              pollable,
              unblockUser,
              onRampTransactions,
              knownCurrencies
          )

    const errors = result.getFailureReason() || {}

    // TODO: fee has been deducted. With the rounding in the UI, the numbers are a bit off
    const { grossAmount, netAmount } = getCryptoAmount(
        pollable,
        knownCurrencies
    )

    const formattedCrypto = netAmount
        ? formatTokenBalance({
              money: netAmount,
              knownCurrencies,
          })
        : null

    const cryptoBalance = getDefaultCryptoCurrencyBalance(
        portfolioMap,
        account,
        defaultCryptoCurrency
    )

    return (
        <form
            style={{ width: '100%', height: '100%', display: 'flex' }}
            onSubmit={(e) => {
                e.preventDefault()
                setSubmitAttempted(true)
                const result = validateOnSubmit(
                    pollable,
                    unblockUser,
                    onRampTransactions,
                    knownCurrencies
                )

                switch (result.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        onMsg({
                            type: 'on_submit_form_click',
                            form: result.data,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(result)
                }
            }}
        >
            <Layout2 padding="form" background="light">
                <ActionBar
                    network={network}
                    account={account}
                    keystore={getKeyStore({
                        keyStoreMap,
                        address: account.address,
                    })}
                    right={
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <CloseCross size={24} />
                        </IconButton>
                    }
                />
                <Column2 spacing={16} style={{ flex: '1' }}>
                    <Row spacing={12}>
                        <TabHeader selected>
                            <FormattedMessage
                                id="bank_transfers.deposit.deposit-header"
                                defaultMessage="Deposit"
                            />
                        </TabHeader>
                        <TabHeader
                            selected={false}
                            onClick={() =>
                                onMsg({ type: 'on_withdraw_tab_click' })
                            }
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.withdraw-header"
                                defaultMessage="Withdraw"
                            />
                        </TabHeader>
                    </Row>
                    <Column2 spacing={12} style={{ flex: '1' }}>
                        <Column2 spacing={4}>
                            <AmountInput2
                                state={errors.input ? 'error' : 'normal'}
                                content={{
                                    topLeft: (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_currency_selector_click',
                                                })
                                            }}
                                        >
                                            <Row shrink={false} spacing={4}>
                                                <CurrencyAvatar
                                                    key={inputCurrency.id}
                                                    currency={inputCurrency}
                                                    size={24}
                                                    rightBadge={() => null}
                                                />
                                                <Text2
                                                    variant="title3"
                                                    color="textPrimary"
                                                    weight="medium"
                                                >
                                                    {inputCurrency.code}
                                                </Text2>
                                                <LightArrowDown2
                                                    size={18}
                                                    color="iconDefault"
                                                />
                                            </Row>
                                        </IconButton>
                                    ),
                                    topRight: (
                                        <AmountInput2.Input
                                            label={formatMessage({
                                                id: 'bank_transfers.deposit.amount-input',
                                                defaultMessage:
                                                    'Amount to deposit',
                                            })}
                                            amount={amount}
                                            fraction={inputCurrency.fraction}
                                            onChange={(amount) =>
                                                onMsg({
                                                    type: 'on_amount_change',
                                                    amount: amount,
                                                })
                                            }
                                            autoFocus
                                            prefix={inputCurrency.symbol}
                                        />
                                    ),
                                    bottomRight: (() => {
                                        switch (pollable.type) {
                                            case 'loading':
                                            case 'reloading':
                                                return (
                                                    <Skeleton
                                                        variant="default"
                                                        width={40}
                                                        height={16}
                                                    />
                                                )
                                            case 'loaded':
                                            case 'subsequent_failed':
                                                return grossAmount ? (
                                                    <Text2
                                                        variant="footnote"
                                                        color="textSecondary"
                                                        weight="regular"
                                                    >
                                                        <FormattedTokenBalanceInDefaultCurrency
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            money={getCryptoAmountInDefaultCurrency(
                                                                grossAmount,
                                                                knownCurrencies
                                                            )}
                                                        />
                                                    </Text2>
                                                ) : null
                                            case 'error':
                                                return null
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(pollable)
                                        }
                                    })(),
                                }}
                            />

                            <NextStepSeparator />

                            <AmountInput2
                                state={(() => {
                                    switch (pollable.type) {
                                        case 'error':
                                            return 'error'
                                        case 'loaded':
                                        case 'reloading':
                                        case 'subsequent_failed':
                                        case 'loading':
                                            return 'normal'
                                        default:
                                            return notReachable(pollable)
                                    }
                                })()}
                                top={
                                    <NetworkFancyButton
                                        rounded={false}
                                        network={network}
                                        onClick={null}
                                    />
                                }
                                content={{
                                    topLeft: (
                                        <Row spacing={4}>
                                            <CurrencyAvatar
                                                key={outputCurrency.id}
                                                currency={outputCurrency}
                                                size={24}
                                                rightBadge={() => null}
                                            />
                                            <Text2
                                                variant="title3"
                                                color="textPrimary"
                                                weight="medium"
                                            >
                                                {outputCurrency.code}
                                            </Text2>
                                        </Row>
                                    ),
                                    topRight: (() => {
                                        switch (pollable.type) {
                                            case 'loading':
                                            case 'reloading':
                                                return (
                                                    <AmountInput2.InputSkeleton />
                                                )
                                            case 'loaded':
                                            case 'subsequent_failed':
                                                return (
                                                    <AmountInput2.Input
                                                        label={formatMessage({
                                                            id: 'bank_transfers.deposit.amount-output',
                                                            defaultMessage:
                                                                'Destination amount',
                                                        })}
                                                        amount={formattedCrypto}
                                                        fraction={
                                                            outputCurrency.fraction ??
                                                            0
                                                        }
                                                        onChange={noop}
                                                        prefix=""
                                                        readOnly
                                                    />
                                                )
                                            case 'error':
                                                return (
                                                    <Column2
                                                        spacing={0}
                                                        alignX="end"
                                                    >
                                                        <Text2
                                                            variant="title3"
                                                            color="textDisabled"
                                                            weight="regular"
                                                        >
                                                            <FormattedMessage
                                                                id="bank_transfers.deposit.amount-output.error"
                                                                defaultMessage="error"
                                                            />
                                                        </Text2>
                                                    </Column2>
                                                )
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(pollable)
                                        }
                                    })(),
                                    bottomRight: (() => {
                                        switch (pollable.type) {
                                            case 'loading':
                                            case 'reloading':
                                                return (
                                                    <Skeleton
                                                        variant="default"
                                                        width={40}
                                                        height={16}
                                                    />
                                                )
                                            case 'loaded':
                                            case 'subsequent_failed':
                                                return netAmount ? (
                                                    <Text2
                                                        variant="footnote"
                                                        color="textSecondary"
                                                        weight="regular"
                                                    >
                                                        <FormattedTokenBalanceInDefaultCurrency
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            money={getCryptoAmountInDefaultCurrency(
                                                                netAmount,
                                                                knownCurrencies
                                                            )}
                                                        />
                                                    </Text2>
                                                ) : null
                                            case 'error':
                                                return null
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(pollable)
                                        }
                                    })(),
                                    bottomLeft: (
                                        <Text2
                                            color="textSecondary"
                                            variant="paragraph"
                                        >
                                            <FormattedMessage
                                                id="bank_transfers.deposit.default-token.balance"
                                                defaultMessage="Balance {amount}"
                                                values={{
                                                    amount: (
                                                        <FormattedTokenBalances
                                                            money={
                                                                cryptoBalance
                                                            }
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text2>
                                    ),
                                }}
                            />
                        </Column2>

                        <Spacer2 />

                        <Group variant="default">
                            <Column2 spacing={6}>
                                <Row spacing={3}>
                                    <Text2
                                        variant="paragraph"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="bank_transfers.deposit.fees"
                                            defaultMessage="Fees"
                                        />
                                    </Text2>
                                    <IconButton
                                        onClick={() =>
                                            onMsg({ type: 'on_fee_info_click' })
                                        }
                                    >
                                        <InfoCircle size={14} />
                                    </IconButton>

                                    <Spacer2 />

                                    <Fees
                                        pollable={pollable}
                                        knownCurrencies={knownCurrencies}
                                    />
                                </Row>
                                <Row spacing={3}>
                                    <Text2
                                        variant="paragraph"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="bank_transfers.deposit.time"
                                            defaultMessage="Time"
                                        />
                                    </Text2>
                                    <IconButton
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_time_info_click',
                                            })
                                        }
                                    >
                                        <InfoCircle size={14} />
                                    </IconButton>
                                    <Spacer2 />
                                    <Text2
                                        variant="paragraph"
                                        color="textPrimary"
                                    >
                                        1 min
                                    </Text2>
                                </Row>
                            </Column2>
                        </Group>

                        {errors.banner ? (
                            <ErrorBanner
                                error={errors.banner}
                                kycStatus={unblockUser.kycStatus}
                                knownCurrencies={knownCurrencies}
                                onClick={() =>
                                    onMsg({ type: 'on_kyc_banner_click' })
                                }
                            />
                        ) : (
                            <KycVerificationBanner
                                kycStatus={unblockUser.kycStatus}
                                knownCurrencies={knownCurrencies}
                                onClick={() =>
                                    onMsg({ type: 'on_kyc_banner_click' })
                                }
                            />
                        )}

                        <Button
                            size="regular"
                            variant="primary"
                            type="submit"
                            disabled={!!errors.submit}
                        >
                            {errors.submit ? (
                                <SubmitButtonErrorText
                                    error={errors.submit}
                                    knownCurrencies={knownCurrencies}
                                />
                            ) : (
                                <FormattedMessage
                                    id="bank_transfers.deposit.continue"
                                    defaultMessage="Continue"
                                />
                            )}
                        </Button>
                    </Column2>
                </Column2>
            </Layout2>
        </form>
    )
}

const SubmitButtonErrorText = ({
    error,
    knownCurrencies,
}: {
    error: NonNullable<FormErrors['submit']>
    knownCurrencies: KnownCurrencies
}) => {
    switch (error.type) {
        case 'pre_kyc_limit_reached':
        case 'post_kyc_limit_reached':
        case 'pollable_loading':
        case 'trial_limit_reached':
        case 'kyc_in_progress':
        case 'kyc_paused':
        case 'kyc_failed':
        case 'amount_is_zero':
            return (
                <FormattedMessage
                    id="bank_transfers.deposit.continue"
                    defaultMessage="Continue"
                />
            )
        case 'minimum_amount':
            return (
                <FormattedMessage
                    id="bank_transfers.deposit.increase-amount"
                    defaultMessage="Minimum transfer is {limit}"
                    values={{
                        limit: (
                            <FormattedFiatCurrency
                                knownCurrencies={knownCurrencies}
                                money={error.limit}
                                minimumFractionDigits={0}
                            />
                        ),
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const ErrorBanner = ({
    error,
    kycStatus,
    knownCurrencies,
    onClick,
}: {
    error: BannerError
    kycStatus: KycStatus
    knownCurrencies: KnownCurrencies
    onClick: () => void
}) => {
    switch (error.type) {
        case 'kyc_in_progress':
            return (
                <LimitBanner
                    variant="neutral"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verifying-identity"
                            defaultMessage="Verifying identity"
                        />
                    }
                />
            )
        case 'kyc_paused':
            return (
                <LimitBanner
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-paused"
                            defaultMessage="Verification paused"
                        />
                    }
                />
            )
        case 'kyc_failed':
            return (
                <LimitBanner
                    variant="critical"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-failed"
                            defaultMessage="Verification failed"
                        />
                    }
                />
            )
        case 'pre_kyc_limit_reached':
            return (
                <LimitBanner
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.trial-max-limit"
                            defaultMessage="You can do 1 deposit up to {limit}"
                            values={{
                                limit: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        knownCurrencies={knownCurrencies}
                                        money={
                                            PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                                        }
                                    />
                                ),
                            }}
                        />
                    }
                />
            )
        case 'post_kyc_limit_reached':
            return (
                <LimitBanner
                    variant="warning"
                    onClick={null}
                    icon={({ size }) => <BoldDangerTriangle size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.max-limit-reached"
                            defaultMessage="Amount exceeds max transfer limit"
                        />
                    }
                />
            )
        case 'trial_limit_reached':
            return (
                <LimitBanner
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.trial-limit-reached"
                            defaultMessage="Trial limit reached. Verify your ID"
                        />
                    }
                />
            )
        case 'pollable_loading': {
            return (
                <KycVerificationBanner
                    kycStatus={kycStatus}
                    onClick={onClick}
                    knownCurrencies={knownCurrencies}
                />
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const KycVerificationBanner = ({
    onClick,
    knownCurrencies,
    kycStatus,
}: {
    onClick: () => void
    knownCurrencies: KnownCurrencies
    kycStatus: KycStatus
}) => {
    switch (kycStatus.type) {
        case 'approved':
            return null
        case 'paused':
            return (
                <LimitBanner
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-paused"
                            defaultMessage="Verification paused"
                        />
                    }
                />
            )
        case 'failed':
            return (
                <LimitBanner
                    variant="critical"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-failed"
                            defaultMessage="Verification failed"
                        />
                    }
                />
            )
        case 'in_progress':
            return (
                <LimitBanner
                    variant="neutral"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verifying-identity"
                            defaultMessage="Verifying identity"
                        />
                    }
                />
            )
        case 'not_started':
            return (
                <LimitBanner
                    variant="default"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.limit-info"
                            defaultMessage="You can do 1 deposit up to {limit}"
                            values={{
                                limit: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        knownCurrencies={knownCurrencies}
                                        money={
                                            PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                                        }
                                    />
                                ),
                            }}
                        />
                    }
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }
}

const Fees = ({
    pollable,
    knownCurrencies,
}: {
    pollable: DepositPollable
    knownCurrencies: KnownCurrencies
}) => {
    const { formatNumber } = useIntl()

    switch (pollable.type) {
        case 'loading':
        case 'reloading':
            return <Skeleton variant="default" width={40} height={16} />
        case 'loaded':
        case 'subsequent_failed': {
            const percentage = formatNumber(pollable.data.fee.percentageFee, {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            })

            return (
                <Row spacing={4}>
                    <Text2 variant="paragraph" color="textSecondary">
                        {percentage}
                    </Text2>
                    <Text2 variant="paragraph" color="textPrimary">
                        <FormattedFeeInDefaultCurrencyWhichCanBeZero
                            knownCurrencies={knownCurrencies}
                            money={pollable.data.fee.amount}
                        />
                    </Text2>
                </Row>
            )
        }
        case 'error':
            return (
                <Text2
                    variant="paragraph"
                    color="textStatusCriticalOnColor"
                    weight="regular"
                >
                    <FormattedMessage
                        id="bank_transfers.deposit.failed_to_load_fee"
                        defaultMessage="Unknown"
                    />
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
