import { Nft } from '@zeal/domains/NFTCollection'
import { parseNftCollectionInfo } from '@zeal/domains/NFTCollection/parsers/parseNftCollectionInfo'
import {
    nullable,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

export const parseNft = (input: unknown): Result<unknown, Nft> =>
    object(input).andThen((obj) =>
        shape({
            tokenId: string(obj.tokenId),
            name: oneOf([string(obj.name), nullable(obj.name)]),
            image: oneOf([string(obj.image), nullable(obj.image)]),
            collectionInfo: parseNftCollectionInfo(obj.collectionInfo),
            decimals: number(obj.decimals),
        })
    )
