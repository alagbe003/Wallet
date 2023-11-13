import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar as AccountActionBar } from 'src/domains/Account/components/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { Content } from 'src/uikit/Layout/Content'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Column2 } from 'src/uikit/Column2'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { FormattedMessage, useIntl } from 'react-intl'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Account } from '@zeal/domains/Account'
import React from 'react'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'
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

type Props = {
    keystoreMap: KeyStoreMap
    account: Account
    bridgeSubmitted: BridgeSubmitted
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Completed = ({
    bridgeSubmitted,
    onMsg,
    account,
    keystoreMap,
    networkMap,
}: Props) => {
    const { formatMessage } = useIntl()
    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.to.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.from.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        toCurrency.networkHexChainId,
        networkMap
    )

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
            <Column2
                style={{ flex: '1 1 auto' }}
                spacing={16}
                aria-labelledby="bridge-layout-label"
            >
                <Content
                    header={
                        <Content.Header
                            titleId="bridge-layout-label"
                            title={<HeaderTitle />}
                            subtitle={
                                <HeaderSubtitle
                                    bridgeRoute={bridgeSubmitted.route}
                                />
                            }
                        />
                    }
                    footer={
                        <Progress2
                            variant="success"
                            title={
                                <FormattedMessage
                                    id="bridge.check_status.complete"
                                    defaultMessage="Complete"
                                />
                            }
                            right={
                                <IconButton
                                    onClick={() =>
                                        openExplorerLink(bridgeSubmitted)
                                    }
                                >
                                    <Row spacing={4} alignX="center">
                                        <Text2
                                            variant="paragraph"
                                            weight="regular"
                                            color="textPrimary"
                                        >
                                            0x
                                        </Text2>

                                        <ExternalLink
                                            size={14}
                                            color="textPrimary"
                                        />
                                    </Row>
                                </IconButton>
                            }
                            initialProgress={100}
                            progress={100}
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
                                        network={fromNetwork}
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
                                        network={toNetwork}
                                        onClick={null}
                                    />
                                }
                            />
                            <BridgeRouteToListItem
                                bridgeRoute={bridgeSubmitted.route}
                                bridgeStatus={{
                                    refuel: bridgeSubmitted.route.refuel && {
                                        type: 'completed',
                                    },
                                    targetTransaction: { type: 'completed' },
                                }}
                                knownCurrencies={
                                    bridgeSubmitted.knownCurrencies
                                }
                            />
                        </Section>
                    </Column2>
                </Content>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.close"
                        defaultMessage="Close"
                    />
                </Button>
            </Column2>
        </Layout2>
    )
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
