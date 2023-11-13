import { Nft } from '@zeal/domains/NFTCollection'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

export const getExplorerLink = (nft: Nft, networkMap: NetworkMap) => {
    const network = findNetworkByHexChainId(
        nft.collectionInfo.networkHexId,
        networkMap
    )
    const url = joinURL(
        network.blockExplorerUrl,
        '/address',
        nft.collectionInfo.address
    )

    return `${url}?a=${BigInt(nft.tokenId).toString()}`
}
