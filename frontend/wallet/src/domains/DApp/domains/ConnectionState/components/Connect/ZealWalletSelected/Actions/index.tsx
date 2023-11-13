import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

type Props = {
    selectedNetwork: Network
    selectedAccount: Account
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>

    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'on_safety_checks_click'
                  | 'reject_connection_button_click'
                  | 'connect_button_click'
          }
      >
    | Extract<
          ModalMsg,
          { type: 'on_user_confirmed_connection_with_safety_checks' }
      >

export const Actions = ({
    safetyChecksLoadable,
    selectedAccount,
    selectedNetwork,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_safety_checks_click':
                        case 'reject_connection_button_click':
                        case 'connect_button_click':
                            onMsg(msg)
                            break

                        case 'connect_confirmation_requested':
                            setModalState({
                                type: 'confirm_connection',
                                safetyChecks: msg.safetyChecks,
                            })
                            break
                        default:
                            notReachable(msg)
                    }
                }}
                safetyChecksLoadable={safetyChecksLoadable}
                selectedAccount={selectedAccount}
                selectedNetwork={selectedNetwork}
            />

            <Modal
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_user_confirmed_connection_with_safety_checks':
                            onMsg(msg)
                            break

                        case 'close':
                        case 'confirmation_modal_close_clicked':
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
