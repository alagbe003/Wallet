import React, { useState } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { State as ModalState, Modal } from './Modal'
import { Layout } from './Layout'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_back_button_clicked' | 'on_continue_click' }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
          }
      >

export const ChooseWallet = ({
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    sessionPassword,
    customCurrencies,
    portfolioMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                portfolioMap={portfolioMap}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_back_button_clicked':
                        case 'on_continue_click':
                            onMsg(msg)
                            break
                        case 'on_add_wallet_click':
                            setState({ type: 'add_account' })

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                sessionPassword={sessionPassword}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_account_create_request':
                            onMsg(msg)
                            break
                        case 'on_accounts_create_success_animation_finished':
                            setState({ type: 'closed' })
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
