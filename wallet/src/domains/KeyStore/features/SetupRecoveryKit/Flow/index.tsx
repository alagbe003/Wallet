import { useState } from 'react'

import { State as ModalState, Modal } from './Modal'
import { Layout } from './Layout'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    keystore: SecretPhrase
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    account: Account
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_secret_phrase_verified_success'
                  | 'on_google_drive_backup_success'
          }
      >

export const Flow = ({
    account,
    accounts,
    keystoreMap,
    encryptedPassword,
    keystore,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_google_drive_backup_click':
                            setState({ type: 'on_google_drive_backup' })
                            break
                        case 'on_write_down_secret_phrase_click':
                            setState({ type: 'on_write_down_secret_phrase' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={state}
                accounts={accounts}
                keystoreMap={keystoreMap}
                encryptedPassword={encryptedPassword}
                keystore={keystore}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_before_you_begin_back_clicked':
                        case 'on_skip_verification_click':
                        case 'on_secret_phrase_reveal_back_clicked':
                        case 'lock_screen_close_click':
                            setState({ type: 'closed' })
                            break

                        case 'on_secret_phrase_verified_success':
                        case 'on_google_drive_backup_success':
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
