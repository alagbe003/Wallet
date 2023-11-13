import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { notReachable } from '@zeal/toolkit'
import { Kyc } from 'src/domains/Currency/domains/BankTransfer/features/KYC'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { LoadingLayout } from './LoadingLayout'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

type Props = {
    loginInfo: UnblockLoginInfo
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    signature: UnblockLoginSignature
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Kyc>,
    {
        type: 'kyc_applicant_created' | 'close' | 'on_do_bank_transfer_clicked'
    }
>

export const DataLoader = ({
    loginInfo,
    account,
    network,
    keyStoreMap,
    signature,
    onMsg,
    bankTransferInfo,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchUser, {
        type: 'loading',
        params: {
            unblockLoginInfo: loginInfo,
            unblockLoginSignature: signature,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
            return (
                <Kyc
                    unblockUser={loadable.data}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    bankTransferInfo={bankTransferInfo}
                    loginInfo={loginInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'kyc_data_updated':
                            case 'on_back_button_clicked':
                                onMsg({ type: 'close' })
                                break
                            case 'kyc_applicant_created':
                            case 'on_do_bank_transfer_clicked':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <AppErrorPopup
                        error={error}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
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
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
