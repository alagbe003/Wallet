import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { ImperativeError } from '@zeal/domains/Error'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar as AccountActionBar } from 'src/domains/Account/components/ActionBar'
import { IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Account } from '@zeal/domains/Account'
import { FormattedMessage, useIntl } from 'react-intl'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import { Column2 } from 'src/uikit/Column2'
import { useEffect } from 'react'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Content } from 'src/uikit/Layout/Content'
import { Progress } from '@zeal/uikit/Progress'
import { useCurrentTimestamp } from 'src/toolkit/Date/useCurrentTimestamp'
import { Text } from '@zeal/uikit/Text'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Row } from '@zeal/uikit/Row'
import {
    BridgeSubmitted,
    BridgeSubmittedPollable,
    RequestState,
} from '@zeal/domains/Currency/domains/Bridge'
import { fetchBridgeRequestStatus } from 'src/domains/Currency/domains/Bridge/api/fetchBridgeRequestStatus'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import {
    HeaderSubtitle,
    HeaderTitle,
} from 'src/domains/Currency/domains/Bridge/components/BridgeRouteHeader'
import { BridgeRouteFromListItem } from 'src/domains/Currency/domains/Bridge/components/BridgeRouteFromListItem'
import { BridgeRouteToListItem } from 'src/domains/Currency/domains/Bridge/components/BridgeRouteToListItem'
import { openExplorerLink } from 'src/domains/Currency/domains/Bridge/helpers/openExplorerLink'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { useReadableDuration } from 'src/toolkit/Date/useReadableDuration'

type Props = {
    networkMap: NetworkMap
    account: Account
    keystoreMap: KeyStoreMap
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'bridge_completed' }

export const Pending = ({
    bridgeSubmitted,
    keystoreMap,
    account,
    networkMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()
    const useLiveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchBridgeRequestStatus,
        {
            type: 'loaded',
            params: {
                request: bridgeSubmitted,
            },
            data: {
                refuel: bridgeSubmitted.route.refuel
                    ? { type: 'pending' as const }
                    : null,
                targetTransaction: { type: 'pending' as const },
            },
        },
        {
            pollIntervalMilliseconds: 10_000,
        }
    )

    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const timePassed = now - bridgeSubmitted.submittedAtMS
    const timePassedPercentage = Math.min(
        1,
        timePassed / bridgeSubmitted.route.serviceTimeMs
    )

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
                            useLiveMsg.current({ type: 'bridge_completed' })
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
                                useLiveMsg.current({ type: 'bridge_completed' })
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

    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.to.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.from.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    switch (pollable.type) {
        case 'loading':
        case 'error':
            throw new ImperativeError('impossible loading state')
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout2 padding="form" background="light">
                    <AccountActionBar
                        keystore={getKeyStore({
                            keyStoreMap: keystoreMap,
                            address: account.address,
                        })}
                        network={null}
                        account={account}
                        right={
                            <IconButton
                                onClick={() => onMsg({ type: 'close' })}
                                aria-label={formatMessage({
                                    id: 'actions.close',
                                    defaultMessage: 'Close',
                                })}
                            >
                                <CloseCross size={24} />
                            </IconButton>
                        }
                    />
                    <Content
                        header={
                            <Content.Header
                                title={<HeaderTitle />}
                                subtitle={
                                    <HeaderSubtitle
                                        bridgeRoute={bridgeSubmitted.route}
                                    />
                                }
                            />
                        }
                        footer={
                            <Progress
                                variant="neutral"
                                title={
                                    <FormattedMessage
                                        id="bridge.check_status.progress_text"
                                        defaultMessage="Bridging {from} to {to}"
                                        values={{
                                            from: fromCurrency.symbol,
                                            to: toCurrency.symbol,
                                        }}
                                    />
                                }
                                right={
                                    <Row spacing={4} alignX="center">
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textStatusNeutralOnColor"
                                        >
                                            {`${formatHumanReadableDuration(
                                                now -
                                                    bridgeSubmitted.submittedAtMS,
                                                'floor'
                                            )} / ${formatHumanReadableDuration(
                                                bridgeSubmitted.route
                                                    .serviceTimeMs
                                            )}`}
                                        </Text>

                                        <IconButton
                                            onClick={() =>
                                                openExplorerLink(
                                                    bridgeSubmitted
                                                )
                                            }
                                        >
                                            <Row spacing={4} alignX="center">
                                                <Text
                                                    variant="paragraph"
                                                    weight="regular"
                                                    color="textPrimary"
                                                >
                                                    0x
                                                </Text>

                                                <ExternalLink
                                                    size={14}
                                                    color="textPrimary"
                                                />
                                            </Row>
                                        </IconButton>
                                    </Row>
                                }
                                initialProgress={0}
                                progress={timePassedPercentage}
                            />
                        }
                    >
                        <Column2 spacing={16}>
                            <Section>
                                <GroupHeader
                                    left={
                                        <FormattedMessage
                                            id="currency.bridge.bridge_from"
                                            defaultMessage="From"
                                        />
                                    }
                                    right={
                                        <FancyButton
                                            rounded={true}
                                            network={findNetworkByHexChainId(
                                                fromCurrency.networkHexChainId,
                                                networkMap
                                            )}
                                            onClick={null}
                                        />
                                    }
                                />
                                <BridgeRouteFromListItem
                                    bridgeRoute={bridgeSubmitted.route}
                                    requestStatus={{ type: 'completed' }}
                                    knownCurrencies={
                                        bridgeSubmitted.knownCurrencies
                                    }
                                />
                            </Section>
                            <Section>
                                <GroupHeader
                                    left={
                                        <FormattedMessage
                                            id="currency.bridge.bridge_to"
                                            defaultMessage="To"
                                        />
                                    }
                                    right={
                                        <FancyButton
                                            rounded={true}
                                            network={findNetworkByHexChainId(
                                                toCurrency.networkHexChainId,
                                                networkMap
                                            )}
                                            onClick={null}
                                        />
                                    }
                                />
                                <BridgeRouteToListItem
                                    bridgeRoute={bridgeSubmitted.route}
                                    bridgeStatus={{
                                        targetTransaction:
                                            getRequestStatus(pollable),
                                        refuel:
                                            bridgeSubmitted.route.refuel &&
                                            getRefuelStatus(pollable),
                                    }}
                                    knownCurrencies={
                                        bridgeSubmitted.knownCurrencies
                                    }
                                />
                            </Section>
                        </Column2>
                    </Content>
                </Layout2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const getRequestStatus = (pollable: BridgeSubmittedPollable): RequestState => {
    switch (pollable.type) {
        case 'loading':
        case 'error':
            return { type: 'pending' }
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return pollable.data.targetTransaction
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const getRefuelStatus = (pollable: BridgeSubmittedPollable): RequestState => {
    switch (pollable.type) {
        case 'loading':
        case 'error':
            return { type: 'pending' }
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            if (!pollable.data.refuel) {
                return { type: 'pending' }
            }
            return pollable.data.refuel
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
