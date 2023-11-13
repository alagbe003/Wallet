import { useState } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from 'src/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { shouldWeConfirmSafetyCheck } from '../helpers'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    alternativeProvider: 'metamask'
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'on_continue_with_meta_mask' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'account_item_clicked'
                  | 'add_wallet_clicked'
                  | 'on_user_confirmed_connection_with_safety_checks'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'safe_wallet_clicked'
          }
      >

export const MetaMaskSelected = ({
    alternativeProvider,
    connectionState,
    portfolios,
    accounts,
    customCurrencyMap,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    keystoreMap,
    sessionPassword,
    safetyChecksLoadable,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                safetyChecksLoadable={safetyChecksLoadable}
                alternativeProvider={alternativeProvider}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_safety_checks_click':
                            setModalState({
                                type: 'safety_checks',
                                safetyChecks: msg.safetyChecks,
                            })
                            break
                        case 'on_account_selector_click':
                            setModalState({ type: 'choose_account' })
                            break
                        case 'on_continue_with_meta_mask':
                            switch (safetyChecksLoadable.type) {
                                case 'loading':
                                case 'error':
                                    onMsg(msg)
                                    break
                                case 'loaded':
                                    shouldWeConfirmSafetyCheck(
                                        safetyChecksLoadable.data.checks
                                    )
                                        ? setModalState({
                                              type: 'confirm_connection_safety_checks',
                                              safetyChecks:
                                                  safetyChecksLoadable.data
                                                      .checks,
                                          })
                                        : onMsg(msg)

                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(safetyChecksLoadable)
                            }
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modalState}
                accounts={accounts}
                alternativeProvider={alternativeProvider}
                portfolios={portfolios}
                keystoreMap={keystoreMap}
                sessionPassword={sessionPassword}
                customCurrencyMap={customCurrencyMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                currencyHiddenMap={currencyHiddenMap}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'confirmation_modal_close_clicked':
                        case 'other_provider_selected':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_accounts_create_success_animation_finished':
                        case 'account_item_clicked':
                        case 'add_wallet_clicked':
                        case 'on_user_confirmed_connection_with_safety_checks':
                        case 'hardware_wallet_clicked':
                        case 'on_account_create_request':
                        case 'track_wallet_clicked':
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
