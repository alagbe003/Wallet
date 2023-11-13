import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { PasswordCheckPopup } from 'src/domains/Password/features/PasswordCheckPopup'
import { notReachable } from '@zeal/toolkit'
import { Modal } from '@zeal/uikit/Modal'

import { ViewPrivateKey } from './ViewPrivateKey'

type Props = {
    encryptedPassword: string
    keystore: SecretPhrase | PrivateKey
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'enter_password' }
    | { type: 'view_private_key'; sessionPassword: string }

type Msg = { type: 'close' }

export const Flow = ({ encryptedPassword, keystore, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'enter_password' })

    switch (state.type) {
        case 'enter_password':
            return (
                <PasswordCheckPopup
                    subtitle={
                        <FormattedMessage
                            id="ViewPrivateKey.PasswordChecker.subtitle"
                            defaultMessage="Please enter your password to verify it’s you"
                        />
                    }
                    encryptedPassword={encryptedPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'session_password_decrypted':
                                setState({
                                    type: 'view_private_key',
                                    sessionPassword: msg.sessionPassword,
                                })
                                break

                            case 'lock_screen_close_click':
                                onMsg({ type: 'close' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'view_private_key':
            return (
                <Modal>
                    <ViewPrivateKey
                        keyStore={keystore}
                        sessionPassword={state.sessionPassword}
                        onMsg={onMsg}
                    />
                </Modal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
