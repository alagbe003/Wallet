import { AccountsMap } from '@zeal/domains/Account'
import { ChangeAccount } from 'src/domains/Account/features/ChangeAccount'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from 'src/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConfirmSafetyCheckConnection } from 'src/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { SafetyChecksPopup } from 'src/domains/SafetyCheck/components/SafetyChecksPopup'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Modal as UIModal } from 'src/uikit/Modal'

type Props = {
    state: State
    accounts: AccountsMap
    alternativeProvider: 'metamask'
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ChangeAccount>
    | MsgOf<typeof ConfirmSafetyCheckConnection>

export type State =
    | { type: 'closed' }
    | { type: 'choose_account' }
    | { type: 'safety_checks'; safetyChecks: ConnectionSafetyCheck[] }
    | {
          type: 'confirm_connection_safety_checks'
          safetyChecks: ConnectionSafetyCheck[]
      }

export const Modal = ({
    state,
    accounts,
    portfolios,
    alternativeProvider,
    currencyHiddenMap,
    customCurrencyMap,
    keystoreMap,
    networkRPCMap,
    networkMap,
    sessionPassword,
    connectionState,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'choose_account':
            return (
                <UIModal>
                    <ChangeAccount
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolios={portfolios}
                        keystoreMap={keystoreMap}
                        selectedProvider={{
                            type: 'metamask',
                        }}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'safety_checks':
            return (
                <SafetyChecksPopup
                    dAppSiteInfo={connectionState.dApp}
                    onMsg={onMsg}
                    safetyChecks={state.safetyChecks}
                />
            )
        case 'confirm_connection_safety_checks':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
