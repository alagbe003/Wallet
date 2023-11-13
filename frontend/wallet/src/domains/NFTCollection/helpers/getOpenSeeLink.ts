import { ImperativeError } from '@zeal/domains/Error'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

type OpenSeaNetwork =
    | 'ethereum'
    | 'arbitrum'
    | 'bsc'
    | 'matic'
    | 'avalanche'
    | 'optimism'

const getOpenSeaNetwork = ({
    networkHexId,
    networkMap,
}: {
    networkMap: NetworkMap
    networkHexId: NetworkHexId
}): OpenSeaNetwork => {
    const network = networkMap[networkHexId]

    if (!network) {
        throw new ImperativeError(
            `Unknown network ${networkHexId} when getting OpenSea network part`
        )
    }

    switch (network.type) {
        case 'predefined':
            switch (network.name) {
                case 'Ethereum':
                    return 'ethereum'

                case 'Arbitrum':
                    return 'arbitrum'

                case 'BSC':
                    return 'bsc'

                case 'Polygon':
                    return 'matic'

                case 'Avalanche':
                    return 'avalanche'

                case 'Optimism':
                    return 'optimism'

                case 'Fantom':
                case 'PolygonZkevm':
                case 'Gnosis':
                case 'Celo':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Aurora':
                case 'Base':
                case 'zkSync':
                case 'Evmos':
                    throw new ImperativeError(
                        `Network ${network.hexChainId} not supported for OpenSea`
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
        case 'testnet':
            throw new ImperativeError(
                `Network ${network.hexChainId} not supported for OpenSea`
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

export const getOpenSeeLink = (
    nftCollection: PortfolioNFTCollection,
    nft: PortfolioNFT,
    networkMap: NetworkMap
): string =>
    `https://opensea.io/assets/${getOpenSeaNetwork({
        networkHexId: nftCollection.networkHexId,
        networkMap,
    })}/${nftCollection.mintAddress}/${nft.tokenId}`
