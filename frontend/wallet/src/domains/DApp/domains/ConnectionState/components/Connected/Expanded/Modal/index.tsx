import { Account, AccountsMap } from '@zeal/domains/Account'
import { ChangeAccount } from 'src/domains/Account/features/ChangeAccount'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    Network,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from 'src/domains/Network/features/Fillter'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Modal as UIModal } from 'src/uikit/Modal'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AlternativeProvider } from '@zeal/domains/Main'
import { ConnectToMetaMask } from './ConnectToMetaMask'
import { Connected } from 'src/domains/DApp/domains/ConnectionState'

type Props = {
    state: State

    connectionState: Connected

    networks: Network[]
    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap

    accounts: AccountsMap
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    portfolios: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string
    keystores: KeyStoreMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof ChangeAccount>
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof ConnectToMetaMask>

export type State =
    | { type: 'closed' }
    | { type: 'network_selector' }
    | { type: 'account_selector' }
    | { type: 'meta_mask_selected' }

export const Modal = ({
    state,
    networks,
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    alternativeProvider,
    accounts,
    portfolios,
    keystores,
    onMsg,
    customCurrencyMap,
    networkMap,
    sessionPassword,
    connectionState,
    currencyHiddenMap,
}: Props) => {
    switch (state.type) {
        case 'meta_mask_selected':
            return (
                <UIModal>
                    <ConnectToMetaMask
                        connectionState={connectionState}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'closed':
            return null
        case 'network_selector':
            return (
                <UIModal>
                    <NetworkFilter
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={selectedAccount}
                        keyStoreMap={keystores}
                        portfolio={portfolios[selectedAccount.address]}
                        currentNetwork={
                            {
                                type: 'specific_network',
                                network: selectedNetwork,
                            } as CurrentNetwork
                        }
                        networkRPCMap={networkRPCMap}
                        networks={networks.map(
                            (network): CurrentNetwork => ({
                                type: 'specific_network',
                                network,
                            })
                        )}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'account_selector':
            return (
                <UIModal>
                    <ChangeAccount
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        accounts={accounts}
                        portfolios={portfolios}
                        keystoreMap={keystores}
                        selectedProvider={{
                            type: 'zeal',
                            account: selectedAccount,
                        }}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
