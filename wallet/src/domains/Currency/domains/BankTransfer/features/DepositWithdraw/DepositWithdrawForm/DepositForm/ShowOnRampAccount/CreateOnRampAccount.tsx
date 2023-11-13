import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { createOnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/api/createOnRampAccount'
import { OnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Account } from '@zeal/domains/Account'
import { useEffect } from 'react'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { LoadingLayout } from '../../../LoadingLayout'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'

type Props = {
    form: OnRampFeeParams
    currencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
    network: Network
    keyStoreMap: KeyStoreMap
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    account: Account
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_ramp_account_created'; onRampAccount: OnRampAccount }

export const CreateOnRampAccount = ({
    form,
    currencies,
    network,
    keyStoreMap,
    account,
    unblockLoginInfo,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(createOnRampAccount, {
        type: 'loading',
        params: {
            currency: form.inputCurrency,
            unblockLoginInfo,
            unblockLoginSignature: bankTransferInfo.unblockLoginSignature,
            currencies,
        },
    })

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_ramp_account_created',
                    onRampAccount: loadable.data,
                })
                break
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable])

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
            return null
        case 'error':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
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
                                    return notReachable(msg)
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
