import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from 'src/domains/DApp/domains/ConnectionState'
import {
    Connect,
    Msg as ConnectMsg,
} from 'src/domains/DApp/domains/ConnectionState/components/Connect'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import {
    LockScreen,
    Msg as LockScreenMsg,
} from 'src/domains/Password/features/LockScreen'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AlternativeProvider } from '@zeal/domains/Main'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null

    connectionState: DisconnectedState | NotInteractedState

    alternativeProvider: AlternativeProvider

    initialAccount: Account
    requestedNetwork: Network

    portfolios: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg = LockScreenMsg | ConnectMsg

type State =
    | { type: 'locked'; encryptedPassword: string }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
    encryptedPassword,
}: {
    sessionPassword: string | null
    encryptedPassword: string
}): State => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }

    return { type: 'locked', encryptedPassword }
}

export const AccessChecker = ({
    initialAccount,
    connectionState,
    portfolios,
    accounts,
    keystores,
    sessionPassword,
    encryptedPassword,
    requestedNetwork,
    customCurrencyMap,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    alternativeProvider,
    onMsg,
}: Props) => {
    const state = calculateState({ sessionPassword, encryptedPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={state.encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            return (
                <Connect
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencyMap={customCurrencyMap}
                    sessionPassword={state.sessionPassword}
                    requestedNetwork={requestedNetwork}
                    connectionState={connectionState}
                    initialAccount={initialAccount}
                    portfolios={portfolios}
                    keystores={keystores}
                    accounts={accounts}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
