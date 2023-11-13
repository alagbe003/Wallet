import React from 'react'
import { notReachable } from '@zeal/toolkit'
import { CountrySelector } from 'src/domains/Country/components/CountrySelector'
import { Modal as UIModal } from 'src/uikit/Modal'
import { UNBLOCK_SUPPORTED_COUNTRIES } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { InitialResidenceDetails } from './Layout'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    form: InitialResidenceDetails
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof CountrySelector>

export type State = { type: 'closed' } | { type: 'select_country' }

export const Modal = ({ state, form, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'select_country':
            return (
                <UIModal>
                    <CountrySelector
                        selectedCountry={form.country}
                        countries={UNBLOCK_SUPPORTED_COUNTRIES}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
