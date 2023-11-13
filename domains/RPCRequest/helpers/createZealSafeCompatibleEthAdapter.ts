import { Web3Adapter } from '@safe-global/protocol-kit'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'
import { UnexpectedResultFailureError } from '@zeal/toolkit/Result'
import Web3 from 'web3'
import { HttpProvider } from 'web3-core'

type Web3RPCRequest = Omit<
    Parameters<NonNullable<HttpProvider['send']>>[0],
    'id'
> & { id: string | number }

type Web3RPCResponse = NonNullable<
    Parameters<Parameters<NonNullable<HttpProvider['send']>>[1]>[1]
>

class ZealWeb3RPCProvider implements HttpProvider {
    constructor({
        network,
        networkRPCMap,
    }: {
        networkRPCMap: NetworkRPCMap
        network: Network
    }) {
        this.networkRPCMap = networkRPCMap
        this.network = network
    }

    host: string = ''
    networkRPCMap: NetworkRPCMap
    network: Network

    connected: boolean = false

    supportsSubscriptions = (): false => false

    send(
        payload: Web3RPCRequest,
        callback: (error: Error | null, result?: Web3RPCResponse) => void
    ): void {
        const request = parseRPCRequest(payload).getSuccessResultOrThrow(
            'Faield to parse RPC request in web3 provider'
        )

        fetchRPCResponse({
            network: this.network,
            networkRPCMap: this.networkRPCMap,
            request,
        })
            .then((response) => {
                callback(null, {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc,
                    result: response,
                })
            })
            .catch((error) => {
                if (error instanceof UnexpectedResultFailureError) {
                    // We patch the error message to include the response data, so it will match output of web3js
                    error.reason.message =
                        error.reason.message +
                        `return data: ${error.reason.data}`
                    callback(error.reason)
                } else {
                    callback(error)
                }
            })
    }

    disconnect = (): false => false
}

/**
 * Safe SDK require ethAdapter, since we can't use web3 directly we wrap our RPC into
 */
export const createZealSafeCompatibleEthAdapter = ({
    network,
    networkRPCMap,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
}): Web3Adapter => {
    const adapter: Web3Adapter & { networkHexChainId?: string } =
        new Web3Adapter({
            web3: new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap })),
        })

    adapter.networkHexChainId = network.hexChainId // This is needed to break falsy memoization of safe sdk

    return adapter
}
