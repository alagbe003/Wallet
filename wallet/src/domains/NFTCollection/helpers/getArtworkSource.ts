import { Nft } from '@zeal/domains/NFTCollection'

export const getArtworkSource = (nft: Nft): string | null => {
    const uri = nft.image

    if (!uri) {
        return null
    }

    if (uri.match(/^ipfs/i)) {
        return `https://ipfs.io/ipfs/${new URL(uri).pathname.replace(
            /^\/\//,
            ''
        )}`
    }

    return uri
}
