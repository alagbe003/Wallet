import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

export const getCollectionExplorerLink = (
    collection: NftCollectionInfo,
    networkMap: NetworkMap
) => {
    const network = findNetworkByHexChainId(collection.networkHexId, networkMap)
    return joinURL(network.blockExplorerUrl, '/address', collection.address)
}
