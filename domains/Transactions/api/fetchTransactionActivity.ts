import { Address } from '@zeal/domains/Address'
import { TransactionActivity } from '@zeal/domains/Transactions'
import { get } from '@zeal/api/request'
import {
    array,
    combine,
    nullableOf,
    number,
    object,
    record,
    shape,
} from '@zeal/toolkit/Result'
import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { parseActivityTransaction } from '@zeal/domains/Transactions/helpers/parseActivityTransaction'
import { CurrentNetwork } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

type Request = {
    address: Address
    timestampLessThan: number
    scam: boolean
    selectedNetwork: CurrentNetwork
    signal?: AbortSignal
}

export const fetchTransactionActivity = async ({
    address,
    timestampLessThan,
    selectedNetwork,
    scam,
    signal,
}: Request): Promise<TransactionActivity> => {
    const response = await get(
        `/wallet/transaction/activity/${address}/`,
        {
            query: {
                timestampLessThan,
                scam,
            },
        },
        signal
    ).then((resp) =>
        object(resp)
            .andThen((obj) =>
                shape({
                    continueFromTimestamp: nullableOf(
                        obj.continueFromTimestamp,
                        number
                    ),
                    transactions: array(obj.transactions).andThen((arr) =>
                        combine(arr.map(parseActivityTransaction))
                    ),
                    currencies: object(obj.currencies).andThen((curriencies) =>
                        record(curriencies, parseCurrency)
                    ),
                })
            )
            .map((data) => ({
                ...data,
                transactions: data.transactions.filter((trx) => {
                    switch (selectedNetwork.type) {
                        case 'all_networks':
                            return true
                        case 'specific_network':
                            return (
                                selectedNetwork.network.hexChainId ===
                                trx.networkHexId
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedNetwork)
                    }
                }),
            }))
            .getSuccessResultOrThrow('cannot parse transaction history')
    )

    return !response.transactions.length && response.continueFromTimestamp
        ? fetchTransactionActivity({
              address,
              scam,
              signal,
              selectedNetwork,
              timestampLessThan: response.continueFromTimestamp,
          })
        : response
}
