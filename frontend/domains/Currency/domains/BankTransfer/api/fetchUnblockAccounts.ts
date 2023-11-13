import { get } from '@zeal/api/request'
import {
    OffRampAccount,
    OnRampAccount,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOffRampAccount'
import { parseOnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOnRampAccount'
import { array, combine } from '@zeal/toolkit/Result'

type Params = {
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
}

export const fetchOffRampAccounts = ({
    unblockLoginInfo,
    unblockLoginSignature,
    signal,
    currencies,
}: Params & { signal?: AbortSignal }): Promise<OffRampAccount[]> =>
    get(
        '/wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/remote',
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
        array(data)
            .andThen((arr) =>
                combine(
                    arr.map((val) =>
                        parseOffRampAccount(val, currencies.fiatCurrencies)
                    )
                )
            )
            .getSuccessResultOrThrow('Failed to parse offramp accounts')
    )

export const fetchOnRampAccounts = ({
    unblockLoginInfo,
    unblockLoginSignature,
    signal,
    currencies,
}: Params & { signal?: AbortSignal }): Promise<OnRampAccount[]> => {
    const { message, signature } = unblockLoginSignature
    return get(
        '/wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/unblock',
            },
            auth: {
                type: 'unblock_auth',
                message,
                signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        array(data)
            .andThen((arr) =>
                combine(
                    arr.map((val) =>
                        parseOnRampAccount(val, currencies.fiatCurrencies)
                    )
                )
            )
            .getSuccessResultOrThrow('Failed to map onramp accounts')
    )
}
