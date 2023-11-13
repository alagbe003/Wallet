import React from 'react'
import { notReachable } from '@zeal/toolkit'
import { LockScreen } from 'src/domains/Password/features/LockScreen'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Connect } from 'src/domains/DApp/domains/ConnectionState/components/Connect'
import { ConnectedToMetaMask } from 'src/domains/DApp/domains/ConnectionState'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { AlternativeProvider } from '@zeal/domains/Main'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null
    connectionState: ConnectedToMetaMask
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolios: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof LockScreen>
    | MsgOf<typeof Connect>

type InternalState =
    | { type: 'locked' }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
}: {
    sessionPassword: string | null
}): InternalState => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }
    return { type: 'locked' }
}
export const Expanded = ({
    sessionPassword,
    encryptedPassword,
    currencyHiddenMap,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    requestedNetwork,
    alternativeProvider,
    initialAccount,
    accounts,
    portfolios,
    keystores,
    connectionState,
    onMsg,
}: Props) => {
    const state = calculateState({ sessionPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            return (
                <Connect
                    connectionState={connectionState}
                    alternativeProvider={alternativeProvider}
                    portfolios={portfolios}
                    keystores={keystores}
                    accounts={accounts}
                    customCurrencyMap={customCurrencyMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    currencyHiddenMap={currencyHiddenMap}
                    sessionPassword={state.sessionPassword}
                    requestedNetwork={requestedNetwork}
                    initialAccount={initialAccount}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
