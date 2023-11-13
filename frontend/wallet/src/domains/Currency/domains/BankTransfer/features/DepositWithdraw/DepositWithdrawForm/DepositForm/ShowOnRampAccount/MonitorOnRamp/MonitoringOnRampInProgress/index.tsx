import { useEffect, useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OnRampTransactionEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { useCurrentTimestamp } from 'src/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout } from './Layout'
import { useCaptureErrorOnce } from 'src/domains/Error/hooks/useCaptureErrorOnce'
import { fetchLastEventForOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastEventForOnRamp'

type Props = {
    network: Network
    account: Account
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    previousEvent: OnRampTransactionEvent
    form: OnRampFeeParams
    unblockLoginSignature: UnblockLoginSignature
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Layout>

export const MonitoringOnRampInProgress = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    form,
    bankTransferCurrencies,
    unblockLoginSignature,
    previousEvent,
    networkMap,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [startedAt] = useState<number>(Date.now())
    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const [pollable] = usePollableData(
        fetchLastEventForOnRamp,
        {
            type: 'loading',
            params: {
                bankTransferCurrencies,
                unblockLoginSignature,
                previousEvent,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                break
            case 'error':
                captureErrorOnce(pollable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [captureErrorOnce, pollable])

    switch (pollable.type) {
        case 'error':
        case 'loading':
            return (
                <Layout
                    networkMap={networkMap}
                    now={now}
                    startedAt={startedAt}
                    knownCurrencies={bankTransferCurrencies.knownCurrencies}
                    form={form}
                    onRampTransactionEvent={pollable.params.previousEvent}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    networkMap={networkMap}
                    now={now}
                    startedAt={startedAt}
                    knownCurrencies={bankTransferCurrencies.knownCurrencies}
                    form={form}
                    onRampTransactionEvent={pollable.data}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
