import { AlternativeProvider } from '@zeal/domains/Main'
import { useLayoutEffect, useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { DragAndDropBar } from 'src/uikit/DragAndClickHandler'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'
import { Connected as ConnectedState } from '../..'
import { Expanded, Msg as ExpandedMsg } from './Expanded'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    connectionState: ConnectedState

    selectedNetwork: Network
    selectedAccount: Account

    encryptedPassword: string
    sessionPassword: string | null
    alternativeProvider: AlternativeProvider
    accounts: AccountsMap

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    portfolios: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'expanded' }
    | { type: 'minimized' }
    | Exclude<
          ExpandedMsg,
          { type: 'on_minimize_click' | 'lock_screen_close_click' }
      >
    | Extract<MinimizedMsg, { type: 'drag' }>

type State = { type: 'expanded' } | { type: 'minimized' }

export const Connected = ({
    connectionState,
    selectedAccount,
    selectedNetwork,
    sessionPassword,
    encryptedPassword,
    portfolios,
    keystores,
    accounts,
    alternativeProvider,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'minimized' })
    const liveMsg = useLiveRef(onMsg)

    useLayoutEffect(() => {
        switch (state.type) {
            case 'expanded':
                liveMsg.current({ type: 'expanded' })
                break
            case 'minimized':
                liveMsg.current({ type: 'minimized' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    switch (state.type) {
        case 'expanded':
            return (
                <>
                    <DragAndDropBar onMsg={onMsg} />
                    <Expanded
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        customCurrencyMap={customCurrencyMap}
                        selectedNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        selectedAccount={selectedAccount}
                        encryptedPassword={encryptedPassword}
                        sessionPassword={sessionPassword}
                        connectionState={connectionState}
                        accounts={accounts}
                        portfolios={portfolios}
                        keystores={keystores}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'lock_screen_close_click':
                                case 'on_minimize_click':
                                    setState({ type: 'minimized' })
                                    break
                                case 'account_item_clicked':
                                case 'add_wallet_clicked':
                                case 'disconnect_button_click':
                                case 'hardware_wallet_clicked':
                                case 'on_account_create_request':
                                case 'on_continue_with_meta_mask':
                                case 'on_network_item_click':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                case 'session_password_decrypted':
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
        case 'minimized':
            return (
                <Minimized
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
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
