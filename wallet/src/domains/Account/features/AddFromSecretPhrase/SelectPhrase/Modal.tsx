import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Modal as UIModal } from '@zeal/uikit/Modal'

import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { SelectAccount } from '../SelectAccount'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    state: State
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'account_selection'; keystore: SecretPhrase }

type Msg = { type: 'close' } | MsgOf<typeof SelectAccount>

export const Modal = ({
    state,
    accountsMap,
    sessionPassword,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'account_selection':
            return (
                <UIModal>
                    <SelectAccount
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencies={customCurrencies}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        accountsMap={accountsMap}
                        keystore={state.keystore}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
