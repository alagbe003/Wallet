import React, { useState } from 'react'
import { Modal, State as ModalState } from './Modal'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { notReachable } from '@zeal/toolkit'
import { Layout } from './Layout'
import {
    ConnectedToMetaMask,
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from 'src/domains/DApp/domains/ConnectionState'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { AlternativeProvider } from '@zeal/domains/Main'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

type Props = {
    connectionState:
        | DisconnectedState
        | NotInteractedState
        | ConnectedToMetaMask
    selectedNetwork: Network
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    networkRPCMap: NetworkRPCMap
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    portfolios: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type: 'on_minimize_click' | 'reject_connection_button_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_account_create_request'
                  | 'account_item_clicked'
                  | 'on_network_item_click'
                  | 'connected_animation_complete'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'other_provider_selected'
                  | 'safe_wallet_clicked'
          }
      >

export const ZealWalletSelected = ({
    selectedAccount,
    safetyChecksLoadable,
    accounts,
    portfolios,
    keystores,
    connectionState,
    selectedNetwork,
    networkRPCMap,
    customCurrencyMap,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
    alternativeProvider,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                keystore={getKeyStore({
                    keyStoreMap: keystores,
                    address: selectedAccount.address,
                })}
                portfolio={portfolios[selectedAccount.address]}
                safetyChecksLoadable={safetyChecksLoadable}
                connectionState={connectionState}
                selectedNetwork={selectedNetwork}
                selectedAccount={selectedAccount}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'account_selector_click':
                            setModalState({ type: 'account_selector' })
                            break
                        case 'network_selector_click':
                            setModalState({ type: 'network_selector' })
                            break

                        case 'on_safety_checks_click':
                            setModalState({
                                type: 'safety_checks',
                                safetyChecks: msg.safetyChecks,
                            })
                            break

                        case 'on_user_confirmed_connection_with_safety_checks':
                        case 'connect_button_click': // FIXME  @max-tern ::  you don't need animation
                            setModalState({ type: 'connection_confirmation' }) // FIXME @max-tern :: naming set modal to play last animation
                            break
                        case 'reject_connection_button_click':
                        case 'on_minimize_click':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                dAppSiteInfo={connectionState.dApp}
                state={modalState}
                networks={values(networkMap)}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                selectedAccount={selectedAccount}
                accounts={accounts}
                portfolios={portfolios}
                keystores={keystores}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_network_item_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_account_create_request':
                        case 'connected_animation_complete':
                            onMsg(msg)
                            break

                        case 'account_item_clicked':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'other_provider_selected':
                            onMsg(msg)
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
