import { failure, object, Result, success } from '@zeal/toolkit/Result'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { post } from '@zeal/api/request'
import { RPCRequest } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { post as customRPCPost } from '@zeal/api/customRPCClient'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { getNetworkRPC } from '@zeal/domains/Network/helpers/getNetworkRPC'

const parseRPCResponse = (input: unknown): Result<unknown, unknown> =>
    object(input).andThen((obj) => {
        return obj.error ? failure(obj.error) : success(obj.result)
    })

export const proxyRPCResponse = ({
    request,
    networkRPCMap,
    network,
    dAppSiteInfo,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap

    network: Network
    dAppSiteInfo: DAppSiteInfo
}) => fetch({ request, networkRPCMap, network, dAppSiteInfo })

export const fetchRPCResponse = ({
    request,
    networkRPCMap,
    network,
    signal,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap
    network: Network
    signal?: AbortSignal
}): Promise<unknown> =>
    fetch({ request, networkRPCMap, network, dAppSiteInfo: null, signal })

const fetch = async ({
    request,
    networkRPCMap,
    network,
    dAppSiteInfo,
    signal,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap
    network: Network
    dAppSiteInfo: DAppSiteInfo | null
    signal?: AbortSignal
}): Promise<unknown> => {
    const networkRPC = getNetworkRPC({ network, networkRPCMap })

    switch (networkRPC.current.type) {
        case 'default':
            switch (network.type) {
                case 'predefined':
                case 'testnet':
                    return post(
                        '/wallet/rpc/',
                        {
                            query: { network: network.name },
                            body: request,
                            requestSource: dAppSiteInfo?.hostname,
                        },
                        signal
                    ).then((res) =>
                        parseRPCResponse(res).getSuccessResultOrThrow(
                            'RPC request failed'
                        )
                    )
                case 'custom':
                    const res = await customRPCPost(
                        network.rpcUrl,
                        request,
                        signal
                    )
                    return parseRPCResponse(res).getSuccessResultOrThrow(
                        'custom network default RPC request failed'
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
            const res = await customRPCPost(networkRPC.current.url, request)
            return parseRPCResponse(res).getSuccessResultOrThrow(
                'custom RPC request failed'
            )

        default:
            return notReachable(networkRPC.current)
    }
}
