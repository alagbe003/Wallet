import { FormattedMessage, useIntl } from 'react-intl'
import {
    SwapQuote,
    SwapQuoteRequest,
} from 'src/domains/Currency/domains/SwapQuote'
import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { Avatar } from 'src/uikit/Avatar'
import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { Column2 } from 'src/uikit/Column2'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'
import { getRoute } from '../validation'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Refresh } from 'src/uikit/Icon/Refresh'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_route_click' }
    | { type: 'on_try_again_clicked' }
    | { type: 'on_slippage_clicked' }

export const Route = ({ pollable, onMsg }: Props) => {
    const { knownCurrencies } = pollable.data
    const route = getRoute(pollable)

    switch (pollable.type) {
        case 'reloading':
            return (
                <Column2 spacing={12}>
                    <Header
                        onMsg={onMsg}
                        swapSlippagePercent={
                            pollable.params.swapSlippagePercent
                        }
                    />

                    <FeeInputButton
                        left={
                            <Skeleton
                                variant="default"
                                width={35}
                                height={16}
                            />
                        }
                        right={
                            <Skeleton
                                variant="default"
                                width={55}
                                height={16}
                            />
                        }
                        onClick={() => onMsg({ type: 'on_route_click' })}
                    />
                </Column2>
            )

        case 'subsequent_failed':
            return (
                <Column2 spacing={12}>
                    <Header
                        onMsg={onMsg}
                        swapSlippagePercent={
                            pollable.params.swapSlippagePercent
                        }
                    />

                    <Progress2
                        rounded
                        variant="critical"
                        progress={100}
                        initialProgress={100}
                        title={
                            <FormattedMessage
                                id="currency.swap.swap_provider_loading_failed"
                                defaultMessage="We had issues loading providers"
                            />
                        }
                        subtitle={null}
                        right={
                            <>
                                <Tertiary
                                    size="regular"
                                    color="critical"
                                    onClick={() =>
                                        onMsg({ type: 'on_try_again_clicked' })
                                    }
                                >
                                    <Refresh size={14} />
                                    <FormattedMessage
                                        id="action.retry"
                                        defaultMessage="Retry"
                                    />
                                </Tertiary>
                            </>
                        }
                    />
                </Column2>
            )

        case 'loaded': {
            return (
                route && (
                    <Column2 spacing={12}>
                        <Header
                            onMsg={onMsg}
                            swapSlippagePercent={
                                pollable.params.swapSlippagePercent
                            }
                        />

                        <FeeInputButton
                            left={
                                <Row spacing={4}>
                                    <Avatar
                                        variant="squared"
                                        src={route.protocolIcon}
                                        size={20}
                                    />

                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textPrimary"
                                    >
                                        {route.protocolDisplayName}
                                    </Text2>
                                </Row>
                            }
                            right={
                                <Row spacing={4}>
                                    {route.estimatedGasFeeInDefaultCurrency && (
                                        <Text2
                                            variant="paragraph"
                                            weight="regular"
                                            color="textPrimary"
                                        >
                                            <FormattedMessage
                                                id="route.fees"
                                                defaultMessage="Network fees {fees}"
                                                values={{
                                                    fees: (
                                                        <FormattedFeeInDefaultCurrency
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            money={
                                                                route.estimatedGasFeeInDefaultCurrency
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text2>
                                    )}
                                    <LightArrowDown2
                                        size={20}
                                        color="iconDefault"
                                    />
                                </Row>
                            }
                            onClick={() => onMsg({ type: 'on_route_click' })}
                        />
                    </Column2>
                )
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const Header = ({
    swapSlippagePercent,
    onMsg,
}: {
    swapSlippagePercent: number
    onMsg: (msg: { type: 'on_slippage_clicked' }) => void
}) => {
    const { formatNumber } = useIntl()
    return (
        <Row spacing={4}>
            <Text2 variant="footnote" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="currency.swap.swap_provider"
                    defaultMessage="Swap provider"
                />
            </Text2>

            <Spacer2 />

            <Tertiary
                color="on_light"
                size="small"
                onClick={() => onMsg({ type: 'on_slippage_clicked' })}
            >
                <Row spacing={4}>
                    <FormattedMessage
                        id="SelectRoute.slippage"
                        defaultMessage="Slippage {slippage}"
                        values={{
                            slippage: formatNumber(swapSlippagePercent / 100, {
                                style: 'percent',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            }),
                        }}
                    />
                    <LightArrowDown2 size={16} />
                </Row>
            </Tertiary>
        </Row>
    )
}
