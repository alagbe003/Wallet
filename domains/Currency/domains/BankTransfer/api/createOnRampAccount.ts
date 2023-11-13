import { post } from '@zeal/api/request'
import { FiatCurrency } from '@zeal/domains/Currency'
import {
    OnRampAccount,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'

import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOnRampAccount'

export const createOnRampAccount = ({
    currency,
    unblockLoginInfo,
    currencies,
    unblockLoginSignature,
    signal,
}: {
    currency: FiatCurrency
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OnRampAccount> => {
    return post(
        '/wallet/unblock/',
        {
            query: {
                path: `/user/bank-account/unblock`,
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                currency: currency.code,
            },
        },
        signal
    ).then((response) =>
        parseOnRampAccount(
            response,
            currencies.fiatCurrencies
        ).getSuccessResultOrThrow('Failed to parse onramp account')
    )
}
