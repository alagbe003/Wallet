import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ImperativeError } from '@zeal/domains/Error'
import { SignUnblockLoginMsg } from 'src/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { CreateUnblockUser } from 'src/domains/Currency/domains/BankTransfer/features/CreateUnblockUser'
import { DataLoader } from './DataLoader'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    account: Account
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    sessionPassword: string
    network: Network
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof DataLoader>

type State =
    | { type: 'sign_message' }
    | { type: 'login_to_unblock'; signature: UnblockLoginSignature }
    | {
          type: 'data_loader'
          loginInfo: UnblockLoginInfo
          signature: UnblockLoginSignature
      }
export const KycLogin = ({
    account,
    keyStoreMap,
    bankTransferInfo,
    sessionPassword,
    network,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'sign_message' })

    switch (state.type) {
        case 'sign_message':
            const keystore = getKeyStore({
                address: account.address,
                keyStoreMap: keyStoreMap,
            })
            switch (keystore.type) {
                case 'track_only':
                    throw new ImperativeError(
                        `we get track only keystore inside bank transfer flow`
                    )
                case 'safe_v0':
                    // FIXME @resetko-zeal - Safe implementation
                    throw new Error('Not implemented')
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    return (
                        <SignUnblockLoginMsg
                            networkMap={networkMap}
                            network={network}
                            account={account}
                            sessionPassword={sessionPassword}
                            keystore={keystore}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'on_message_signed':
                                        setState({
                                            type: 'login_to_unblock',
                                            signature: msg.loginSignature,
                                        })
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
                    return notReachable(keystore)
            }
        case 'login_to_unblock':
            return (
                <CreateUnblockUser
                    bankTransferInfo={bankTransferInfo}
                    keystoreMap={keyStoreMap}
                    network={network}
                    account={account}
                    unblockLoginSignature={state.signature}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'unblock_user_already_exist':
                            case 'unblock_user_created':
                                setState({
                                    type: 'data_loader',
                                    loginInfo: msg.loginInfo,
                                    signature: state.signature,
                                })
                                break
                            case 'on_try_with_different_wallet_clicked':
                                onMsg({ type: 'close' })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'data_loader':
            return (
                <DataLoader
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    loginInfo={state.loginInfo}
                    signature={state.signature}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
