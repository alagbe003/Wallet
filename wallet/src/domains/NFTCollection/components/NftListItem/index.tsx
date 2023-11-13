import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Nft } from '@zeal/domains/NFTCollection'
import { IconButton } from 'src/uikit'
import { getExplorerLink } from 'src/domains/NFTCollection/helpers/getExplorerLink'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { format } from '@zeal/domains/Address/helpers/format'
import { Text2 } from 'src/uikit/Text2'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import React from 'react'
import { NFTBadge } from 'src/domains/SafetyCheck/components/NFTBadge'
import { Row } from '@zeal/uikit/Row'
import { NetworkMap } from '@zeal/domains/Network'
import { NftAvatar } from 'src/domains/NFTCollection/components/NftAvatar'

type Props = {
    nft: Nft
    checks: TransactionSafetyCheck[]
    rightNode: React.ReactNode
    networkMap: NetworkMap
}

export const NftListItem = ({ nft, rightNode, networkMap, checks }: Props) => {
    return (
        <ListItem2
            aria-selected={false}
            avatar={({ size }) => (
                <NftAvatar
                    size={size}
                    nft={nft}
                    badge={({ size }) => (
                        <NFTBadge
                            size={size}
                            nftCollectionInfo={nft.collectionInfo}
                            safetyChecks={checks}
                        />
                    )}
                />
            )}
            primaryText={
                <Row spacing={4}>
                    <Text2 ellipsis>
                        {nft.name || `#${BigInt(nft.tokenId)}`}
                    </Text2>

                    <IconButton
                        onClick={() =>
                            window.open(
                                getExplorerLink(nft, networkMap),
                                '_blank'
                            )
                        }
                    >
                        <ExternalLink size={14} color="iconDefault" />
                    </IconButton>
                </Row>
            }
            shortText={
                nft.collectionInfo.name || format(nft.collectionInfo.address)
            }
            size="large"
            side={{
                title: rightNode,
            }}
        />
    )
}
