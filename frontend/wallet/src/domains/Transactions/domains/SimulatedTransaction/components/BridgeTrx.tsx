import React from 'react'
import { BridgeTrx } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Column2 } from 'src/uikit/Column2'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { FormattedMessage } from 'react-intl'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'
import { BridgeRouteToListItem } from 'src/domains/Currency/domains/Bridge/components/BridgeRouteToListItem'
import { BridgeRouteFromListItem } from 'src/domains/Currency/domains/Bridge/components/BridgeRouteFromListItem'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    transaction: BridgeTrx
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}
export type Msg = { type: 'close' }

export const BridgeTrxView = ({
    transaction,
    networkMap,
    knownCurrencies,
}: Props) => {
    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: transaction.bridgeRoute.to.currencyId,
        knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: transaction.bridgeRoute.from.currencyId,
        knownCurrencies: knownCurrencies,
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
                    bridgeRoute={transaction.bridgeRoute}
                    requestStatus={{ type: 'not_started' }}
                    knownCurrencies={knownCurrencies}
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
                    bridgeRoute={transaction.bridgeRoute}
                    bridgeStatus={{
                        targetTransaction: { type: 'not_started' },
                        refuel: transaction.bridgeRoute.refuel && {
                            type: 'not_started',
                        },
                    }}
                    knownCurrencies={knownCurrencies}
                />
            </Section>
        </Column2>
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
