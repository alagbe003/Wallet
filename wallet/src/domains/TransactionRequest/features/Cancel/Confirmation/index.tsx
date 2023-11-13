import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { Layout, Msg as LayoutMsg, State as LayoutState } from './Layout'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    transactionRequest: CancelSubmited
    state: LayoutState
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = LayoutMsg

const POLL_INTERVAL_MS = 1000

export const Confirmation = ({
    transactionRequest,
    keystores,
    state,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [pollable] = usePollableData(
        fetchTransaction,
        {
            type: 'loading',
            params: {
                transaction: transactionRequest.cancelSubmitedTransaction,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
            },
        },
        {
            pollIntervalMilliseconds: POLL_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed': {
                        switch (pollable.data.state) {
                            case 'queued':
                            case 'included_in_block':
                                return false

                            case 'completed':
                            case 'failed':
                                return true

                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data)
                        }
                    }

                    case 'loading':
                    case 'error':
                        return false

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    keystores={keystores}
                    state={state}
                    transactionRequest={{
                        ...transactionRequest,
                        cancelSubmitedTransaction: pollable.data,
                    }}
                    onMsg={onMsg}
                />
            )

        // If we yet don't have info render what we have initially
        case 'loading':
        case 'error':
            return (
                <Layout
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    keystores={keystores}
                    state={state}
                    transactionRequest={{
                        ...transactionRequest,
                        cancelSubmitedTransaction: pollable.params.transaction,
                    }}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(pollable)
    }
}
