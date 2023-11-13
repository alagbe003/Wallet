import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { parseRpcTransaction } from '@zeal/domains/Transactions/helpers/parseRpcTransaction'
import { RpcTransaction } from '@zeal/domains/Transactions'

type Params = {
    transactionHash: string
    network: Network
    networkRPCMap: NetworkRPCMap
}

export const fetchTransactionByHash = async ({
    transactionHash,
    network,
    networkRPCMap,
}: Params): Promise<RpcTransaction> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionHash],
        },
    }).then((response) =>
        parseRpcTransaction(response).getSuccessResultOrThrow(
            'failed to parse eth_getTransactionByHash'
        )
    )
