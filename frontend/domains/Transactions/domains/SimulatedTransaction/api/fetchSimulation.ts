import { post } from '@zeal/api/request'
import { Network } from '@zeal/domains/Network'
import { parseSimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseSimulateTransactionResponse'
import { SimulateTransactionResponse } from '../SimulateTransactionResponse'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

export type SimulationResult =
    | { type: 'failed' }
    | { type: 'not_supported' }
    | {
          type: 'simulated'
          simulation: SimulateTransactionResponse
      }

export const fetchSimulationByRequest = ({
    network,
    rpcRequest,
}: {
    network: Network
    rpcRequest: EthSendTransaction
}): Promise<SimulationResult> => {
    if (!network.isSimulationSupported) {
        return Promise.resolve({ type: 'not_supported' })
    }

    return post('/wallet/transaction/simulate/', {
        query: { network: network.name },
        body: rpcRequest.params[0],
    })
        .then((data) => {
            const simulation = parseSimulateTransactionResponse(
                data
            ).getSuccessResultOrThrow('failed to parse simulation response')

            return { type: 'simulated' as const, simulation }
        })
        .catch((e) => {
            captureError(e)

            return { type: 'failed' as const }
        })
}
