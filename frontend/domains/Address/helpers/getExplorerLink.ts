import { Address } from '@zeal/domains/Address'
import { Network } from '@zeal/domains/Network'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

export const getExplorerLink = (address: Address, network: Network) =>
    joinURL(network.blockExplorerUrl, '/address', address)
