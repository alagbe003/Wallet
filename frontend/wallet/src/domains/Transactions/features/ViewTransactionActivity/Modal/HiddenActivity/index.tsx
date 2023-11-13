import { Layout } from './Layout'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Modal, State as ModalState } from './Modal'
import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'

type Props = {
    networkMap: NetworkMap
    accountsMap: AccountsMap
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const HiddenActivity = ({
    account,
    selectedNetwork,
    networkRPCMap,
    accountsMap,
    keystore,
    onMsg,
    networkMap,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                networkMap={networkMap}
                accountsMap={accountsMap}
                account={account}
                selectedNetwork={selectedNetwork}
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_activity_transaction_click':
                            setModal({
                                type: 'transaction_details',
                                transaction: msg.transaction,
                                currencies: msg.knownCurrencies,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                account={account}
                accountsMap={accountsMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
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
