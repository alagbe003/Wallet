import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import {
    LockScreen,
    Msg as LockScreenMsg,
} from 'src/domains/Password/features/LockScreen'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { Connected as ConnectedState } from '../../..'
import { Expanded, Msg as ExpandedMsg } from './Expanded'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AlternativeProvider } from '@zeal/domains/Main'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null

    selectedNetwork: Network
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    connectionState: ConnectedState
    accounts: AccountsMap

    portfolios: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg = LockScreenMsg | ExpandedMsg

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
    selectedNetwork,
    selectedAccount,
    connectionState,
    portfolios,
    keystores,
    accounts,
    alternativeProvider,
    sessionPassword,
    encryptedPassword,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
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
                <Expanded
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencyMap={customCurrencyMap}
                    sessionPassword={state.sessionPassword}
                    selectedNetwork={selectedNetwork}
                    selectedAccount={selectedAccount}
                    connectionState={connectionState}
                    accounts={accounts}
                    portfolios={portfolios}
                    keystores={keystores}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export { AccessChecker as Expanded }
