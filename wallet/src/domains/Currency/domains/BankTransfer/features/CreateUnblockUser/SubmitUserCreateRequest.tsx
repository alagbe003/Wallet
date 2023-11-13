import { useEffect } from 'react'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Address } from '@zeal/domains/Address'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    createUnblockUser,
    CreateUnblockUserParams,
} from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { Form } from './Form'
import { UserEmailAlreadyTaken } from './UserEmailAlreadyTaken'

type Props = {
    account: Account
    network: Network
    keystoreMap: KeyStoreMap
    unblockLoginSignature: UnblockLoginSignature
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'unblock_user_created'
          loginInfo: UnblockLoginInfo
          user: CreateUnblockUserParams
          unblockLoginSignature: UnblockLoginSignature
          address: Address
      }
    | MsgOf<typeof UserEmailAlreadyTaken>

const fetch = async ({
    user,
    unblockLoginSignature,
    signal,
}: {
    unblockLoginSignature: UnblockLoginSignature
    user: CreateUnblockUserParams
} & { signal?: AbortSignal }): Promise<UnblockLoginInfo> => {
    await createUnblockUser({
        signature: unblockLoginSignature,
        user,
        signal,
    })

    const loginResult = await loginToUnblock({
        ...unblockLoginSignature,
        signal,
    })

    return {
        ...user,
        ...loginResult,
    }
}

export const SubmitUserCreateRequest = ({
    account,
    keystoreMap,
    network,
    unblockLoginSignature,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetch)
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'unblock_user_created',
                    user: loadable.params.user,
                    loginInfo: loadable.data,
                    unblockLoginSignature,
                    address: account.address,
                })
                break

            case 'not_asked':
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable, unblockLoginSignature, account])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    keystoreMap={keystoreMap}
                    network={network}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_create_user_form_submit':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        unblockLoginSignature,
                                        user: msg.form,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={getKeyStore({
                                keyStoreMap: keystoreMap,
                                address: account.address,
                            })}
                            network={network}
                            left={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            }
                        />
                    }
                />
            )

        case 'loaded':
            return null

        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={getKeyStore({
                                    keyStoreMap: keystoreMap,
                                    address: account.address,
                                })}
                                network={network}
                                left={
                                    <IconButton
                                        onClick={() => onMsg({ type: 'close' })}
                                    >
                                        <BackIcon size={24} />
                                    </IconButton>
                                }
                            />
                        }
                    />

                    {(() => {
                        switch (error.type) {
                            case 'unblock_user_with_such_email_already_exists':
                                return (
                                    <UserEmailAlreadyTaken
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
                                                    break

                                                case 'on_try_with_different_wallet_clicked':
                                                    onMsg(msg)
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
                                                    break

                                                case 'try_again_clicked':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
