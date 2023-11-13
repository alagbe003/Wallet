import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { BadgeSize } from 'src/uikit/Avatar'
import { BoldShieldCautionWithBorder } from 'src/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from 'src/uikit/Icon/BoldShieldDoneWithBorder'

export const NFTBadge = ({
    nftCollectionInfo,
    safetyChecks,
    size,
}: {
    safetyChecks: TransactionSafetyCheck[]
    nftCollectionInfo: NftCollectionInfo
    size: BadgeSize
}) => {
    const check = safetyChecks.find((item) => {
        switch (item.type) {
            case 'NftCollectionCheck':
                return item.nftCollectionAddress === nftCollectionInfo.address

            case 'TokenVerificationCheck':
            case 'TransactionSimulationCheck':
            case 'SmartContractBlacklistCheck':
            case 'P2pReceiverTypeCheck':
            case 'ApprovalSpenderTypeCheck':
                return false

            /* istanbul ignore next */
            default:
                return notReachable(item)
        }
    })

    if (!check) {
        // We do not render badge if no match
        return null
    }

    switch (check.state) {
        case 'Failed':
            return (
                <BoldShieldCautionWithBorder
                    size={size}
                    color="statusWarning"
                />
            )

        case 'Passed':
            return (
                <BoldShieldDoneWithBorder size={size} color="statusSuccess" />
            )

        /* istanbul ignore next */
        default:
            return notReachable(check)
    }
}
