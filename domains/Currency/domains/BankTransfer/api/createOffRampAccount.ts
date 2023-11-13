import { get, post } from '@zeal/api/request'
import { Country } from '@zeal/domains/Country'
import { FiatCurrency } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    UnblockLoginSignature,
    UserInputForBankDetails,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOffRampAccount'
import { notReachable } from '@zeal/toolkit'
import { object, string } from '@zeal/toolkit/Result'

export type CreateOffRampAccountRequest = {
    country: Country
    currency: FiatCurrency
    bankDetails: UserInputForBankDetails
}

const fetchOffRampAccount = ({
    accountUuid,
    unblockLoginInfo,
    unblockLoginSignature,
    currencies,
    signal,
}: {
    accountUuid: string
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OffRampAccount> =>
    get(
        '/wallet/unblock/',
        {
            query: {
                path: `/user/bank-account/remote/${accountUuid}`,
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        parseOffRampAccount(
            data,
            currencies.fiatCurrencies
        ).getSuccessResultOrThrow('Failed to parse offramp account')
    )

export const createOffRampAccount = ({
    account,
    unblockLoginInfo,
    unblockLoginSignature,
    currencies,
    signal,
}: {
    account: CreateOffRampAccountRequest
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OffRampAccount> =>
    post(
        '/wallet/unblock/',
        {
            query: {
                path: `/user/bank-account/remote`,
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                account_country: account.country.code,
                beneficiary_country: account.country.code,
                main_beneficiary: true,
                account_details: (() => {
                    switch (account.bankDetails.type) {
                        case 'ngn':
                            return {
                                currency: account.currency.code,
                                account_number:
                                    account.bankDetails.accountNumber,
                                bank_code: account.bankDetails.bankCode,
                            }
                        case 'uk':
                            return {
                                currency: account.currency.code,
                                account_number:
                                    account.bankDetails.accountNumber,
                                sort_code: account.bankDetails.sortCode,
                            }
                        case 'iban':
                            return {
                                currency: account.currency.code,
                                iban: account.bankDetails.iban,
                            }
                        default:
                            notReachable(account.bankDetails)
                    }
                })(),
            },
        },
        signal
    )
        .then((data) =>
            object(data)
                .andThen((obj) => string(obj.uuid))
                .getSuccessResultOrThrow(
                    'Failed to parse offramp account uuid after creation'
                )
        )
        .then((uuid) =>
            fetchOffRampAccount({
                accountUuid: uuid,
                unblockLoginInfo,
                unblockLoginSignature,
                currencies,
                signal,
            })
        )
