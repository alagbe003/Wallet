import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { TransactionRequest } from '@zeal/domains/TransactionRequest'
import React, { useState } from 'react'
import { NetworkMap } from '@zeal/domains/Network'
import { Modal, State as ModalState } from './Modal'
import { Layout } from './Layout'

type Props = {
    simulationResult: SimulationResult
    transactionRequest: TransactionRequest
    networkMap: NetworkMap
}

export const TransactionHeader = ({
    simulationResult,
    networkMap,
    transactionRequest,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                simulationResult={simulationResult}
                transactionRequest={transactionRequest}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_approval_info_click':
                            setModal({ type: 'approval_info_popup' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
            <Modal
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
