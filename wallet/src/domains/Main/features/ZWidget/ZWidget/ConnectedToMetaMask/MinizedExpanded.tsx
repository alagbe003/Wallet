import React, { useEffect, useState } from 'react'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { Minimize } from './Minimize'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Expanded } from './Expanded'
import { ConnectedToMetaMask } from 'src/domains/DApp/domains/ConnectionState'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { AlternativeProvider } from '@zeal/domains/Main'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DragAndDropBar } from 'src/uikit/DragAndClickHandler'

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
    | { type: 'expanded' | 'minimized' }
    | Extract<MsgOf<typeof Minimize>, { type: 'drag' }>
    | Extract<
          MsgOf<typeof Expanded>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'dApp_info_loaded'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'session_password_decrypted'
                  | 'zeal_account_connected'
          }
      >

export type State = { type: 'minimised' } | { type: 'expanded' }

export const MinizedExpanded = ({
    initialAccount,
    connectionState,
    portfolios,
    accounts,
    keystores,
    currencyHiddenMap,
    networkMap,
    customCurrencyMap,
    networkRPCMap,
    requestedNetwork,
    sessionPassword,
    encryptedPassword,
    alternativeProvider,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'minimised' })

    const liveMsg = useLiveRef(onMsg)
    useEffect(() => {
        switch (state.type) {
            case 'minimised':
                liveMsg.current({ type: 'minimized' })
                break
            case 'expanded':
                liveMsg.current({ type: 'expanded' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    switch (state.type) {
        case 'minimised':
            return (
                <Minimize
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                                setState({ type: 'expanded' })
                                break
                            case 'drag':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'expanded':
            return (
                <>
                    <DragAndDropBar onMsg={onMsg} />
                    <Expanded
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolios={portfolios}
                        keystores={keystores}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        connectionState={connectionState}
                        initialAccount={initialAccount}
                        requestedNetwork={requestedNetwork}
                        encryptedPassword={encryptedPassword}
                        alternativeProvider={alternativeProvider}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'add_wallet_clicked':
                                case 'hardware_wallet_clicked':
                                case 'on_account_create_request':
                                case 'track_wallet_clicked':
                                case 'dApp_info_loaded':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                case 'session_password_decrypted':
                                case 'zeal_account_connected':
                                    onMsg(msg)
                                    break

                                case 'lock_screen_close_click':
                                case 'on_continue_with_meta_mask':
                                case 'on_minimize_click':
                                case 'close':
                                case 'on_user_confirmed_connection_with_safety_checks':
                                case 'reject_connection_button_click':
                                    setState({ type: 'minimised' })
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
