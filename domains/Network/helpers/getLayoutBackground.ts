import { CurrentNetwork } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

type Background = 'surfaceDark' | 'teal'

export const getLayoutBackground = (
    currentNetwork: CurrentNetwork
): Background => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return 'teal'
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return 'teal'
                case 'custom':
                case 'testnet':
                    return 'surfaceDark'
                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
