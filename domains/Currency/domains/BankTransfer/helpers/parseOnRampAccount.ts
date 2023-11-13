import { OnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { parseBankDetails } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseBankDetails'
import {
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'
import { BankTransferFiatCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'

export const parseOnRampAccount = (
    input: unknown,
    fiatCurrencies: BankTransferFiatCurrencies
): Result<unknown, OnRampAccount> =>
    object(input).andThen((obj) =>
        shape({
            type: success('on_ramp_account' as const),
            uuid: string(obj.uuid),
            currency: oneOf([
                match(obj.currency, 'EUR').map(() => fiatCurrencies.EUR),
                match(obj.currency, 'GBP').map(() => fiatCurrencies.GBP),
                match(obj.currency, 'NGN').map(() => fiatCurrencies.NGN),
            ]),
            bankDetails: parseBankDetails(obj),
        })
    )
