import {
    CryptoCurrency,
    Currency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { USD } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { NetworkHexId } from '@zeal/domains/Network'
import { values } from '@zeal/toolkit/Object'

type FiatCurrencyCode = 'GBP' | 'EUR' | 'NGN'
export type BankTransferFiatCurrencies = Record<FiatCurrencyCode, FiatCurrency>

const UNBLOCK_FIAT_CURRENCIES_MAP: BankTransferFiatCurrencies = {
    GBP: {
        type: 'FiatCurrency',
        id: 'GBP',
        symbol: '£',
        code: 'GBP',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'British Pound',
    },
    EUR: {
        type: 'FiatCurrency',
        id: 'EUR',
        symbol: '€',
        code: 'EUR',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'Euro',
    },
    NGN: {
        type: 'FiatCurrency',
        id: 'NGN',
        symbol: '₦',
        code: 'NGN',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'Nigerian Naira',
    },
}

export type BankTransferCurrencies = {
    defaultCryptoCurrency: CryptoCurrency
    fiatCurrencies: BankTransferFiatCurrencies
    knownCurrencies: KnownCurrencies
}

const POLYGON_USDC: CryptoCurrency = {
    type: 'CryptoCurrency',
    id: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC',
    code: 'USDC',
    fraction: 6,
    rateFraction: 6,
    icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    name: 'USD Coin (PoS)',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    networkHexChainId: '0x89' as NetworkHexId,
}

export const fetchBankTransferCurrencies =
    (): Promise<BankTransferCurrencies> =>
        new Promise<BankTransferCurrencies>((resolve) => {
            const defaultCryptoCurrency = POLYGON_USDC

            const knownCurrencies = [
                defaultCryptoCurrency,
                USD,
                ...values(UNBLOCK_FIAT_CURRENCIES_MAP),
            ].reduce((record, currency) => {
                record[currency.id] = currency
                return record
            }, {} as Record<CurrencyId, Currency>)

            resolve({
                fiatCurrencies: UNBLOCK_FIAT_CURRENCIES_MAP,
                defaultCryptoCurrency,
                knownCurrencies,
            })
        })
