import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import Web3 from 'web3'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { numberString, string } from '@zeal/toolkit/Result'
import { generateRandomNumber } from '@zeal/toolkit/Number'

type Params = {
    contract: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}

const ABI = [
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: 'decimals' as const,
                type: 'uint8' as const,
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
]

export const fetchContractFraction = async ({
    contract,
    network,
    networkRPCMap,
}: Params): Promise<number> => {
    const web3 = new Web3()
    const contractEncoded = new web3.eth.Contract(ABI, contract)
    const data: string = contractEncoded.methods.decimals().encodeABI()

    const decimalStr = await fetchRPCResponse({
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

    const parsed = string(decimalStr)
        .map((str) => web3.eth.abi.decodeParameter('int8', str))
        .andThen(numberString)
        .getSuccessResultOrThrow('Failed to parse contract decimal')

    return parsed
}
