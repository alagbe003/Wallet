import { get } from '@zeal/api/request'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { FetchTransactionFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { FXRate } from '@zeal/domains/FXRate'
import { number, object } from '@zeal/toolkit/Result'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { notReachable } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/domains/Error'
import { CryptoCurrency } from '@zeal/domains/Currency'

export const fetchUnblockFXRate = ({
    feeParams,
    unblockLoginSignature,
    signal,
}: {
    feeParams: FetchTransactionFeeParams
    unblockLoginSignature: UnblockLoginSignature
    signal?: AbortSignal
}): Promise<FXRate> =>
    get(
        '/wallet/unblock/',
        {
            query: {
                path: `/exchange-rates/?${getQueryParams(feeParams)}`,
            },
            auth: {
                type: 'message_and_signature',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
            },
        },
        signal
    ).then((data): FXRate => {
        const rate = object(data)
            .andThen((obj) => number(obj.exchange_rate))
            .getSuccessResultOrThrow('Failed to parse exchange rate')

        return {
            rate: amountToBigint(
                rate.toString(),
                feeParams.outputCurrency.rateFraction
            ),
            base: feeParams.inputCurrency.id,
            quote: feeParams.outputCurrency.id,
        }
    })

export const getQueryParams = (params: FetchTransactionFeeParams): string => {
    switch (params.type) {
        case 'fiatToCrypto':
            return new URLSearchParams({
                base_currency: params.inputCurrency.code,
                target_currency: fiatCodeFromCryptoCurrency(
                    params.outputCurrency
                ),
            }).toString()

        case 'cryptoToFiat':
            return new URLSearchParams({
                base_currency: fiatCodeFromCryptoCurrency(params.inputCurrency),
                target_currency: params.outputCurrency.code,
            }).toString()

        default:
            return notReachable(params)
    }
}
const fiatCodeFromCryptoCurrency = (cryptoCurrency: CryptoCurrency): string => {
    switch (cryptoCurrency.code) {
        case 'USDC':
            return 'USD'

        default:
            throw new ImperativeError(
                'Using non-supported crypto in fxrate request'
            )
    }
}
