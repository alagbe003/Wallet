import Web3 from 'web3'

import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'

const ERC721_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
]

const ERC1155_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
]

type Params = {
    fromAccount: Account
    toAddress: Address
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
}

export const createNFTEthSendTransaction = ({
    fromAccount,
    toAddress,
    collection,
    nft,
}: Params): EthSendTransaction => {
    const web3 = new Web3()

    switch (nft.standard) {
        case 'Erc1155': {
            const contract = new web3.eth.Contract(
                ERC1155_ABI,
                collection.mintAddress,
                {
                    from: fromAccount.address,
                }
            )
            const data: string = contract.methods
                .safeTransferFrom(
                    fromAccount.address,
                    toAddress,
                    nft.tokenId,
                    1,
                    '0x0'
                )
                .encodeABI()

            return {
                id: generateRandomNumber(),
                jsonrpc: '2.0' as const,
                method: 'eth_sendTransaction' as const,
                params: [
                    {
                        from: fromAccount.address,
                        data,
                        to: collection.mintAddress,
                    },
                ],
            }
        }
        case 'Erc721': {
            const contract = new web3.eth.Contract(
                ERC721_ABI,
                collection.mintAddress,
                {
                    from: fromAccount.address,
                }
            )
            const data: string = contract.methods
                .safeTransferFrom(fromAccount.address, toAddress, nft.tokenId)
                .encodeABI()

            return {
                id: generateRandomNumber(),
                jsonrpc: '2.0' as const,
                method: 'eth_sendTransaction' as const,
                params: [
                    {
                        from: fromAccount.address,
                        data,
                        to: collection.mintAddress,
                    },
                ],
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(nft.standard)
    }
}
