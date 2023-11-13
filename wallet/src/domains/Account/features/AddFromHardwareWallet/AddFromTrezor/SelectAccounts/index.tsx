import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accounts: Account[]
    keystoreMap: KeyStoreMap
    extendedPublicKey: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Layout>,
    { type: 'close' | 'on_account_create_request' }
>

export const SelectAccounts = ({
    accounts,
    extendedPublicKey,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                extendedPublicKey={extendedPublicKey}
                accounts={accounts}
                keystoreMap={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_account_create_request':
                            onMsg(msg)
                            break

                        case 'header_info_icon_click':
                            setModal({ type: 'hardware_wallet_tips' })
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
