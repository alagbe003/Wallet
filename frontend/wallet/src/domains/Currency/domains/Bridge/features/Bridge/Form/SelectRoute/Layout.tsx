import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { notReachable } from '@zeal/toolkit'
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
import { FormattedTokenBalanceWithSymbol } from 'src/domains/Money/components/FormattedTokenBalanceWithSymbol'
import { SolidLightning } from 'src/uikit/Icon/SolidLightning'
import {
    BridgePollable,
    BridgeRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { useReadableDuration } from 'src/toolkit/Date/useReadableDuration'

type Props = {
    pollable: BridgePollable
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_route_selected'; route: BridgeRequest }
    | { type: 'on_slippage_clicked' }
    | { type: 'on_best_return_icon_clicked' }
    | { type: 'on_best_service_time_icon_clicked' }

export const Layout = ({ pollable, keystoreMap, onMsg }: Props) => {
    const { formatNumber, formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <Layout2
            background="light"
            padding="form"
            aria-labelledby="bridge-provider-modal"
        >
            <ActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: pollable.params.fromAccount.address,
                })}
                account={pollable.params.fromAccount}
                network={null}
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
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
                        id="bridge-provider-modal"
                    >
                        <FormattedMessage
                            id="BridgeRoute.title"
                            defaultMessage="Bridge provider"
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
                                id="BridgeRoute.slippage"
                                defaultMessage="Slippage {slippage}"
                                values={{
                                    slippage: formatNumber(
                                        pollable.params.slippagePercent / 100,
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
                        case 'loading':
                        case 'error':
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
                            const routes = pollable.data
                            const bestReturnRoute: BridgeRequest | null =
                                routes[0]

                            const bestServiceTimeRoute: BridgeRequest | null =
                                routes.reduce((fastest, current) => {
                                    if (!fastest) {
                                        return current
                                    }

                                    return current.route.serviceTimeMs <
                                        fastest.route.serviceTimeMs
                                        ? current
                                        : fastest
                                }, null as BridgeRequest | null)

                            return routes.length ? (
                                routes.map((route) => (
                                    <Group
                                        variant="default"
                                        key={route.route.name}
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
                                                route.route.displayName
                                            }
                                            avatar={({ size }) => (
                                                <Avatar
                                                    src={route.route.icon}
                                                    variant="squared"
                                                    size={size}
                                                />
                                            )}
                                            size="regular"
                                            side={{
                                                title: (
                                                    <Row spacing={4}>
                                                        {route.route.name ===
                                                            bestReturnRoute
                                                                ?.route
                                                                .name && (
                                                            <Tertiary
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
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'bridge.best_return',
                                                                        defaultMessage:
                                                                            'Best return route',
                                                                    }
                                                                )}
                                                            >
                                                                <BoldDiscount
                                                                    color="iconStatusSuccess"
                                                                    size={20}
                                                                />
                                                            </Tertiary>
                                                        )}

                                                        {route.route.name ===
                                                            bestServiceTimeRoute
                                                                ?.route
                                                                .name && (
                                                            <Tertiary
                                                                color="on_light"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    onMsg({
                                                                        type: 'on_best_service_time_icon_clicked',
                                                                    })
                                                                    event.stopPropagation()
                                                                }}
                                                                size="regular"
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'bridge.best_serivce_time',
                                                                        defaultMessage:
                                                                            'Best service time route',
                                                                    }
                                                                )}
                                                            >
                                                                <SolidLightning
                                                                    color="iconStatusNeutral"
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
                                                                    route.knownCurrencies
                                                                }
                                                                money={
                                                                    route.route
                                                                        .to
                                                                }
                                                            />
                                                        </Text2>
                                                    </Row>
                                                ),
                                                subtitle: (
                                                    <Row spacing={12}>
                                                        <Text2
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textSecondary"
                                                        >
                                                            {formatHumanReadableDuration(
                                                                route.route
                                                                    .serviceTimeMs
                                                            )}
                                                        </Text2>

                                                        {route.route
                                                            .feeInDefaultCurrency && (
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
                                                                                    route.knownCurrencies
                                                                                }
                                                                                money={
                                                                                    route
                                                                                        .route
                                                                                        .feeInDefaultCurrency
                                                                                }
                                                                            />
                                                                        ),
                                                                    }}
                                                                />
                                                            </Text2>
                                                        )}
                                                    </Row>
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
                                            id="currencies.bridge.select_routes.emptyState"
                                            defaultMessage="We found no routes for this bridge"
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
