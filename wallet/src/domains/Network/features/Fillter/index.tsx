import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    portfolio: Portfolio | null

    account: Account
    keyStoreMap: KeyStoreMap

    networks: CurrentNetwork[]
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' | 'on_network_item_click' }>
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_rpc_change_confirmed' | 'on_select_rpc_click' }
      >

export const NetworkFilter = ({
    account,
    currentNetwork,
    keyStoreMap,
    networks,
    portfolio,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                networkMap={networkMap}
                currencyHiddenMap={currencyHiddenMap}
                portfolio={portfolio}
                account={account}
                currentNetwork={currentNetwork}
                keyStoreMap={keyStoreMap}
                networks={networks}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_network_item_click':
                            onMsg(msg)
                            break

                        case 'on_add_network_click':
                            setModalState({ type: 'add_network_tips' })
                            break

                        case 'on_edit_network_details_click':
                            setModalState({
                                type: 'edit_network_details',
                                network: msg.network,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                networkRPCMap={networkRPCMap}
                portfolio={portfolio}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_rpc_change_confirmed':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_select_rpc_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
