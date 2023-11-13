import { useEffect } from 'react'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Address } from '@zeal/domains/Address'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferInfo, SumSubAccessToken } from '@zeal/domains/Storage'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { SubmitUserCreateRequest } from './SubmitUserCreateRequest'

type Props = {
    account: Account
    bankTransferInfo: BankTransferInfo
    network: Network
    keystoreMap: KeyStoreMap
    unblockLoginSignature: UnblockLoginSignature
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'unblock_user_already_exist'
          unblockLoginSignature: UnblockLoginSignature
          loginInfo: UnblockLoginInfo
          address: Address
          sumSubAccessToken: SumSubAccessToken | null
      }
    | Extract<
          MsgOf<typeof SubmitUserCreateRequest>,
          {
              type:
                  | 'unblock_user_created'
                  | 'on_try_with_different_wallet_clicked'
          }
      >

export const CreateUnblockUser = ({
    unblockLoginSignature,
    keystoreMap,
    bankTransferInfo,
    network,
    account,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(loginToUnblock, {
        type: 'loading',
        params: unblockLoginSignature,
    })

    const liveOnMsg = useLiveRef(onMsg)
    const liveBankTransferInfo = useLiveRef(bankTransferInfo)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                switch (liveBankTransferInfo.current.type) {
                    case 'not_started':
                        liveOnMsg.current({
                            type: 'unblock_user_already_exist',
                            loginInfo: loadable.data,
                            unblockLoginSignature: loadable.params,
                            address: account.address,
                            sumSubAccessToken: null,
                        })
                        break
                    case 'unblock_user_created':
                        liveOnMsg.current({
                            type: 'unblock_user_already_exist',
                            loginInfo: loadable.data,
                            unblockLoginSignature: loadable.params,
                            address: account.address,
                            sumSubAccessToken:
                                liveBankTransferInfo.current.sumSubAccessToken,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(liveBankTransferInfo.current)
                }
                break

            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable, account, liveBankTransferInfo])

    switch (loadable.type) {
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

        case 'error': {
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'unblock_login_user_did_not_exists':
                    return (
                        <SubmitUserCreateRequest
                            keystoreMap={keystoreMap}
                            network={network}
                            unblockLoginSignature={loadable.params}
                            account={account}
                            onMsg={onMsg}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return (
                        <AppErrorPopup
                            error={error}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg({ type: 'close' })
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
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
