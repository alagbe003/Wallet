import { useState } from 'react'

import { State as ModalState, Modal, Msg as ModalMsg } from './Modal'
import { Layout } from './Layout'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Portfolio } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { openAddAccountPageTab } from 'src/domains/Main/helpers/openEntrypoint'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    account: Account
    keystoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string

    encryptedPassword: string
    portfolio: Portfolio | null

    currencyHiddenMap: CurrencyHiddenMap

    accounts: AccountsMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_account_label_change_submit'
                  | 'on_secret_phrase_verified_success'
                  | 'on_google_drive_backup_success'
                  | 'confirm_account_delete_click'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_recovery_kit_setup' | 'confirm_account_delete_click' }
      >

export const DetailsView = ({
    account,
    portfolio,
    encryptedPassword,
    accounts,
    keystoreMap,
    currencyHiddenMap,
    networkRPCMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    const keystore = getKeyStore({
        keyStoreMap: keystoreMap,
        address: account.address,
    })

    return (
        <>
            <Layout
                networkRPCMap={networkRPCMap}
                sessionPassword={sessionPassword}
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                portfolio={portfolio}
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_recovery_kit_setup':
                            onMsg(msg)
                            break
                        case 'on_add_private_key_click':
                            openAddAccountPageTab()
                            break
                        case 'on_edit_label_click':
                            setState({ type: 'edit_label', keystore })
                            break

                        case 'on_show_private_key_click':
                            setState({
                                type: 'show_private_key',
                                keystore: msg.keystore,
                            })
                            break

                        case 'on_show_secret_phrase_click':
                            setState({
                                type: 'show_secret_phrase',
                                keystore: msg.keystore,
                            })
                            break

                        case 'on_see_qr_code_click':
                            setState({
                                type: 'show_qr_code',
                                keystore: msg.keystore,
                            })
                            break

                        case 'on_account_delete_click':
                            setState({ type: 'confirm_delete' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />

            <Modal
                keystoreMap={keystoreMap}
                accounts={accounts}
                encryptedPassword={encryptedPassword}
                account={account}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_edit_label_close':
                            setState({ type: 'closed' })
                            break

                        case 'on_account_label_change_submit':
                        case 'confirm_account_delete_click':
                            onMsg(msg)
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
