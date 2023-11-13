import {
    array,
    boolean,
    combine,
    match,
    notDefined,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    arrayOf,
    safeArrayOf,
    parseHttpsUrl,
    nonEmptyArray,
} from '@zeal/toolkit/Result'
import {
    DebugTraceTransaction,
    Web3ClientVersion,
    EthAccounts,
    EthBlockNumber,
    EthCall,
    EthChainId,
    EthEstimateGas,
    EthGasPrice,
    EthGetBalance,
    EthGetBlockByNumber,
    EthGetCode,
    EthGetTransactionByHash,
    EthGetTransactionCount,
    EthGetTransactionReceipt,
    EthLogs,
    EthRequestAccounts,
    EthSendRawTransaction,
    EthSendTransaction,
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    NetVersion,
    PersonalECRecover,
    PersonalSign,
    RPCRequest,
    WalletAddEthereumChain,
    WalletSwitchEthereumChain,
    WalletWatchAsset,
    EthGetStorageAt,
    EthCoinbase,
} from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

// Helpers
const parseChainId = (
    params: unknown
): Result<unknown, [{ chainId: string }]> =>
    array(params)
        .andThen(([param]) => object(param))
        .andThen((param) =>
            shape({
                chainId: string(param.chainId),
            })
        )
        .map((param): [{ chainId: string }] => [param])

const parseSingleStringParam = (params: unknown): Result<unknown, [string]> =>
    array(params)
        .andThen(([param]) => string(param))
        .map((s): [string] => [s])

// Main methods

export const parseRPCRequest = (
    input: unknown
): Result<unknown, RPCRequest> => {
    const r: RPCRequest = {
        method: 'eth_blockNumber',
    } as EthBlockNumber as any

    // to make sure we are adding parser to array when extending main type
    switch (r.method) {
        case 'eth_accounts':
        case 'eth_sendRawTransaction':
        case 'eth_sendTransaction':
        case 'eth_requestAccounts':
        case 'eth_chainId':
        case 'eth_coinbase':
        case 'eth_blockNumber':
        case 'eth_call':
        case 'eth_estimateGas':
        case 'eth_getLogs':
        case 'eth_getTransactionReceipt':
        case 'eth_getTransactionByHash':
        case 'wallet_switchEthereumChain':
        case 'wallet_addEthereumChain':
        case 'debug_traceTransaction':
        case 'personal_sign':
        case 'eth_gasPrice':
        case 'eth_getBlockByNumber':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData':
        case 'eth_getTransactionCount':
        case 'eth_getCode':
        case 'net_version':
        case 'eth_getBalance':
        case 'personal_ecRecover':
        case 'eth_signTypedData_v3':
        case 'web3_clientVersion':
        case 'wallet_watchAsset':
        case 'eth_getStorageAt':
            break
        /* istanbul ignore next */
        default:
            return notReachable(r)
    }

    return object(input).andThen((obj) =>
        oneOf([
            oneOf([
                parseEthAccounts(obj),
                parseEthBlockNumber(obj),
                parseEthCall(obj),
                parseEthChainId(obj),
                parseEthEstimateGas(obj),
                parseEthGetTransactionReceipt(obj),
                parseEthLogs(obj),
                parseEthRequestAccounts(obj),
                parseEthSendRawTransaction(obj),
                parseEthSendTransaction(obj),
            ]),
            oneOf([
                parseDebugTranceTransaction(obj),
                parseEthGasPrice(obj),
                parseEthGetBlockByNumber(obj),
                parseEthGetTransactionByHash(obj),
                parseEthGetTransactionCount(obj),
                parseEthSignTypedDataV4(obj),
                parsePersonalECRecover(obj),
                parsePersonalSign(obj),
                parseWalletAddEthereumChain(obj),
                parseWalletSwitchEthereumChain(obj),
            ]),
            oneOf([
                parseEthGetBalance(obj),
                parseEthGetCode(obj),
                parseNetVersion(obj),
                parseEthSignTypedData(obj),
                parseEthSignTypedDataV3(obj),
                parseWeb3ClientVersion(obj),
                parseWalletWatchAsset(obj),
                parseEthGetStorageAt(obj),
                parseEthCoinbase(obj),
            ]),
        ])
    )
}

export const parseEthGetStorageAt = (
    obj: Record<string, unknown>
): Result<unknown, EthGetStorageAt> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getStorageAt' as const),
        params: array(obj.params)
            .andThen(([address, position, block]) =>
                shape({
                    address: string(address),
                    position: string(position),
                    block: string(block),
                })
            )
            .map(({ address, position, block }): [string, string, string] => [
                address,
                position,
                block,
            ]),
    })

export const parseWalletWatchAsset = (
    obj: Record<string, unknown>
): Result<unknown, WalletWatchAsset> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_watchAsset' as const),
        params: success([] as []),
    })

export const parseWeb3ClientVersion = (
    obj: Record<string, unknown>
): Result<unknown, Web3ClientVersion> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'web3_clientVersion' as const),
        params: success([] as []),
    })

export const parseEthGetBalance = (
    obj: Record<string, unknown>
): Result<unknown, EthGetBalance> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getBalance' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: string(block),
                })
            )
            .map(({ address, block }): [string, string] => [address, block]),
    })

export const parseNetVersion = (
    obj: Record<string, unknown>
): Result<unknown, NetVersion> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'net_version' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionCount = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionCount> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionCount' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: oneOf([string(block), notDefined(block)]),
                })
            )
            .map(({ address, block }): [string, string | undefined] => [
                address,
                block,
            ]),
    })

export const parseEthGetCode = (
    obj: Record<string, unknown>
): Result<unknown, EthGetCode> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getCode' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: oneOf([string(block), notDefined(block)]),
                })
            )
            .map(({ address, block }): [string, string | undefined] => [
                address,
                block,
            ]),
    })

export const parseWalletAddEthereumChain = (
    obj: Record<string, unknown>
): Result<unknown, WalletAddEthereumChain> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_addEthereumChain' as const),
        params: array(obj.params).andThen(([data]) =>
            object(data)
                .andThen((requestData) =>
                    shape({
                        chainId: parseNetworkHexId(requestData.chainId),
                        iconUrls: oneOf([
                            arrayOf(requestData.iconUrls, string),
                            notDefined(requestData.iconUrls),
                        ]),
                        // according to spec this all props below are optional but we cannot really operate without it
                        blockExplorerUrls: safeArrayOf(
                            requestData.blockExplorerUrls,
                            (input: unknown) =>
                                string(input).andThen(parseHttpsUrl)
                        ).andThen(nonEmptyArray),
                        chainName: string(requestData.chainName),
                        nativeCurrency: object(
                            requestData.nativeCurrency
                        ).andThen((o) =>
                            shape({
                                name: string(o.name),
                                symbol: string(o.symbol),
                                decimals: number(o.decimals),
                            })
                        ),
                        rpcUrls: arrayOf(requestData.rpcUrls, string),
                    })
                )
                .map((data): [WalletAddEthereumChain['params'][0]] => [data])
        ),
    })

export const parsePersonalSign = (
    obj: Record<string, unknown>
): Result<unknown, PersonalSign> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'personal_sign' as const),
        params: array(obj.params)
            .andThen(([message, account]) =>
                combine([string(message), string(account)])
            )
            .map(([message, account]): [string, string] => [message, account]),
    })

export const parsePersonalECRecover = (
    obj: Record<string, unknown>
): Result<unknown, PersonalECRecover> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'personal_ecRecover' as const),
        params: array(obj.params)
            .andThen(([message, signature]) =>
                combine([string(message), string(signature)])
            )
            .map(([message, signature]): [string, string] => [
                message,
                signature,
            ]),
    })

export const parseEthSignTypedDataV4 = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedDataV4> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData_v4' as const),
        params: array(obj.params)
            .andThen(([message, account]) =>
                combine([string(message), string(account)])
            )
            .map(([message, account]): [string, string] => [message, account]),
    })

export const parseEthSignTypedDataV3 = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedDataV3> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData_v3' as const),
        params: array(obj.params)
            .andThen(([message, account]) =>
                combine([string(message), string(account)])
            )
            .map(([message, account]): [string, string] => [message, account]),
    })

export const parseEthSignTypedData = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedData> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData' as const),
        params: array(obj.params).andThen(([message, account]) =>
            shape({
                message: oneOf([
                    string(message),
                    array(message).map(JSON.stringify),
                ]),
                account: string(account),
            }).map((params): [string, string] => [
                params.account,
                params.message,
            ])
        ),
    })

export const parseDebugTranceTransaction = (
    obj: Record<string, unknown>
): Result<unknown, DebugTraceTransaction> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'debug_traceTransaction' as const),
        params: array(obj.params).andThen(([trx, debugConfig]) =>
            shape({
                trx: string(trx),
                debugConfig: object(debugConfig).andThen((dto) =>
                    shape({
                        tracer: match(dto.tracer, 'callTracer' as const),
                        timeout: string(dto.timeout),
                        tracerConfig: object(dto.tracerConfig).andThen(
                            (tracerConfig) =>
                                shape({
                                    enableMemory: boolean(
                                        tracerConfig.enableMemory
                                    ),
                                    enableReturnData: boolean(
                                        tracerConfig.enableReturnData
                                    ),
                                })
                        ),
                    })
                ),
            }).map(({ trx, debugConfig }): DebugTraceTransaction['params'] => [
                trx,
                debugConfig,
            ])
        ),
    })

export const parseWalletSwitchEthereumChain = (
    obj: Record<string, unknown>
): Result<unknown, WalletSwitchEthereumChain> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_switchEthereumChain' as const),
        params: parseChainId(obj.params),
    })

export const parseEthLogs = (
    obj: Record<string, unknown>
): Result<unknown, EthLogs> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getLogs' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionReceipt = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionReceipt> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionReceipt' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthEstimateGas = (
    obj: Record<string, unknown>
): Result<unknown, EthEstimateGas> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_estimateGas' as const),
        params: array(obj.params),
    })

export const parseEthSendTransaction = (
    obj: Record<string, unknown>
): Result<unknown, EthSendTransaction> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_sendTransaction' as const),
        param: array(obj.params)
            .map((arr) => arr[0])
            .andThen((param) => object(param))
            .andThen((param) =>
                shape({
                    from: string(param.from),
                    data: oneOf([string(param.data), success('')]),
                    to: oneOf([string(param.to), notDefined(param.to)]),
                    gas: oneOf([string(param.gas), notDefined(param.gas)]),
                    value: oneOf([
                        string(param.value),
                        notDefined(param.value),
                    ]),
                    nonce: oneOf([
                        string(param.nonce),
                        notDefined(param.nonce),
                    ]),
                })
            ),
    }).map(({ jsonrpc, id, method, param }) => ({
        id,
        jsonrpc,
        method,
        params: [param],
    }))

export const parseEthSendRawTransaction = (
    obj: Record<string, unknown>
): Result<unknown, EthSendRawTransaction> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_sendRawTransaction' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthRequestAccounts = (
    obj: Record<string, unknown>
): Result<unknown, EthRequestAccounts> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_requestAccounts' as const),
        params: success([] as []),
    })

export const parseEthChainId = (
    obj: Record<string, unknown>
): Result<unknown, EthChainId> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_chainId' as const),
        params: success([] as []),
    })

export const parseEthCoinbase = (
    obj: Record<string, unknown>
): Result<unknown, EthCoinbase> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_coinbase' as const),
        params: success([] as []),
    })

export const parseEthAccounts = (
    obj: Record<string, unknown>
): Result<unknown, EthAccounts> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_accounts' as const),
        params: success([] as []),
    })

export const parseEthCall = (
    obj: Record<string, unknown>
): Result<unknown, EthCall> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_call' as const),
        params: array(obj.params),
    })

export const parseEthBlockNumber = (
    obj: Record<string, unknown>
): Result<unknown, EthBlockNumber> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_blockNumber' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionByHash = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionByHash> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionByHash' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthGasPrice = (
    obj: Record<string, unknown>
): Result<unknown, EthGasPrice> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_gasPrice' as const),
        params: oneOf([array(obj.params), success([])]),
    })

export const parseEthGetBlockByNumber = (
    obj: Record<string, unknown>
): Result<unknown, EthGetBlockByNumber> =>
    shape({
        id: number(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getBlockByNumber' as const),
        params: array(obj.params)
            .andThen(([quantityOrTag, isFullTransaction]) =>
                shape({
                    quantityOrTag: string(quantityOrTag),
                    isFullTransaction: boolean(isFullTransaction),
                })
            )
            .map(({ quantityOrTag, isFullTransaction }): [string, boolean] => [
                quantityOrTag,
                isFullTransaction,
            ]),
    })
