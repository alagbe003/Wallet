import { Money } from '@zeal/domains/Money'
import { Address } from '@zeal/domains/Address'
import { NetworkHexId } from '@zeal/domains/Network'
import { components } from '@zeal/api/portfolio'

export type PortfolioNFTCollection = {
    name: string
    priceInDefaultCurrency: Money
    mintAddress: Address
    networkHexId: NetworkHexId
    nfts: PortfolioNFT[]
    standard: NFTStandard
}

export type PortfolioNFT = {
    uri: string | null
    name: string
    tokenId: string
    priceInDefaultCurrency: Money
    standard: NFTStandard
}

export type NFTStandard = 'Erc721' | 'Erc1155'

export type Nft = Omit<components['schemas']['Nft'], 'collectionInfo'> & {
    collectionInfo: NftCollectionInfo
}

export type NftCollectionInfo = Omit<
    components['schemas']['TransactionNftCollectionInfo'],
    'network'
> & { networkHexId: NetworkHexId }
