import {
    OnRampTransactionEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { notReachable } from '@zeal/toolkit'
import {
    BankTransferCurrencies,
    fetchBankTransferCurrencies,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { Widget } from './Widget'
import { fetchLastUnfinishedOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastUnfinishedOnRamp'
import { useEffect } from 'react'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap } from '@zeal/domains/Network'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    unblockLoginSignature: UnblockLoginSignature
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Widget>

const fetch = async ({
    unblockLoginSignature,
    signal,
}: {
    unblockLoginSignature: UnblockLoginSignature
    signal?: AbortSignal
}): Promise<{
    event: OnRampTransactionEvent | null
    bankTransferCurrencies: BankTransferCurrencies
}> => {
    const bankTransferCurrencies = await fetchBankTransferCurrencies()
    const event = await fetchLastUnfinishedOnRamp({
        unblockLoginSignature,
        bankTransferCurrencies,
        signal,
    })

    return { event, bankTransferCurrencies }
}

export const Flow = ({ unblockLoginSignature, networkMap, onMsg }: Props) => {
    const [loadable] = useLoadableData(fetch, {
        type: 'loading',
        params: { unblockLoginSignature },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'loading':
        case 'error':
            return null
        case 'loaded': {
            if (!loadable.data.event) {
                return null
            }
            return (
                <Widget
                    event={loadable.data.event}
                    networkMap={networkMap}
                    bankTransferCurrencies={
                        loadable.data.bankTransferCurrencies
                    }
                    unblockLoginSignature={unblockLoginSignature}
                    onMsg={onMsg}
                />
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
