import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OffRampAccount,
    OnRampTransaction,
    UnblockLoginSignature,
    UnblockTransferFee,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import {
    fetchTransactionFee,
    OnRampFeeParams,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { fetchUnblockFXRate } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockFXRate'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    currencies: BankTransferCurrencies
    offRampAccounts: OffRampAccount[]
    onRampTransactions: OnRampTransaction[]
    portfolioMap: PortfolioMap
    unblockUser: UnblockUser
    network: Network
    keyStoreMap: KeyStoreMap
    loginInfo: UnblockLoginInfo
    account: Account
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Layout>,
          {
              type: 'on_withdraw_tab_click' | 'on_submit_form_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'kyc_applicant_created'
                  | 'user_bank_verification_number_successfully_set'
          }
      >

const calculateInitialForm = ({
    offRampAccounts,
    currencies,
}: {
    offRampAccounts: OffRampAccount[]
    currencies: BankTransferCurrencies
}): OnRampFeeParams => {
    const defaultOffRampAccount = offRampAccounts.find(
        (account) => account.mainBeneficiary
    )

    if (!defaultOffRampAccount) {
        throw new ImperativeError(
            'At least one off-ramp account is needed to access the Deposit form'
        )
    }

    return {
        type: 'fiatToCrypto',
        amount: null,
        outputCurrency: currencies.defaultCryptoCurrency,
        inputCurrency: defaultOffRampAccount.currency,
    }
}

export type OnRampFeeResponse = {
    rate: FXRate
    fee: UnblockTransferFee
}

export const fetch = ({
    form,
    unblockLoginSignature,
    signal,
}: {
    form: OnRampFeeParams
    unblockLoginSignature: UnblockLoginSignature
    signal?: AbortSignal
}): Promise<OnRampFeeResponse> => {
    return Promise.all([
        fetchUnblockFXRate({
            feeParams: form,
            unblockLoginSignature,
            signal,
        }),
        fetchTransactionFee({ feeParams: form, unblockLoginSignature, signal }),
    ]).then(([rate, fee]) => ({ rate, fee }))
}

export const Form = ({
    currencies,
    offRampAccounts,
    onRampTransactions,
    account,
    portfolioMap,
    unblockUser,
    network,
    loginInfo,
    keyStoreMap,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    const [pollable, setPollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                form: calculateInitialForm({
                    offRampAccounts,
                    currencies,
                }),
                unblockLoginSignature: bankTransferInfo.unblockLoginSignature,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 30000,
        }
    )

    return (
        <>
            <Layout
                currencies={currencies}
                unblockUser={unblockUser}
                network={network}
                keyStoreMap={keyStoreMap}
                pollable={pollable}
                portfolioMap={portfolioMap}
                account={account}
                offRampAccounts={offRampAccounts}
                onRampTransactions={onRampTransactions}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_amount_change':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        amount: msg.amount,
                                    },
                                },
                            })
                            break
                        case 'on_withdraw_tab_click':
                            onMsg(msg)
                            break
                        case 'on_currency_selector_click':
                            setState({ type: 'currency_selector' })
                            break
                        case 'on_fee_info_click':
                            setState({ type: 'transfer_fee_info' })
                            break
                        case 'on_time_info_click':
                            setState({ type: 'transfer_time_info' })
                            break
                        case 'on_submit_form_click':
                            onMsg(msg)
                            break
                        case 'on_kyc_banner_click':
                            setState({ type: 'request_KYC' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                loginInfo={loginInfo}
                bankTransferInfo={bankTransferInfo}
                unblockUser={unblockUser}
                currencies={currencies}
                state={state}
                pollable={pollable}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_currency_selected':
                            setState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        amount: '0',
                                        inputCurrency: msg.currency,
                                    },
                                },
                            })
                            break
                        case 'user_bank_verification_number_successfully_set':
                            setState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        amount: '0',
                                        inputCurrency: msg.currency,
                                    },
                                },
                            })
                            onMsg(msg)
                            break
                        case 'on_get_started_clicked':
                        case 'on_kyc_try_again_clicked':
                            setState({ type: 'KYC_process' })
                            break
                        case 'kyc_applicant_created':
                            onMsg(msg)
                            break
                        case 'kyc_data_updated':
                            onMsg({ type: 'close' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
