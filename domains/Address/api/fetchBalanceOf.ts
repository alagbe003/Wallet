import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import Web3 from 'web3'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { bigint, string } from '@zeal/toolkit/Result'
import { generateRandomNumber } from '@zeal/toolkit/Number'

type Params = {
    contract: Address
    account: Address
    network: Network
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}

const ABI = [
    {
        constant: true,
        inputs: [
            {
                name: '_owner' as const,
                type: 'address' as const,
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance' as const,
                type: 'uint256' as const,
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
]

export const fetchBalanceOf = async ({
    account,
    contract,
    network,
    networkRPCMap,
    signal,
}: Params): Promise<bigint> => {
    const web3 = new Web3()
    const contractEncoded = new web3.eth.Contract(ABI, contract)
    const data: string = contractEncoded.methods.balanceOf(account).encodeABI()

    const balanceStr = await fetchRPCResponse({
        signal,
        network: network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_call' as const,
            params: [
                {
                    to: contract,
                    data,
                },
                'latest',
            ],
        },
    })

    const parsed = string(balanceStr)
        .map((str) => web3.eth.abi.decodeParameter('int256', str))
        .andThen(bigint)
        .getSuccessResultOrThrow('Failed to parse owner balance')

    return parsed
}
