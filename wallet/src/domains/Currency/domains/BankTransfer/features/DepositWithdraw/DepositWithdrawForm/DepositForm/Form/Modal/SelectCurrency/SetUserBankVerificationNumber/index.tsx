import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { setUnblockUserBankVerificationNumber } from '@zeal/domains/Currency/domains/BankTransfer/api/setUnblockUserBankVerificationNumber'
import { notReachable } from '@zeal/toolkit'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SuccessLayout } from 'src/uikit/SuccessLayout'
import { FormattedMessage } from 'react-intl'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Form } from './Form'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { FiatCurrency } from '@zeal/domains/Currency'

type Props = {
    loginInfo: UnblockLoginInfo
    unblockLoginSignature: UnblockLoginSignature
    currency: FiatCurrency
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'user_bank_verification_number_successfully_set'
          bankVerificationNumber: string
          currency: FiatCurrency
      }

export const SetUserBankVerificationNumber = ({
    account,
    keyStoreMap,
    network,
    currency,
    loginInfo,
    unblockLoginSignature,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        setUnblockUserBankVerificationNumber
    )

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_form_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        loginInfo,
                                        unblockLoginSignature,
                                        bankVerificationNumber:
                                            msg.bankVerificationNumber,
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
                                keyStoreMap,
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
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="currency.bank_transfer.set_user_bvn.success"
                            defaultMessage="Account set up"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({
                            type: 'user_bank_verification_number_successfully_set',
                            bankVerificationNumber:
                                loadable.params.bankVerificationNumber,
                            currency,
                        })
                    }}
                />
            )
        case 'error':
            return (
                <>
                    <LoadingLayout
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={getKeyStore({
                                    keyStoreMap,
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
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
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
