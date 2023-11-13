import { Network } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

export const isEditNetworkFeeEnabled = (network: Network): boolean => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'BSC':
                case 'BscTestnet':
                case 'Polygon':
                case 'PolygonMumbai':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'FantomTestnet':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'AvalancheFuji':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Evmos':
                    return true
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Arbitrum':
                case 'ArbitrumGoerli':
                case 'Base':
                case 'zkSync':
                case 'Aurora':
                case 'AuroraTestnet':
                    return false
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        case 'custom':
            return true
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
