import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    SimulateCancelPopup,
    Msg as SimulateCancelPopupMsg,
} from './SimulateCancelPopup'
import { StopIsNotSupportedPopup } from './StopIsNotSupportedPopup'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof StopIsNotSupportedPopup> | SimulateCancelPopupMsg

export const SimulateCancel = ({
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
        case 'testnet': {
            switch (network.name) {
                case 'Arbitrum':
                case 'zkSync':
                case 'ArbitrumGoerli':
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Base':
                    return (
                        <StopIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )
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
                case 'Evmos':
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'PolygonMumbai':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'FantomTestnet':
                case 'AuroraTestnet':
                    return (
                        <SimulateCancelPopup
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

        case 'custom':
            return (
                <SimulateCancelPopup
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
