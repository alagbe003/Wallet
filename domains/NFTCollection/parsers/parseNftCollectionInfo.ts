import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import {
    nullable,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export const parseNftCollectionInfo = (
    input: unknown
): Result<unknown, NftCollectionInfo> =>
    object(input).andThen((obj) =>
        shape({
            name: oneOf([string(obj.name), nullable(obj.name)]),
            address: string(obj.address),
            networkHexId: oneOf([
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
        })
    )
