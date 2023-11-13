import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { parse as parseFXRate } from '@zeal/domains/FXRate/helpers/parse'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { Token } from '@zeal/domains/Token'
import {
    boolean,
    match,
    nullable,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

export const parse = (input: unknown): Result<unknown, Token> =>
    object(input).andThen((obj) =>
        shape({
            networkHexId: oneOf([
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            scam: oneOf([boolean(obj.scam), success(false)]),
            rate: oneOf([parseFXRate(obj.rate), nullable(obj.rate)]),
            address: string(obj.address).andThen(parseAddressFromString),
            balance: parseMoney(obj.balance),
            priceInDefaultCurrency: oneOf([
                parseMoney(obj.priceInDefaultCurrency),
                nullable(obj.priceInDefaultCurrency),
            ]),
            marketData: nullableOf(obj.marketData, (marketData) =>
                object(marketData).andThen((marketDataObj) =>
                    shape({
                        priceChange24h: object(
                            marketDataObj.priceChange24h
                        ).andThen((priceChange24hObj) =>
                            oneOf([
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Unchanged' as const
                                    ),
                                }),
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Up' as const
                                    ),
                                    percentage: number(
                                        priceChange24hObj.percentage
                                    ),
                                }),
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Down' as const
                                    ),
                                    percentage: number(
                                        priceChange24hObj.percentage
                                    ),
                                }),
                            ])
                        ),
                    })
                )
            ),
        })
    )
