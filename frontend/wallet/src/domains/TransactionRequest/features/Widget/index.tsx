import { useEffect } from 'react'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import {
    SubmitedTransactionCompleted,
    SubmitedTransactionFailed,
} from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'
import { Submited } from '@zeal/domains/TransactionRequest'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { Skeleton } from './Skeleton'
import { Layout } from './Layout'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { AccountsMap } from '@zeal/domains/Account'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

type Props = {
    transactionRequest: Submited
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'transaction_request_completed'
          transactionRequest: Submited
          submitedTransaction: SubmitedTransactionCompleted
      }
    | {
          type: 'transaction_request_failed'
          transactionRequest: Submited
          submitedTransaction: SubmitedTransactionFailed
      }
    | MsgOf<typeof Layout>

const POLL_INTERVAL_MS = 1000

export const Widget = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
    keyStoreMap,
    accountsMap,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)

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
            case 'error':
                captureError(pollable.error)
                break

            case 'loading':
                break

            case 'reloading':
            case 'subsequent_failed':
            case 'loaded':
                switch (pollable.data.state) {
                    case 'queued':
                    case 'included_in_block':
                        break

                    case 'completed':
                        liveMsg.current({
                            type: 'transaction_request_completed',
                            submitedTransaction: pollable.data,
                            transactionRequest: {
                                ...transactionRequest,
                                submitedTransaction: pollable.data,
                            },
                        })
                        break

                    case 'failed':
                        liveMsg.current({
                            type: 'transaction_request_failed',
                            submitedTransaction: pollable.data,
                            transactionRequest: {
                                ...transactionRequest,
                                submitedTransaction: pollable.data,
                            },
                        })
                        break

                    default:
                        notReachable(pollable.data)
                }
                break

            default:
                notReachable(pollable)
        }
    }, [pollable, liveMsg, transactionRequest])

    switch (pollable.type) {
        case 'loading':
        case 'error':
            return <Skeleton />

        case 'subsequent_failed':
        case 'reloading':
        case 'loaded':
            return (
                <Layout
                    accountsMap={accountsMap}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    onMsg={onMsg}
                    transactionRequest={{
                        ...transactionRequest,
                        submitedTransaction: pollable.data,
                    }}
                />
            )

        default:
            return notReachable(pollable)
    }
}
