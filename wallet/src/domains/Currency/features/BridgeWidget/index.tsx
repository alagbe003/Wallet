import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Bridge } from 'src/uikit/Icon/Bridge'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { Progress } from './Progress'
import { Status } from './Status'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import { fetchBridgeRequestStatus } from 'src/domains/Currency/domains/Bridge/api/fetchBridgeRequestStatus'

type Props = {
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_bridge_submitted_click'; bridgeSubmitted: BridgeSubmitted }
    | { type: 'bridge_completed'; bridgeSubmitted: BridgeSubmitted }

export const BridgeWidget = ({ bridgeSubmitted, onMsg }: Props) => {
    const {
        knownCurrencies,
        route: { from, to },
    } = bridgeSubmitted

    const toCurrency = useCurrencyById(to.currencyId, knownCurrencies)
    const fromCurrency = useCurrencyById(from.currencyId, knownCurrencies)

    const useLiveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchBridgeRequestStatus,
        { type: 'loading', params: { request: bridgeSubmitted } },
        {
            pollIntervalMilliseconds: 10_000,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                        return false
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        switch (pollable.data.targetTransaction.type) {
                            case 'pending':
                            case 'not_started':
                                return false
                            case 'completed':
                                if (!bridgeSubmitted.route.refuel) {
                                    return true
                                }

                                if (!pollable.data.refuel) {
                                    return false
                                }

                                switch (pollable.data.refuel.type) {
                                    case 'pending':
                                    case 'not_started':
                                        return false
                                    case 'completed':
                                        return true
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(
                                            pollable.data.refuel.type
                                        )
                                }

                            /* istanbul ignore next */
                            default:
                                return notReachable(
                                    pollable.data.targetTransaction.type
                                )
                        }
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    const nowTimestampMs = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
                return
            case 'error':
                captureError(pollable.error)
                return
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                switch (pollable.data.targetTransaction.type) {
                    case 'pending':
                    case 'not_started':
                        return
                    case 'completed':
                        if (!bridgeSubmitted.route.refuel) {
                            useLiveMsg.current({
                                type: 'bridge_completed',
                                bridgeSubmitted,
                            })
                            return
                        }
                        if (!pollable.data.refuel) {
                            return
                        }

                        switch (pollable.data.refuel.type) {
                            case 'pending':
                            case 'not_started':
                                return
                            case 'completed':
                                useLiveMsg.current({
                                    type: 'bridge_completed',
                                    bridgeSubmitted,
                                })
                                return
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data.refuel.type)
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(
                            pollable.data.targetTransaction.type
                        )
                }
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [pollable, bridgeSubmitted, useLiveMsg])

    if (!fromCurrency || !toCurrency) {
        return null
    }

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                // TODO ListItem2 is not capable of fitting progress bar at the bottom, check with @haywired on best approach to this
                <div
                    role="button"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                        onMsg({
                            type: 'on_bridge_submitted_click',
                            bridgeSubmitted,
                        })
                    }
                >
                    <Group variant="default">
                        <Column2 spacing={12}>
                            <Row spacing={12}>
                                <Bridge size={32} color="iconDefault" />
                                <Column2 spacing={4}>
                                    <Text2
                                        variant="callout"
                                        weight="medium"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="bridge_rote.widget.title"
                                            defaultMessage="Bridge"
                                        />
                                    </Text2>

                                    <Row spacing={8}>
                                        <Text2
                                            variant="footnote"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="bridge.widget.currencies"
                                                defaultMessage="{from} to {to}"
                                                values={{
                                                    from: fromCurrency.symbol,
                                                    to: toCurrency.symbol,
                                                }}
                                            />
                                        </Text2>

                                        <Spacer2 />

                                        <Status
                                            bridgeSubmitted={bridgeSubmitted}
                                            bridgeSubmittedStatus={
                                                pollable.data
                                            }
                                            nowTimestampMs={nowTimestampMs}
                                        />
                                    </Row>
                                </Column2>
                            </Row>

                            <Progress
                                bridgeSubmitted={bridgeSubmitted}
                                bridgeSubmittedStatus={pollable.data}
                                nowTimestampMs={nowTimestampMs}
                            />
                        </Column2>
                    </Group>
                </div>
            )

        case 'loading':
        case 'error':
            return (
                <Group variant="default">
                    <Column2 spacing={12}>
                        <Row spacing={12}>
                            <Bridge size={32} color="iconDefault" />
                            <Column2 spacing={4}>
                                <Text2
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    <FormattedMessage
                                        id="bridge_rote.widget.title"
                                        defaultMessage="Bridge"
                                    />
                                </Text2>

                                <Row spacing={8}>
                                    <Text2
                                        variant="footnote"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="bridge.widget.currencies"
                                            defaultMessage="{from} to {to}"
                                            values={{
                                                from: fromCurrency.symbol,
                                                to: toCurrency.symbol,
                                            }}
                                        />
                                    </Text2>

                                    <Spacer2 />

                                    <Skeleton
                                        variant="default"
                                        width={55}
                                        height={15}
                                    />
                                </Row>
                            </Column2>
                        </Row>

                        <Skeleton variant="default" width="100%" height={8} />
                    </Column2>
                </Group>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
