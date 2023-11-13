import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    originalEthSendTransaction: EthSendTransaction
    knownCurrencies: KnownCurrencies
    transaction: ApprovalTransaction
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Layout>,
    {
        type: 'close' | 'on_edit_approval_form_submit'
    }
>

export const Form = ({
    originalEthSendTransaction,
    knownCurrencies,
    transaction,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                originalEthSendTransaction={originalEthSendTransaction}
                knownCurrencies={knownCurrencies}
                transaction={transaction}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_edit_approval_form_submit':
                            onMsg(msg)
                            break
                        case 'on_spend_limit_info_click':
                            setModal({ type: 'spend_limit_info' })
                            break
                        case 'on_high_spend_limit_warning_click':
                            setModal({ type: 'high_spend_limit_info' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
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
