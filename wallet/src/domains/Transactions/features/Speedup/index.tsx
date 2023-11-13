import { notReachable } from '@zeal/toolkit'
import { DataLoader, Msg as DataLoaderMsg } from './DataLoader'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import { SpeedUpsIsNotSupportedPopup } from './SpeedUpsIsNotSupportedPopup'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | DataLoaderMsg

export const SpeedUp = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'Arbitrum':
                case 'zkSync':
                case 'ArbitrumGoerli':
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Base':
                    return (
                        <SpeedUpsIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )
                case 'PolygonMumbai':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'FantomTestnet':
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Aurora':
                case 'AuroraTestnet':
                case 'Evmos':
                    return (
                        <DataLoader
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
            return (
                <DataLoader
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
