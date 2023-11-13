import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Receive = ({ account, keystore, onMsg }: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                account={account}
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break

                        case 'on_supported_networks_click':
                            setModal({ type: 'supported_networks_list' })
                            break

                        default:
                            notReachable(msg)
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

                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
