import { AppProtocol, AppToken } from '@zeal/domains/App'
import { notReachable } from '@zeal/toolkit'

export const rewardTokensFromProtocol = (protocol: AppProtocol): AppToken[] => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
            return protocol.rewardTokens

        case 'LockedTokenAppProtocol':
            return protocol.rewardTokens

        case 'LendingAppProtocol':
            return protocol.rewardTokens

        case 'VestingAppProtocol':
            return [protocol.claimableToken]

        case 'UnknownAppProtocol':
            return []

        default:
            return notReachable(protocol)
    }
}
