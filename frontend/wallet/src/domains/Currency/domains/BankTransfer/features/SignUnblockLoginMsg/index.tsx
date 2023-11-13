import { useEffect, useState } from 'react'
import Web3 from 'web3'

import { Account } from '@zeal/domains/Account'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import {
    LEDGER,
    PrivateKey,
    SecretPhrase,
    SigningKeyStore,
    Trezor,
} from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { PersonalSign } from '@zeal/domains/RPCRequest'
import {
    UnblockSIWELoginRequest,
    generateUnblockLoginRequest,
} from '@zeal/domains/RPCRequest/helpers/generateUnblockLoginRequest'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { Sign } from 'src/domains/RPCRequest/features/Sign'

type Props = {
    account: Account
    network: Network
    networkMap: NetworkMap
    keystore: SigningKeyStore
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_message_signed'
          account: Account
          loginSignature: UnblockLoginSignature
      }

type State =
    | {
          type: 'no_user_interaction_required_to_sign_msg'
          keystore: SecretPhrase | PrivateKey
      }
    | {
          type: 'user_interaction_is_needed'
          keystore: Trezor | LEDGER
      }

const calculateState = ({ keystore }: { keystore: SigningKeyStore }): State => {
    switch (keystore.type) {
        case 'private_key_store':
        case 'secret_phrase_key':
            return {
                type: 'no_user_interaction_required_to_sign_msg',
                keystore,
            }

        case 'ledger':
        case 'trezor':
            return {
                type: 'user_interaction_is_needed',
                keystore,
            }
        case 'safe_v0':
            // FIXME @resetko-zeal
            throw new Error('Not implemented')

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

const createRPCRequest = (
    account: Account,
    loginRequest: UnblockSIWELoginRequest
): PersonalSign => {
    const w3 = new Web3()
    return {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [w3.utils.utf8ToHex(loginRequest.message), account.address],
    }
}

export const SignUnblockLoginMsg = ({
    account,
    keystore,
    sessionPassword,
    network,
    networkMap,
    onMsg,
}: Props) => {
    const [state] = useState(() => calculateState({ keystore }))
    const onMsgLive = useLiveRef(onMsg)

    const loginRequest = generateUnblockLoginRequest({ account, network })
    const personalSign = createRPCRequest(account, loginRequest)

    useEffect(() => {
        switch (state.type) {
            case 'no_user_interaction_required_to_sign_msg':
                signMessage({
                    request: personalSign,
                    sessionPassword,
                    keyStore: state.keystore,
                    network,
                })
                    .then((signature) => {
                        onMsgLive.current({
                            type: 'on_message_signed',
                            loginSignature: {
                                message: loginRequest.message,
                                signature,
                            },
                            account,
                        })
                    })
                    .catch(() => {
                        captureError(
                            new ImperativeError(
                                `not able to generate generateUnblockLoginRequest`
                            )
                        )
                    })

                break
            case 'user_interaction_is_needed':
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [
        account,
        onMsgLive,
        sessionPassword,
        state,
        personalSign,
        loginRequest,
        network,
    ])

    switch (state.type) {
        case 'no_user_interaction_required_to_sign_msg':
            return null
        case 'user_interaction_is_needed':
            return (
                <Sign
                    networkMap={networkMap}
                    sessionPassword={sessionPassword}
                    keyStore={state.keystore}
                    request={personalSign}
                    state={{ type: 'maximised' }}
                    account={account}
                    dApp={{
                        hostname: 'api.getunblock.com',
                        avatar: null,
                        title: null,
                    }}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'cancel_button_click':
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'message_signed':
                                onMsg({
                                    type: 'on_message_signed',
                                    loginSignature: {
                                        message: loginRequest.message,
                                        signature: msg.signature,
                                    },
                                    account,
                                })
                                break
                            case 'on_expand_request':
                            case 'drag':
                                throw new ImperativeError(
                                    `impossible state try to minimize send during singing unblock login msg`
                                )
                            case 'import_keys_button_clicked':
                                throw new ImperativeError(
                                    `Unblock should not be available with nonsigning key stores`
                                )
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
