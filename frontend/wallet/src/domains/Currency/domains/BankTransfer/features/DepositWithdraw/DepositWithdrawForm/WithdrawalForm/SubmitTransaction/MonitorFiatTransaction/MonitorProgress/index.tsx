import { useEffect, useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OffRampFailedEvent,
    OffRampSuccessEvent,
    SubmittedOfframpTransaction,
    UnblockLoginSignature,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { useCaptureErrorOnce } from 'src/domains/Error/hooks/useCaptureErrorOnce'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useCurrentTimestamp } from 'src/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastOfframpEvent } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastOfframpEvent'

type Props = {
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    transactionHash: string
    loginInfo: UnblockLoginInfo
    withdrawalRequest: WithdrawalRequest
    unblockLoginSignature: UnblockLoginSignature
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof Layout>
    | {
          type: 'on_withdrawal_monitor_fiat_transaction_start'
          submittedTransaction: SubmittedOfframpTransaction
      }
    | {
          type: 'on_withdrawal_monitor_fiat_transaction_success'
          event: OffRampSuccessEvent
      }
    | {
          type: 'on_withdrawal_monitor_fiat_transaction_failed'
          event: OffRampFailedEvent
      }

export const MonitorProgress = ({
    transactionHash,
    loginInfo,
    unblockLoginSignature,
    onMsg,
    account,
    keyStoreMap,
    network,
    networkMap,
    withdrawalRequest,
    bankTransferCurrencies,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [startedAt] = useState<number>(Date.now())
    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const [pollable, setPollable] = usePollableData(
        fetchLastOfframpEvent,
        {
            type: 'loading',
            params: {
                transactionHash,
                loginInfo,
                unblockLoginSignature,
                bankTransferCurrencies,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        liveMsg.current({
            type: 'on_withdrawal_monitor_fiat_transaction_start',
            submittedTransaction: {
                transactionHash,
                withdrawalRequest,
            },
        })
    }, [liveMsg, transactionHash, withdrawalRequest])

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed': {
                if (pollable.data) {
                    switch (pollable.data.type) {
                        case 'unblock_offramp_in_progress':
                        case 'unblock_offramp_fiat_transfer_issued':
                        case 'unblock_offramp_on_hold':
                            break

                        case 'unblock_offramp_success':
                            liveMsg.current({
                                type: 'on_withdrawal_monitor_fiat_transaction_success',
                                event: pollable.data,
                            })
                            break

                        case 'unblock_offramp_failed':
                            liveMsg.current({
                                type: 'on_withdrawal_monitor_fiat_transaction_failed',
                                event: pollable.data,
                            })
                            break

                        default:
                            notReachable(pollable.data)
                    }
                }
                break
            }

            case 'loading':
                break

            case 'error':
                captureErrorOnce(pollable.error)
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [liveMsg, pollable, captureErrorOnce])

    switch (pollable.type) {
        case 'loading':
            return (
                <Layout
                    now={now}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    offRampTransactionEvent={null}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    withdrawalRequest={withdrawalRequest}
                />
            )

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    now={now}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    offRampTransactionEvent={pollable.data}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    withdrawalRequest={withdrawalRequest}
                />
            )

        case 'error':
            return (
                <>
                    <Layout
                        now={now}
                        startedAt={startedAt}
                        transactionHash={transactionHash}
                        offRampTransactionEvent={null}
                        account={account}
                        keyStoreMap={keyStoreMap}
                        network={network}
                        networkMap={networkMap}
                        onMsg={onMsg}
                        withdrawalRequest={withdrawalRequest}
                    />

                    <AppErrorPopup
                        error={parseAppError(pollable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'try_again_clicked':
                                    setPollable({
                                        type: 'loading',
                                        params: pollable.params,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
