import {
    SimulateCancel,
    Msg as SimulateCancelMsg,
} from 'src/domains/TransactionRequest/features/SimulateCancel'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import {
    SpeedUp,
    Msg as SpeedUpMsg,
} from 'src/domains/Transactions/features/Speedup'
import { notReachable } from '@zeal/toolkit'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

export type State =
    | { type: 'closed' }
    | { type: 'speedup_transaction' }
    | { type: 'cancel_transaction' }

type Props = {
    state: State
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = SpeedUpMsg | SimulateCancelMsg

export const Modal = ({
    state,
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'speedup_transaction':
            return (
                <SpeedUp
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'cancel_transaction':
            return (
                <SimulateCancel
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
