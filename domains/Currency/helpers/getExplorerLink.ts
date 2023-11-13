import { CryptoCurrency } from '@zeal/domains/Currency'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

export const getExplorerLink = (
    currency: CryptoCurrency,
    networkMap: NetworkMap
): string => {
    const network = findNetworkByHexChainId(
        currency.networkHexChainId,
        networkMap
    )
    const blockExplorerUrl = network.blockExplorerUrl

    switch (network.type) {
        case 'predefined': {
            switch (network.name) {
                case 'Ethereum':
                case 'Arbitrum':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Aurora':
                case 'Evmos':
                    return `${blockExplorerUrl}/token/${currency.address}`
                case 'zkSync':
                    return `${blockExplorerUrl}/address/${currency.address}`
                default:
                    return notReachable(network)
            }
        }
        case 'custom':
        case 'testnet':
            return `${blockExplorerUrl}/token/${currency.address}`

        default:
            return notReachable(network)
    }
}
