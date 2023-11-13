import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { TransactionHash } from '@zeal/domains/Transactions/domains/TransactionHash'
import {
    object,
    oneOf,
    match,
    Result,
    string,
    shape,
    failure,
    success,
    nullable,
} from '@zeal/toolkit/Result'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { generateRandomNumber } from '@zeal/toolkit/Number'

type Params = {
    network: Network
    networkRPCMap: NetworkRPCMap
    transactionHash: TransactionHash
}

export type FailureReason =
    | { type: 'out_of_gas' }
    | { type: 'execution_reverted'; message: string }
    | { type: 'execution_reverted_without_message' }

/**
 * https://coda.io/d/eal_dL_vOIbEHfo/Txn-debugging_su4Ub#_luFqz
 */
const parseFailureReason = (input: unknown): Result<unknown, FailureReason> =>
    object(input).andThen((dto) =>
        oneOf([
            shape({
                error: match(dto.error, 'execution reverted'),
                output: string(dto.output),
            }).andThen(({ output }) => {
                const bytes = output.match(/.{1,2}/g)

                if (!bytes) {
                    return failure('unable_to_match_bytes')
                }

                const message = new TextDecoder()
                    .decode(
                        Uint8Array.from(bytes.map((byte) => parseInt(byte, 16)))
                            .slice(8, 200)
                            .filter(Boolean)
                    )
                    .trim()
                    .replace(/[^\x20-\x7E]+/g, '')
                    .trim()

                return success({
                    type: 'execution_reverted',
                    message,
                })
            }),
            shape({
                error: match(dto.error, 'execution reverted'),
                output: oneOf([nullable(dto.output), match(dto.output, '')]),
            }).map(() => ({ type: 'execution_reverted_without_message' })),
            shape({ error: match(dto.error, 'out of gas') }).map(
                () => ({ type: 'out_of_gas' } as const)
            ),
        ])
    )

export const fetchFailureReason = ({
    network,
    networkRPCMap,
    transactionHash,
}: Params) =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'debug_traceTransaction',
            params: [
                transactionHash.transactionHash,
                {
                    timeout: '1s',
                    tracer: 'callTracer',
                    tracerConfig: {
                        enableMemory: true,
                        enableReturnData: true,
                    },
                },
            ],
        },
    }).then((data) =>
        parseFailureReason(data)
            .mapErrorEntityInfo({ transactionHash })
            .getSuccessResultOrThrow(
                'failed to parse transaction failure reason'
            )
    )
