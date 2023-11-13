import React from 'react'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { FormattedMessage } from 'react-intl'
import { RequestStateIcon } from './RequestStateIcon'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    BridgeRoute,
    RequestState,
} from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'

type Props = {
    bridgeRoute: BridgeRoute
    requestStatus: RequestState
    knownCurrencies: KnownCurrencies
}

export type Msg = { type: 'close' }

export const BridgeRouteFromListItem = ({
    requestStatus,
    bridgeRoute,
    knownCurrencies,
}: Props) => {
    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeRoute.from.currencyId,
        knownCurrencies,
    })

    const refuelCurrency =
        bridgeRoute.refuel &&
        getCryptoCurrency({
            cryptoCurrencyId: bridgeRoute.refuel.from.currencyId,
            knownCurrencies,
        })

    return (
        <>
            <ListItem2
                aria-selected={false}
                size="regular"
                primaryText={fromCurrency.code}
                avatar={({ size }) => (
                    <Avatar
                        rightBadge={() => null}
                        size={size}
                        currency={fromCurrency}
                    />
                )}
                side={{
                    title: (
                        <FormattedMessage
                            id="currency.bridge.from_amount"
                            defaultMessage="-{amount}"
                            values={{
                                amount: (
                                    <FormattedTokenBalances
                                        money={bridgeRoute.from}
                                        knownCurrencies={knownCurrencies}
                                    />
                                ),
                            }}
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="currency.bridge.from_amount_usd"
                            defaultMessage="-{amount}"
                            values={{
                                amount: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        money={
                                            bridgeRoute.fromPriceInDefaultCurrency
                                        }
                                        knownCurrencies={knownCurrencies}
                                    />
                                ),
                            }}
                        />
                    ),
                    rightIcon: ({ size }) => (
                        <RequestStateIcon
                            size={size}
                            requestState={requestStatus}
                        />
                    ),
                }}
            />
            {refuelCurrency && bridgeRoute.refuel && (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    primaryText={refuelCurrency.code}
                    avatar={({ size }) => (
                        <Avatar
                            rightBadge={() => null}
                            size={size}
                            currency={refuelCurrency}
                        />
                    )}
                    side={{
                        title: (
                            <FormattedMessage
                                id="currency.refuel.from_amount"
                                defaultMessage="-{amount}"
                                values={{
                                    amount: (
                                        <FormattedTokenBalances
                                            money={bridgeRoute.refuel.from}
                                            knownCurrencies={knownCurrencies}
                                        />
                                    ),
                                }}
                            />
                        ),
                        rightIcon: ({ size }) => (
                            <RequestStateIcon
                                size={size}
                                requestState={requestStatus}
                            />
                        ),
                    }}
                />
            )}
        </>
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
