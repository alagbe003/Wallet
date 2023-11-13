import {
    object,
    Result,
    shape,
    string,
    number,
    match,
    oneOf,
    recordStrict,
} from '@zeal/toolkit/Result'
import {
    CryptoCurrency,
    Currency,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'

export const parse = (input: unknown): Result<unknown, Currency> =>
    object(input).andThen((obj) =>
        oneOf([parseFiatCurrency(obj), parseCryptoCurrency(obj)])
    )

export const parseKnownCurrencies = (
    input: unknown
): Result<unknown, KnownCurrencies> =>
    object(input).andThen((curriencies) =>
        recordStrict(curriencies, {
            keyParser: string,
            valueParser: parse,
        })
    )

export const parseFiatCurrency = (
    obj: Record<string, unknown>
): Result<unknown, FiatCurrency> =>
    shape({
        type: match(obj.type, 'FiatCurrency' as const),
        id: string(obj.id),
        symbol: string(obj.symbol),
        code: string(obj.code),
        fraction: number(obj.fraction),
        rateFraction: number(obj.rateFraction),
        icon: string(obj.icon),
        name: string(obj.name),
    })

export const parseCryptoCurrency = (
    obj: Record<string, unknown>
): Result<unknown, CryptoCurrency> =>
    shape({
        type: match(obj.type, 'CryptoCurrency' as const),
        id: string(obj.id),
        networkHexChainId: oneOf([
            parseNetworkHexId(obj.network),
            parseNetworkHexId(obj.networkHexChainId),
        ]),
        address: parseAddress(obj.address),
        symbol: string(obj.symbol),
        code: string(obj.code),
        fraction: number(obj.fraction),
        rateFraction: number(obj.rateFraction),
        icon: string(obj.icon),
        name: string(obj.name),
    })
