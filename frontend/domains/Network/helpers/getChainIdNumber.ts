import { Network } from '@zeal/domains/Network'
import { number } from '@zeal/toolkit/Result'

export const getChainIdNumber = (network: Network): number => {
    return number(parseInt(network.hexChainId, 16)).getSuccessResultOrThrow(
        'cannot parse chain id from hex to number'
    )
}
