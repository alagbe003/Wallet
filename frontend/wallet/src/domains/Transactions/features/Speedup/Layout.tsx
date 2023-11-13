import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import {
    NotEnoughBalance,
    validateNotEnoughBalance,
} from 'src/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { ForecastTime } from 'src/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { calculate } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/calculate'
import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { Button } from 'src/uikit'
import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Rocket } from 'src/uikit/Icon/Rocket'
import { Popup } from 'src/uikit/Popup'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'
import { Text2 } from 'src/uikit/Text2'

type LoadedPollable = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

type Props = {
    transactionRequest: SubmitedQueued
    pollingInterval: number
    pollable: LoadedPollable
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'confirm_speed_up_click'; newFee: EstimatedFee }
    | {
          type: 'on_reload_click'
          params: FeeForecastRequest
          data: FeeForecastResponse
      }

export const Layout = ({
    pollable,
    pollingInterval,
    transactionRequest,
    onMsg,
}: Props) => {
    const oldFee = transactionRequest.selectedFee
    const newFee = calculate(oldFee, pollable.data.fast)
    const currencies = pollable.data.currencies

    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)
    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [pollable])

    const validation = validateNotEnoughBalance({
        pollable,
        transactionRequest: transactionRequest.rpcRequest,
    }).getFailureReason()

    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => <Rocket size={size} color={color} />}
                title={
                    <FormattedMessage
                        id="transaction.speed_up_popup.title"
                        defaultMessage="Speed up transaction?"
                    />
                }
            />
            <Column2 spacing={12}>
                <Text2
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {(() => {
                        switch (oldFee.type) {
                            case 'LegacyCustomPresetRequestFee':
                            case 'Eip1559CustomPresetRequestFee':
                                return (
                                    <FormattedMessage
                                        id="transaction.speed_up_popup.description_without_original"
                                        defaultMessage="To speed up, you need to pay a new network fee"
                                    />
                                )
                            case 'LegacyFee':
                            case 'Eip1559Fee':
                                return (
                                    <FormattedMessage
                                        id="transaction.speed_up_popup.description"
                                        defaultMessage="To speed up, you need to pay a new network fee instead of the original fee of {amount}"
                                        values={{
                                            amount: (
                                                <FormattedFee
                                                    fee={oldFee}
                                                    knownCurrencies={currencies}
                                                />
                                            ),
                                        }}
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(oldFee)
                        }
                    })()}
                </Text2>

                <FeeInputButton
                    errored={!!validation}
                    disabled
                    left={
                        <>
                            <Text2
                                ellipsis
                                variant="paragraph"
                                weight="regular"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="FeeForecastWiget.networkFee"
                                    defaultMessage="Network fee"
                                />
                            </Text2>
                            <ProgressSpinner
                                key={pollingStartedAt}
                                size={20}
                                durationMs={pollingInterval}
                            />
                        </>
                    }
                    right={
                        <>
                            <ForecastTime
                                selectedPreset={{ type: 'Fast' }}
                                errored
                                forecastDuration={newFee.forecastDuration}
                            />
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textPrimary"
                            >
                                <FormattedFee
                                    knownCurrencies={currencies}
                                    fee={newFee}
                                />
                            </Text2>
                        </>
                    }
                    message={(() => {
                        if (validation) {
                            return <ErrorMessage error={validation} />
                        }

                        switch (pollable.type) {
                            case 'loaded':
                            case 'reloading':
                                return null

                            case 'subsequent_failed':
                                return (
                                    <FormattedMessage
                                        id="FeeForecastWiget.subsequent_failed.message"
                                        defaultMessage="Estimates might be old, last refresh failed"
                                    />
                                )

                            default:
                                return notReachable(pollable)
                        }
                    })()}
                    ctaButton={(() => {
                        if (validation) {
                            return null
                        }

                        switch (pollable.type) {
                            case 'loaded':
                            case 'reloading':
                                return null

                            case 'subsequent_failed':
                                return (
                                    <Tertiary
                                        size="small"
                                        color="on_light"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_reload_click',
                                                data: pollable.data,
                                                params: pollable.params,
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="action.retry"
                                            defaultMessage="Retry"
                                        />
                                    </Tertiary>
                                )

                            default:
                                return notReachable(pollable)
                        }
                    })()}
                />
            </Column2>
            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="transaction.speed_up_popup.cancel"
                        defaultMessage="No, wait"
                    />
                </Button>

                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({ type: 'confirm_speed_up_click', newFee })
                    }
                >
                    <FormattedMessage
                        id="transaction.speed_up_popup.confirm"
                        defaultMessage="Yes, speed up"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}

const ErrorMessage = ({ error }: { error: NotEnoughBalance }) => {
    switch (error.type) {
        case 'not_enough_balance':
            const { currencies } = error.pollable.data
            const nativeCurrency = currencies[error.requiredAmount.currencyId]

            return (
                <FormattedMessage
                    id="FeeForecastWiget.NotEnoughBalance.errorMessage"
                    defaultMessage="Need {amount} {symbol} to submit transaction"
                    values={{
                        amount: (
                            <FormattedTokenBalances
                                knownCurrencies={currencies}
                                money={error.requiredAmount}
                            />
                        ),
                        symbol: nativeCurrency.symbol,
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
