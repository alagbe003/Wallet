import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from 'src/domains/Currency/domains/SwapQuote'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedTokenBalanceWithSymbol } from 'src/domains/Money/components/FormattedTokenBalanceWithSymbol'
import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { IconButton } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Group } from 'src/uikit/Group'
import { BoldDiscount } from 'src/uikit/Icon/BoldDiscount'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Swap } from 'src/uikit/Icon/Swap'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_route_selected'; route: SwapRoute }
    | { type: 'on_slippage_clicked' }
    | { type: 'on_best_return_icon_clicked' }

export const Layout = ({ pollable, keystoreMap, onMsg }: Props) => {
    const { formatNumber, formatMessage } = useIntl()

    return (
        <Layout2
            background="light"
            padding="form"
            aria-labelledby="swap-provider-modal"
        >
            <ActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: pollable.params.fromAccount.address,
                })}
                account={pollable.params.fromAccount}
                network={null}
                left={
                    <IconButton
                        aria-label={formatMessage({
                            id: 'actions.close',
                            defaultMessage: 'Close',
                        })}
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2
                spacing={16}
                style={{ overflowY: 'auto', flex: '1 1 auto' }}
            >
                <Row spacing={8}>
                    <Text2
                        variant="title3"
                        weight="bold"
                        color="textPrimary"
                        id="swap-provider-modal"
                    >
                        <FormattedMessage
                            id="SelectRoute.title"
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
                                    slippage: formatNumber(
                                        pollable.params.swapSlippagePercent /
                                            100,
                                        {
                                            style: 'percent',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }
                                    ),
                                }}
                            />
                            <LightArrowDown2 size={16} />
                        </Row>
                    </Tertiary>
                </Row>

                {(() => {
                    switch (pollable.type) {
                        case 'reloading':
                            return new Array(2).fill(true).map((_, index) => (
                                <Group variant="default" key={index}>
                                    <ListItem2
                                        aria-selected={false}
                                        primaryText={
                                            <Skeleton
                                                variant="default"
                                                width={75}
                                                height={14}
                                            />
                                        }
                                        avatar={({ size }) => (
                                            <Skeleton
                                                variant="default"
                                                height={size}
                                                width={size}
                                            />
                                        )}
                                        size="regular"
                                        side={{
                                            title: (
                                                <Skeleton
                                                    variant="default"
                                                    width={75}
                                                    height={14}
                                                />
                                            ),
                                            subtitle: (
                                                <Skeleton
                                                    variant="default"
                                                    width={35}
                                                    height={14}
                                                />
                                            ),
                                        }}
                                    />
                                </Group>
                            ))

                        case 'loaded':
                        case 'subsequent_failed': {
                            const { routes, bestReturnRoute, knownCurrencies } =
                                pollable.data

                            return routes.length ? (
                                routes.map((route) => (
                                    <Group
                                        variant="default"
                                        key={route.dexName}
                                    >
                                        <ListItem2
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_route_selected',
                                                    route,
                                                })
                                            }
                                            aria-selected={false}
                                            primaryText={
                                                route.protocolDisplayName
                                            }
                                            avatar={({ size }) => (
                                                <Avatar
                                                    src={route.protocolIcon}
                                                    variant="squared"
                                                    size={size}
                                                />
                                            )}
                                            size="regular"
                                            side={{
                                                title: (
                                                    <Row spacing={4}>
                                                        {route.dexName ===
                                                            bestReturnRoute?.dexName && (
                                                            <Tertiary
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'currency.swap.best_return',
                                                                        defaultMessage:
                                                                            'Best return route',
                                                                    }
                                                                )}
                                                                color="on_light"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    onMsg({
                                                                        type: 'on_best_return_icon_clicked',
                                                                    })
                                                                    event.stopPropagation()
                                                                }}
                                                                size="regular"
                                                            >
                                                                <BoldDiscount
                                                                    color="iconStatusSuccess"
                                                                    size={20}
                                                                />
                                                            </Tertiary>
                                                        )}

                                                        <Text2
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textPrimary"
                                                        >
                                                            <FormattedTokenBalanceWithSymbol
                                                                knownCurrencies={
                                                                    knownCurrencies
                                                                }
                                                                money={{
                                                                    amount: route.toAmount,
                                                                    currencyId:
                                                                        route.toCurrencyId,
                                                                }}
                                                            />
                                                        </Text2>
                                                    </Row>
                                                ),
                                                subtitle:
                                                    route.estimatedGasFeeInDefaultCurrency && (
                                                        <Text2
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textSecondary"
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
                                                    ),
                                            }}
                                        />
                                    </Group>
                                ))
                            ) : (
                                <EmptyStateWidget
                                    icon={({ size }) => (
                                        <Swap size={size} color="iconDefault" />
                                    )}
                                    size="regular"
                                    title={
                                        <FormattedMessage
                                            id="SelectRoutes.emptyState"
                                            defaultMessage="We found no routes for this swap"
                                        />
                                    }
                                />
                            )
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(pollable)
                    }
                })()}
            </Column2>
        </Layout2>
    )
}
