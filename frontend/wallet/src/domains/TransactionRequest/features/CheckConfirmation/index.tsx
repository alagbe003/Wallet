import { Submited } from '@zeal/domains/TransactionRequest'
import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'
import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { useEffect } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Layout, Msg as LayoutMsg, State as LayoutState } from './Layout'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    transactionRequest: Submited
    state: State
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = LayoutMsg

export type State = LayoutState

const POLL_INTERVAL_MS = 1000

export const CheckConfirmation = ({
    transactionRequest,
    state,
    accounts,
    keystores,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [pollable] = usePollableData(
        fetchTransaction,
        {
            type: 'loading',
            params: {
                transaction: transactionRequest.submitedTransaction,
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

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'loading':
                break
            case 'subsequent_failed':
            case 'error':
                captureError(pollable.error)
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable])

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={{
                        ...transactionRequest,
                        submitedTransaction: pollable.data,
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
                    accounts={accounts}
                    state={state}
                    transactionRequest={{
                        ...transactionRequest,
                        submitedTransaction: pollable.params.transaction,
                    }}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(pollable)
    }
}
