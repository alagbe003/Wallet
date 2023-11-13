import React from 'react'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import { FormattedMessage } from 'react-intl'
import { RequestStateIcon } from './RequestStateIcon'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    BridgeRoute,
    BridgeSubmittedStatus,
} from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'

type Props = {
    bridgeRoute: BridgeRoute
    bridgeStatus: BridgeSubmittedStatus
    knownCurrencies: KnownCurrencies
}

export type Msg = { type: 'close' }

export const BridgeRouteToListItem = ({
    bridgeStatus,
    bridgeRoute,
    knownCurrencies,
}: Props) => {
    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeRoute.to.currencyId,
        knownCurrencies,
    })

    const refuelCurrency =
        bridgeRoute.refuel &&
        getCryptoCurrency({
            cryptoCurrencyId: bridgeRoute.refuel.to.currencyId,
            knownCurrencies,
        })

    return (
        <>
            <ListItem2
                aria-selected={false}
                size="regular"
                primaryText={toCurrency.code}
                avatar={({ size }) => (
                    <Avatar
                        rightBadge={() => null}
                        size={size}
                        currency={toCurrency}
                    />
                )}
                side={{
                    title: (
                        <FormattedMessage
                            id="currency.bridge.from_amount"
                            defaultMessage="+{amount}"
                            values={{
                                amount: (
                                    <FormattedTokenBalances
                                        money={bridgeRoute.to}
                                        knownCurrencies={knownCurrencies}
                                    />
                                ),
                            }}
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="currency.bridge.from_amount_usd"
                            defaultMessage="+{amount}"
                            values={{
                                amount: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        money={
                                            bridgeRoute.toPriceInDefaultCurrency
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
                            requestState={bridgeStatus.targetTransaction}
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
                                id="currency.bridge.refuel.from_amount"
                                defaultMessage="+{amount}"
                                values={{
                                    amount: (
                                        <FormattedTokenBalances
                                            money={bridgeRoute.refuel.to}
                                            knownCurrencies={knownCurrencies}
                                        />
                                    ),
                                }}
                            />
                        ),
                        rightIcon: ({ size }) => (
                            <RequestStateIcon
                                size={size}
                                requestState={
                                    bridgeStatus.refuel ?? { type: 'pending' }
                                }
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
