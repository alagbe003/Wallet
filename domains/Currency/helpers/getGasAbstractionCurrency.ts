import { Address } from '@zeal/domains/Address'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { GAS_ABSTRACTION_GAS_TOKEN_ADDRESSES } from '@zeal/domains/Currency/constants'
import { Network } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit/notReachable'

// FIXME @resetko-zeal this assumes we should have gas abstraction currencies in portfolio to proceed
export const getGasAbstractionCurrencies = ({
    network,
    portfolio,
}: {
    network: Network
    portfolio: Portfolio
}): CryptoCurrency[] | null => {
    const currencyAddresses: Address[] =
        GAS_ABSTRACTION_GAS_TOKEN_ADDRESSES[network.hexChainId] || null

    if (currencyAddresses === null) {
        // We don't have options for this network
        return null
    }

    const gasAbstractionCurrencyAddresses = new Set<Address>(currencyAddresses)

    const portfolioCurrenciesAddresses = portfolio.tokens
        .filter((token) => token.networkHexId === network.hexChainId)
        .map((token) => portfolio.currencies[token.balance.currencyId])
        .filter(Boolean)
        .filter((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false
                case 'CryptoCurrency':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        })
        .filter((currency) =>
            gasAbstractionCurrencyAddresses.has(currency.address)
        )

    return portfolioCurrenciesAddresses.length
        ? portfolioCurrenciesAddresses
        : null
}
