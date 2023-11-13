import { AccountsMap } from '@zeal/domains/Account'
import { Add as AddAccount } from 'src/domains/Account/features/Add'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { GetStarted } from './HowExperiencedYouAre'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    state: State

    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    sessionPassword: string

    onMsg: (msg: Msg) => void
}

export type State = 'restore_existing' | 'get_started'

type Msg = MsgOf<typeof AddAccount> | MsgOf<typeof GetStarted>

export const WelcomeToZeal = ({
    state,
    accountsMap,
    customCurrencies,
    keystoreMap,
    sessionPassword,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state) {
        case 'restore_existing':
            return (
                <AddAccount
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        case 'get_started':
            return (
                <GetStarted
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
