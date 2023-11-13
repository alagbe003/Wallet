import { ImperativeError } from '@zeal/domains/Error'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { notReachable } from '@zeal/toolkit'
import {
    bigint,
    match,
    nullable,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { SubmitedTransaction, GasInfo } from '../SubmitedTransaction'
import { delay } from '@zeal/toolkit/delay'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { generateRandomNumber } from '@zeal/toolkit/Number'

const getConfirmationBlockCount = (network: Network): bigint => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'Arbitrum':
                case 'zkSync':
                case 'BSC':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Aurora':
                case 'AuroraTestnet':
                case 'Evmos':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'OptimismGoerli':
                case 'FantomTestnet':
                case 'ArbitrumGoerli':
                    return 1n

                case 'PolygonMumbai':
                case 'Polygon':
                case 'PolygonZkevm':
                    return 2n
                default:
                    return notReachable(network)
            }
        case 'custom':
            return 2n
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

type Receipt =
    | { status: 'not_found' }
    | {
          status: 'success' | 'failed'
          blockNumber: string
          gasInfo: ReceiptGasInfo
      }

type ReceiptGasInfo =
    | { type: 'generic'; gasUsed: bigint; effectiveGasPrice: bigint }
    | { type: 'no_gas_price'; gasUsed: bigint }
    | {
          type: 'l2_rollup'
          l1Fee: bigint
          l1FeeScalar: bigint
          l1GasPrice: bigint
          l1GasUsed: bigint
          gasUsed: bigint
      }

type RPCTransactionInfo =
    | {
          status: 'included'
          blockNumber: string
          gasPrice: bigint
      }
    | { status: 'pending' }

const parseTransactionInfo = (
    input: unknown
): Result<unknown, RPCTransactionInfo> =>
    oneOf([
        object(input).andThen((dto) =>
            shape({
                blockNumber: string(dto.blockNumber),
                status: success('included' as const),
                gasPrice: bigint(dto.gasPrice),
            })
        ),
        object(input)
            .andThen((dto) =>
                shape({
                    blockNumber: nullable(dto.blockNumber),
                    status: success('pending' as const),
                })
            )
            .map(({ status }) => ({ status })),
    ])

const parseGasInfo = (input: unknown): Result<unknown, ReceiptGasInfo> =>
    object(input).andThen((dto) =>
        oneOf([
            shape({
                type: success('generic' as const),
                effectiveGasPrice: bigint(dto.effectiveGasPrice),
                gasUsed: bigint(dto.gasUsed),
            }),
            shape({
                type: success('l2_rollup' as const),
                l1Fee: bigint(dto.l1Fee),
                l1FeeScalar: bigint(dto.l1FeeScalar),
                l1GasPrice: bigint(dto.l1GasPrice),
                l1GasUsed: bigint(dto.l1GasUsed),
                gasUsed: bigint(dto.gasUsed),
            }),
            shape({
                type: success('no_gas_price' as const),
                gasUsed: bigint(dto.gasUsed),
            }),
        ])
    )

const parseReceipt = (input: unknown): Result<unknown, Receipt> =>
    oneOf([
        nullable(input).map(() => ({
            status: 'not_found' as const,
        })),
        object(input).andThen((dto) =>
            oneOf([
                shape({
                    status: match(dto.status, '0x1').map(
                        () => 'success' as const
                    ),
                    blockNumber: string(dto.blockNumber),
                    gasInfo: parseGasInfo(dto),
                }),
                shape({
                    status: match(dto.status, '0x0').map(
                        () => 'failed' as const
                    ),
                    blockNumber: string(dto.blockNumber),
                    gasInfo: parseGasInfo(dto),
                }),
            ])
        ),
    ])

const parseBlockTimestamp = (input: unknown): Result<unknown, number> =>
    object(input)
        .andThen((obj) => string(obj.timestamp))
        .map((timestamp) => parseInt(timestamp, 16) * 1000)

const enrichGasInfo = async ({
    gasInfo,
    network,
    networkRPCMap,
    transaction,
}: {
    transaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    gasInfo: ReceiptGasInfo
}): Promise<GasInfo> => {
    switch (gasInfo.type) {
        case 'generic':
            return gasInfo

        case 'no_gas_price': {
            // IF we don't have gasPrice from transaction, we query current gas price from RPC
            const currentGasPrice = bigint(
                await fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_gasPrice',
                        params: [],
                    },
                })
            ).getSuccessResultOrThrow('Failed to parse current gas price')

            return {
                type: 'generic',
                effectiveGasPrice: currentGasPrice,
                gasUsed: gasInfo.gasUsed,
            }
        }

        case 'l2_rollup':
            const transactionByHash = parseTransactionInfo(
                await fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_getTransactionByHash',
                        params: [transaction.hash],
                    },
                })
            ).getSuccessResultOrThrow(
                'failed to parse eth_getTransactionByHash while enriching gasInfo for L2 Rollup'
            )
            switch (transactionByHash.status) {
                case 'pending':
                    throw new ImperativeError(
                        `Impossible to have transaction by hash missing during gasInfo enrich ${transactionByHash.status}`
                    )

                case 'included':
                    return {
                        ...gasInfo,
                        l2GasPrice: transactionByHash.gasPrice,
                    }
                default:
                    return notReachable(transactionByHash)
            }

        default:
            return notReachable(gasInfo)
    }
}

/**
 * https://mermaid.live/edit#pako:eNqdVVFv2jAQ_iuW--JqRVCxl0VbpUG1rg9j1cqewjSZ5EKsOnZmOwNU9b_XiWMSQtgoSCTns7_v7j6f42ccyRhwgFeK5ima3y4Esj8m8sIQklKdXl46132WS63ZkgMh81TJdTnhprTZckBztbkXES9iiFHCOA8ukg_JlTZKPkFwMR6Pa3uwZrFJg_f5poN-ABEzsToPPKUiAs7Pjf2FsrOxU5nlHMwb4C2R0WBwY3FKmzswk-1Xq3g4BJP-XoGZKyo0jQyTws0Mfznk_voeilnBeSjs42SAnHAZPYXL8jkrsiUoxDR6C4X993LkCjQIK08vUR244mt6gJDcGb77DsvziN3GExJ506P6sD7NCm9F_gERsNz0iV5Plao7pj8FqO33tWgIZD3oCn585ZxloA3N8tB6UKUVMt5Xo9usFbg5fO3Cmuw7xXSzObrw0VBT6FGoqzcabUYfl-pmRfVPDXFpQpKA1eIv3FH9oFgEB4w1RUW8V_VO0Wo02bqOGJ6W0nWT0vWJKR0I7DvEnW1CkupdUrQ6tBy6ic8GfUI9e_K_8PvNtr8JvZt3UGuj3VQK263ZP_QrM3w3G7bbrA3qp-rtzu4CL5f_iBPiLV_hidF238OwyhV11HbObssfZ9kddO-wB92bDV8nyG6F39V2yNN2FF_hDFRGWWyvx-fSs8AmhQwWOLBmDAktuFnghXixS2lh5ONWRDgwqoArXOQxNXDLqL1YMxwklGvrhZgZqb65K7e6eV9eAW84oTs
 */

type Params = {
    transaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
}

const FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS = 3000
const FETCH_TRANSACTION_BY_HASH_RETRY_COUNT_TO_REPORT = 15
/**
 * For some networks and RPC implementations due to race condition there is some gap between
 * eth_sendTransactionRaw and eth_getTransactionByHash returning non-null value.
 * This is dirty fix to "ensure" that the "notfound"/"cancel" we receive from RPC is not just sync gap
 * This fix is not affecting user, since users should rarely see this status in the app/widget, 3s ensurance will not change much
 */
const fetchTransactionByHashWithRetry = async ({
    network,
    networkRPCMap,
    transaction,
    retriesDone,
}: Params & { retriesDone: number }): Promise<RPCTransactionInfo> => {
    const response = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transaction.hash],
        },
    })

    const info = nullableOf(
        response,
        parseTransactionInfo
    ).getSuccessResultOrThrow('failed to parse eth_getTransactionByHash')

    if (!info) {
        await delay(FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS)

        if (retriesDone === FETCH_TRANSACTION_BY_HASH_RETRY_COUNT_TO_REPORT) {
            captureError(
                new ImperativeError('Transaction `not_found` after all reties')
            )
        }

        return fetchTransactionByHashWithRetry({
            network,
            networkRPCMap,
            transaction,
            retriesDone: retriesDone + 1,
        })
    }

    return info
}

export const fetchTransaction = async ({
    network,
    networkRPCMap,
    transaction,
}: Params): Promise<SubmitedTransaction> => {
    const transactionInfoResponse = await fetchTransactionByHashWithRetry({
        network,
        networkRPCMap,
        transaction,
        retriesDone: 0,
    })

    switch (transactionInfoResponse.status) {
        case 'pending':
            return {
                state: 'queued',
                hash: transaction.hash,
                queuedAt: transaction.queuedAt,
            }

        case 'included':
            const receipt = await fetchTransactionReceiptWithRetry({
                network,
                networkRPCMap,
                transactionHash: transaction.hash,
                retriesDone: 0,
            })

            switch (receipt.status) {
                case 'not_found':
                    throw new ImperativeError(
                        'eth_getTransactionReceipt not found after included in block '
                    )

                case 'success': {
                    const expectedBlockNumber =
                        BigInt(receipt.blockNumber) +
                        getConfirmationBlockCount(network)

                    const currentBlockResponse = await fetchRPCResponse({
                        network,
                        networkRPCMap,
                        request: {
                            id: generateRandomNumber(),
                            jsonrpc: '2.0',
                            method: 'eth_blockNumber',
                            params: [],
                        },
                    })

                    const currentBlock = bigint(
                        currentBlockResponse
                    ).getSuccessResultOrThrow(
                        'failed to parse eth_blockNumber during confirmation check'
                    )

                    const gasInfo = await enrichGasInfo({
                        gasInfo: receipt.gasInfo,
                        network,
                        networkRPCMap,
                        transaction,
                    })

                    if (currentBlock < expectedBlockNumber) {
                        return {
                            state: 'included_in_block',
                            gasInfo,
                            hash: transaction.hash,
                            queuedAt: transaction.queuedAt,
                        }
                    }

                    const expectedBlockResponse = await fetchRPCResponse({
                        network,
                        networkRPCMap,
                        request: {
                            id: generateRandomNumber(),
                            jsonrpc: '2.0',
                            method: 'eth_getBlockByNumber',
                            params: [
                                `0x${expectedBlockNumber.toString(16)}`,
                                false,
                            ],
                        },
                    })

                    const blockTimestamp = parseBlockTimestamp(
                        expectedBlockResponse
                    ).getSuccessResultOrThrow(
                        'failed to parse eth_getBlockByNumber'
                    )

                    return {
                        state: 'completed',
                        gasInfo,
                        hash: transaction.hash,
                        queuedAt: transaction.queuedAt,
                        completedAt: blockTimestamp,
                    }
                }

                case 'failed': {
                    const blockResponse = await fetchRPCResponse({
                        network,
                        networkRPCMap,
                        request: {
                            id: generateRandomNumber(),
                            jsonrpc: '2.0',
                            method: 'eth_getBlockByNumber',
                            params: [receipt.blockNumber, false],
                        },
                    })

                    const blockTimestamp = parseBlockTimestamp(
                        blockResponse
                    ).getSuccessResultOrThrow(
                        'failed to parse eth_getBlockByNumber'
                    )
                    return {
                        state: 'failed',
                        gasInfo: await enrichGasInfo({
                            gasInfo: receipt.gasInfo,
                            network,
                            networkRPCMap,
                            transaction,
                        }),
                        hash: transaction.hash,
                        queuedAt: transaction.queuedAt,
                        failedAt: blockTimestamp,
                    }
                }

                default:
                    return notReachable(receipt)
            }

        default:
            return notReachable(transactionInfoResponse)
    }
}

const FETCH_TRANSACTION_RECEIPT_RETRY_MAX_COUNT = 3

const fetchTransactionReceiptWithRetry = async ({
    network,
    networkRPCMap,
    transactionHash,
    retriesDone,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    transactionHash: string
    retriesDone: number
}): Promise<Receipt> => {
    const receiptResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
        },
    })

    const receipt = await parseReceipt(receiptResponse).getSuccessResultOrThrow(
        'failed to parse eth_getTransactionReceipt'
    )

    switch (receipt.status) {
        case 'not_found':
            if (retriesDone >= FETCH_TRANSACTION_RECEIPT_RETRY_MAX_COUNT) {
                return receipt
            }

            return fetchTransactionReceiptWithRetry({
                network,
                networkRPCMap,
                transactionHash,
                retriesDone: retriesDone + 1,
            })

        case 'success':
        case 'failed':
            return receipt

        default:
            return notReachable(receipt)
    }
}
