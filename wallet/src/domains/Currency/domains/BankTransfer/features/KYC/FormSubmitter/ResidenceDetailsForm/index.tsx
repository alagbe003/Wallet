import React, { useState } from 'react'
import { State as ModalState, Modal } from './Modal'
import { InitialResidenceDetails, Layout } from './Layout'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

export type { InitialResidenceDetails } from './Layout'

type Props = {
    initialResidenceDetails: InitialResidenceDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Layout>,
    { type: 'on_form_submitted' | 'close' | 'on_back_button_clicked' }
>

export const ResidenceDetailsForm = ({
    initialResidenceDetails,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    const [form, setForm] = useState<InitialResidenceDetails>(
        initialResidenceDetails
    )

    return (
        <>
            <Layout
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                form={form}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_select_country_click':
                            setModalState({ type: 'select_country' })
                            break
                        case 'on_form_submitted':
                        case 'on_back_button_clicked':
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_form_change':
                            setForm(msg.form)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                form={form}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm({
                                ...form,
                                country: msg.countryCode,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
