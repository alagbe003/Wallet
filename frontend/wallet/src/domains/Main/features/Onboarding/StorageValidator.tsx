import { Storage } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'

import { Add as AddPassword } from 'src/domains/Password/features/Add'
import { LockScreen } from 'src/domains/Password/features/LockScreen'
import { calculateStorageState } from '@zeal/domains/Storage/helpers/calculateStorageState'
import { init } from '@zeal/domains/Storage/helpers/init'
import { toLocalStorage } from 'src/domains/Storage/helpers/toLocalStorage'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { State as WelcomeState, WelcomeToZeal } from './WelcomeToZeal'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    storage: Storage | null
    sessionPassword: string | null
    flowState: WelcomeState
    installationId: string
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof WelcomeToZeal>,
          {
              type: 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<MsgOf<typeof LockScreen>, { type: 'lock_screen_close_click' }>

export const StorageValidator = ({
    storage,
    sessionPassword,
    flowState,
    networkMap,
    onMsg,
}: Props) => {
    const storageState = calculateStorageState({ sessionPassword, storage })

    switch (storageState.type) {
        case 'no_storage':
            return (
                <AddPassword
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'password_added': {
                                await toLocalStorage(
                                    init(msg.encryptedPassword)
                                )
                                await chrome.storage.session.set({
                                    password: msg.sessionPassword,
                                })
                                break
                            }

                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={storageState.storage.encryptedPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                onMsg(msg)
                                break

                            case 'session_password_decrypted':
                                chrome.storage.session.set({
                                    password: msg.sessionPassword,
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'unlocked':
            return (
                <WelcomeToZeal
                    currencyHiddenMap={storageState.storage.currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={storageState.storage.networkRPCMap}
                    sessionPassword={storageState.sessionPassword}
                    state={flowState}
                    accountsMap={storageState.storage.accounts}
                    customCurrencies={storageState.storage.customCurrencies}
                    keystoreMap={storageState.storage.keystoreMap}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storageState.storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(storageState)
    }
}
