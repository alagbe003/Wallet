import { FormattedMessage } from 'react-intl'
import { format } from '@zeal/domains/Address/helpers/format'
import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { getCollectionExplorerLink } from 'src/domains/NFTCollection/helpers/getCollectionExplorerLink'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { NFTBadge } from 'src/domains/SafetyCheck/components/NFTBadge'
import { IconButton } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { BoldImageCollection } from 'src/uikit/Icon/BoldImageCollection'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'

type Props = {
    checks: TransactionSafetyCheck[]
    nftCollection: NftCollectionInfo
    networkMap: NetworkMap
}

export const NftCollectionListItem = ({
    nftCollection,
    networkMap,
    checks,
}: Props) => {
    return (
        <ListItem2
            aria-selected={false}
            size="large"
            avatar={({ size }) => (
                <Avatar
                    size={size}
                    variant="squared"
                    icon={
                        <BoldImageCollection size={size} color="iconDefault" />
                    }
                    rightBadge={({ size }) => (
                        <NFTBadge
                            size={size}
                            nftCollectionInfo={nftCollection}
                            safetyChecks={checks}
                        />
                    )}
                />
            )}
            primaryText={
                <Row spacing={4}>
                    {nftCollection.name || format(nftCollection.address)}

                    <IconButton
                        onClick={() =>
                            window.open(
                                getCollectionExplorerLink(
                                    nftCollection,
                                    networkMap
                                ),
                                '_blank'
                            )
                        }
                    >
                        <ExternalLink size={14} color="iconDefault" />
                    </IconButton>
                </Row>
            }
            shortText={
                <FormattedMessage
                    id="NftCollectionInfo.entireCollection"
                    defaultMessage="Entire collection"
                />
            }
        />
    )
}
