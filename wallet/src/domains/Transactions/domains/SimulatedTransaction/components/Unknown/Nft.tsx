import { NftListItem } from 'src/domains/NFTCollection/components/NftListItem'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionNft } from '@zeal/domains/Transactions'

type Props = {
    checks: TransactionSafetyCheck[]
    transactionNft: TransactionNft
    networkMap: NetworkMap
}

const DirectionNode = ({
    direction,
}: {
    direction: TransactionNft['direction']
}) => {
    switch (direction) {
        case 'Send':
            return (
                <Text2 variant="paragraph" weight="regular" color="textPrimary">
                    -1
                </Text2>
            )

        case 'Receive':
            return (
                <Text2 variant="paragraph" weight="regular" color="textPrimary">
                    +1
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(direction)
    }
}

export const Nft = ({ transactionNft, checks, networkMap }: Props) => (
    <NftListItem
        networkMap={networkMap}
        checks={checks}
        nft={transactionNft.nft}
        rightNode={<DirectionNode direction={transactionNft.direction} />}
    />
)
