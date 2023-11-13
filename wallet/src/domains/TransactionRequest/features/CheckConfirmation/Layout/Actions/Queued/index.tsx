import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Modal, State as ModalState, Msg as ModalMsg } from './Modal'
import { Layout } from './Layout'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    ModalMsg,
    { type: 'confirm_speed_up_click' | 'cancellation_confirmed' }
>

export const AddedToQueue = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'stop_clicked':
                            setModalState({ type: 'cancel_transaction' })
                            break

                        case 'speed_up_clicked':
                            setModalState({ type: 'speedup_transaction' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                transactionRequest={transactionRequest}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'confirm_speed_up_click':
                        case 'cancellation_confirmed':
                            onMsg(msg)
                            break

                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
