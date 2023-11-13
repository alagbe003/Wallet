import { Network } from '@zeal/domains/Network'
import { TransactionHash } from '..'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

export const getExplorerLink = (hash: TransactionHash, network: Network) =>
    joinURL(network.blockExplorerUrl, '/tx', hash.transactionHash)
