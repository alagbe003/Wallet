import React from 'react'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AddAccount } from './AddAccount'
import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    state: State
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof AddAccount>

export type State = { type: 'closed' } | { type: 'add_account' }

export const Modal = ({
    state,
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    sessionPassword,
    customCurrencies,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'add_account':
            return (
                <AddAccount
                    currencyHiddenMap={currencyHiddenMap}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                />
            )
        case 'closed':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
