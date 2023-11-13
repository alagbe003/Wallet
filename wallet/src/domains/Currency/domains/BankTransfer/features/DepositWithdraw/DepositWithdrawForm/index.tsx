import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    OffRampAccount,
    OffRampTransaction,
    OnRampTransaction,
    UnblockLoginSignature,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockTransactions } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockTransactions'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import {
    BankTransferUnblockUserCreated,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { LoadingLayout } from '../LoadingLayout'
import { Form } from './Form'

type Props = {
    customCurrencies: CustomCurrencyMap
    bankTransferCurrencies: BankTransferCurrencies
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    offRampAccounts: OffRampAccount[]
    installationId: string
    sessionPassword: string
    network: Network
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    account: Account
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Form>,
    {
        type:
            | 'close'
            | 'unblock_offramp_account_created'
            | 'on_off_ramp_account_become_default'
            | 'kyc_applicant_created'
            | 'on_withdrawal_monitor_fiat_transaction_start'
            | 'on_withdrawal_monitor_fiat_transaction_success'
            | 'on_withdrawal_monitor_fiat_transaction_failed'
            | 'import_keys_button_clicked'
            | 'on_predefined_fee_preset_selected'
            | 'on_on_ramp_transfer_success_close_click'
    }
>

type Data = {
    offRampTransactions: OffRampTransaction[]
    onRampTransactions: OnRampTransaction[]
    portfolioMap: PortfolioMap
    unblockUser: UnblockUser
}

const fetch = async ({
    portfolioMap,
    bankTransferInfo,
    unblockLoginInfo,
    unblockLoginSignature,
    customCurrencies,
    networkMap,
    networkRPCMap,
}: {
    portfolioMap: PortfolioMap
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    unblockLoginSignature: UnblockLoginSignature
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): Promise<Data> => {
    const [unblockUser, transactions, completePortfolioMap] = await Promise.all(
        [
            fetchUser({ unblockLoginInfo, unblockLoginSignature }),
            fetchUnblockTransactions({
                unblockLoginInfo,
                unblockLoginSignature,
            }),
            portfolioMap[bankTransferInfo.connectedWalletAddress]
                ? portfolioMap
                : fetchPortfolio({
                      address: bankTransferInfo.connectedWalletAddress,
                      customCurrencies,
                      forceRefresh: false,
                      networkMap,
                      networkRPCMap,
                  }).then((portfolio) => ({
                      ...portfolioMap,
                      [bankTransferInfo.connectedWalletAddress]: portfolio,
                  })),
        ]
    )

    return {
        offRampTransactions: transactions.offRampTransactions,
        onRampTransactions: transactions.onRampTransactions,
        portfolioMap: completePortfolioMap,
        unblockUser,
    }
}

export const DepositWithdrawForm = ({
    customCurrencies,
    bankTransferCurrencies,
    accountsMap,
    keystoreMap,
    networkMap,
    installationId,
    sessionPassword,
    offRampAccounts,
    network,
    networkRPCMap,
    loginInfo,
    bankTransferInfo,
    onMsg,
    account,
    portfolioMap,
    feePresetMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            portfolioMap,
            bankTransferInfo,
            unblockLoginInfo: loginInfo,
            unblockLoginSignature: bankTransferInfo.unblockLoginSignature,
            customCurrencies,
            networkMap,
            networkRPCMap,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keystoreMap}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
            return (
                <Form
                    feePresetMap={feePresetMap}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    unblockLoginInfo={loginInfo}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    unblockUser={loadable.data.unblockUser}
                    offRampTransactions={loadable.data.offRampTransactions}
                    onRampTransactions={loadable.data.onRampTransactions}
                    currencies={bankTransferCurrencies}
                    portfolioMap={loadable.data.portfolioMap}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'unblock_offramp_account_created':
                            case 'on_off_ramp_account_become_default':
                            case 'kyc_applicant_created':
                            case 'on_withdrawal_monitor_fiat_transaction_start':
                            case 'on_withdrawal_monitor_fiat_transaction_success':
                            case 'on_withdrawal_monitor_fiat_transaction_failed':
                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_on_ramp_transfer_success_close_click':
                                onMsg(msg)
                                break
                            case 'user_bank_verification_number_successfully_set':
                                setLoadable({
                                    type: 'loaded',
                                    params: loadable.params,
                                    data: {
                                        ...loadable.data,
                                        unblockUser: {
                                            ...loadable.data.unblockUser,
                                            bankVerificationNumber:
                                                msg.bankVerificationNumber,
                                        },
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
        case 'error':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keystoreMap}
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
