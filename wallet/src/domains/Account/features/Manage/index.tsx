import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    account: Account
    encryptedPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'confirm_account_delete_click'
                  | 'on_account_label_change_submit'
                  | 'on_recovery_kit_setup'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'account_item_clicked'
                  | 'add_new_account_click'
                  | 'track_wallet_clicked'
          }
      >

export const Manage = ({
    account,
    accounts,
    portfolios,
    onMsg,
    keystoreMap,
    encryptedPassword,
    currencyHiddenMap,
    networkRPCMap,
    sessionPassword,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                accounts={accounts}
                portfolios={portfolios}
                keystoreMap={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'add_new_account_click':
                        case 'track_wallet_clicked':
                            onMsg(msg)
                            break
                        case 'create_new_contact_account_click':
                            setModalState({
                                type: 'track_account',
                                address: msg.address,
                            })
                            break
                        case 'account_item_clicked':
                            onMsg(msg)
                            break
                        case 'account_details_clicked':
                            setModalState({
                                type: 'account_details',
                                address: msg.account.address,
                            })
                            break

                        case 'on_active_and_tracked_wallets_clicked':
                            setModalState({
                                type: 'active_and_tracked_wallets',
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                networkRPCMap={networkRPCMap}
                sessionPassword={sessionPassword}
                currencyHiddenMap={currencyHiddenMap}
                state={modalState}
                accounts={accounts}
                portfolios={portfolios}
                keystoreMap={keystoreMap}
                encryptedPassword={encryptedPassword}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_account_label_change_submit':
                        case 'on_recovery_kit_setup':
                        case 'on_account_create_request':
                            onMsg(msg)
                            break

                        case 'confirm_account_delete_click':
                            setModalState({ type: 'closed' })
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
