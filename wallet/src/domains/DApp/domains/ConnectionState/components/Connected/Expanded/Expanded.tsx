import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { Connected as ConnectedState } from '../../../../ConnectionState'
import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'
import { values } from '@zeal/toolkit/Object'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AlternativeProvider } from '@zeal/domains/Main'

type Props = {
    connectionState: ConnectedState
    accounts: AccountsMap

    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap
    selectedAccount: Account
    networkMap: NetworkMap
    alternativeProvider: AlternativeProvider
    currencyHiddenMap: CurrencyHiddenMap

    portfolios: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string
    keystores: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          LayoutMsg,
          {
              type: 'disconnect_button_click' | 'on_minimize_click'
          }
      >
    | Extract<
          ModalMsg,
          {
              type:
                  | 'account_item_clicked'
                  | 'on_network_item_click'
                  | 'add_new_account_click'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_continue_with_meta_mask'
                  | 'safe_wallet_clicked'
          }
      >

export const Expanded = ({
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    connectionState,
    portfolios,
    alternativeProvider,
    keystores,
    accounts,
    customCurrencyMap,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
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
                selectedNetwork={selectedNetwork}
                selectedAccount={selectedAccount}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'account_selector_click':
                            setModalState({ type: 'account_selector' })
                            break
                        case 'network_selector_click':
                            setModalState({ type: 'network_selector' })
                            break
                        case 'disconnect_button_click':
                        case 'on_minimize_click':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                connectionState={connectionState}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                state={modalState}
                networks={values(networkMap)}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                accounts={accounts}
                selectedAccount={selectedAccount}
                portfolios={portfolios}
                keystores={keystores}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_connect_to_metamask_click':
                            setModalState({ type: 'account_selector' })
                            break

                        case 'account_item_clicked':
                        case 'on_network_item_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break
                        case 'other_provider_selected':
                            setModalState({ type: 'meta_mask_selected' })
                            break
                        case 'on_continue_with_meta_mask':
                        case 'on_account_create_request':
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
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
