import { get } from '@zeal/api/request'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { FXRate } from '@zeal/domains/FXRate'
import { PredefinedNetwork } from '@zeal/domains/Network'
import { object, record, Result, shape } from '@zeal/toolkit/Result'

import { parse as parseRate } from '../helpers/parse'
import { notReachable } from '@zeal/toolkit'

type Response = { rate: FXRate; currencies: KnownCurrencies }

export const parse = (input: unknown): Result<unknown, Response> =>
    object(input).andThen((dto) =>
        shape({
            rate: parseRate(dto.rate),
            currencies: object(dto.currencies).andThen((curriencies) =>
                record(curriencies, parseCurrency)
            ),
        })
    )

export const fetchRate = async ({
    tokenAddress,
    network,
    signal,
}: {
    tokenAddress: string
    network: PredefinedNetwork
    signal?: AbortSignal
}): Promise<{ rate: FXRate; currencies: KnownCurrencies }> => {
    switch (network.type) {
        case 'predefined':
            return get(
                `/wallet/rate/default/${network.name}/${tokenAddress}/`,
                {},
                signal
            ).then((res) =>
                parse(res).getSuccessResultOrThrow('cannot parse rate')
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.type)
    }
}
