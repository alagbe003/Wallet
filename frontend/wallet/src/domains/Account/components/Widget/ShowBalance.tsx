import React from 'react'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CurrentNetwork } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    portfolio: Portfolio
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
}

export type Msg = { type: 'close' }

export const ShowBalance = ({
    portfolio,
    currentNetwork,
    currencyHiddenMap,
}: Props) => {
    const sum = sumPortfolio(portfolio, currencyHiddenMap)

    switch (currentNetwork.type) {
        case 'all_networks': {
            return (
                <FormattedTokenBalanceInDefaultCurrency
                    money={sum}
                    knownCurrencies={portfolio.currencies}
                />
            )
        }
        case 'specific_network': {
            const { network } = currentNetwork
            switch (network.type) {
                case 'predefined':
                    return (
                        <FormattedTokenBalanceInDefaultCurrency
                            money={sum}
                            knownCurrencies={portfolio.currencies}
                        />
                    )
                case 'custom':
                case 'testnet':
                    const token = portfolio.tokens.find((token) => {
                        return (
                            token.balance.currencyId ===
                            network.nativeCurrency.id
                        )
                    })

                    return token ? (
                        <FormattedTokenBalances
                            money={token.balance}
                            knownCurrencies={portfolio.currencies}
                        />
                    ) : null
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
