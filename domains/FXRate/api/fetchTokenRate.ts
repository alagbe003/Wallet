import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { fetchRate } from '@zeal/domains/FXRate/api/fetchRate'
import { notReachable } from '@zeal/toolkit'
import { Token } from '@zeal/domains/Token'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { FXRate } from '@zeal/domains/FXRate'

export const fetchTokenRate = async (
    token: Token,
    knownCurrencies: KnownCurrencies,
    networkMap: NetworkMap
): Promise<FXRate | null> => {
    const currency = knownCurrencies[token.balance.currencyId]
    switch (currency.type) {
        case 'FiatCurrency':
            throw new Error('trying to get rate for fiat currency')
        case 'CryptoCurrency': {
            const net = findNetworkByHexChainId(token.networkHexId, networkMap)

            switch (net.type) {
                case 'predefined':
                    const { rate } = await fetchRate({
                        tokenAddress: currency.address,
                        network: net,
                    })
                    return rate
                case 'custom':
                case 'testnet':
                    return null
                /* istanbul ignore next */
                default:
                    return notReachable(net)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
