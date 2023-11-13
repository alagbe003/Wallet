import { FormattedMessage } from 'react-intl'
import { format } from '@zeal/domains/Address/helpers/format'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedNftAmount } from '@zeal/domains/Money/components/FormattedNftAmount'
import { NftAvatar } from 'src/domains/NFTCollection/components/NftAvatar'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'
import { notReachable } from '@zeal/toolkit'
import { Avatar as UIAvatar } from 'src/uikit/Avatar'
import { BoldImageCollection } from 'src/uikit/Icon/BoldImageCollection'
import { Document } from 'src/uikit/Icon/Document'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'
import { ApprovalTokenListItem } from './ApprovalTokenListItem'
import { MultiAssetList } from './MultiAssetList'
import { TokenListItem } from './TokenListItem'

type Props = {
    transaction: ActivityTransaction
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    displayLimit: boolean
}

export const AssetList = ({
    transaction,
    networkMap,
    knownCurrencies,
    displayLimit,
}: Props) => {
    const network = findNetworkByHexChainId(
        transaction.networkHexId,
        networkMap
    )
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            icon={<Document size={size} color="iconDefault" />}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        <FormattedMessage
                            id="activity.assets.no-balance-change"
                            defaultMessage="No balance change"
                        />
                    }
                />
            )

        case 'InboundP2PActivityTransaction':
        case 'UnknownActivityTransaction':
            return (
                <MultiAssetList
                    displayLimit={displayLimit}
                    tokens={transaction.tokens}
                    nfts={transaction.nfts}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            )
        case 'OutboundP2PActivityTransaction':
            return (
                <TokenListItem
                    token={transaction.token}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            )
        case 'OutboundP2PNftActivityTransaction': {
            const { nft } = transaction.nft

            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={nft}
                            badge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={nft.name || `#${BigInt(nft.tokenId)}`}
                    shortText={
                        nft.collectionInfo.name ||
                        format(nft.collectionInfo.address)
                    }
                    side={{
                        title: (
                            <>
                                {getSign(transaction.nft.direction)}
                                <FormattedNftAmount
                                    nft={nft}
                                    transferAmount={transaction.nft.amount}
                                />
                            </>
                        ),
                    }}
                />
            )
        }
        case 'SingleNftApprovalActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={transaction.nft}
                            badge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        transaction.nft.name ||
                        `#${BigInt(transaction.nft.tokenId)}`
                    }
                    shortText={
                        transaction.nft.collectionInfo.name ||
                        format(transaction.nft.collectionInfo.address)
                    }
                />
            )

        case 'NftCollectionApprovalActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            icon={
                                <BoldImageCollection
                                    size={size}
                                    color="iconDefault"
                                />
                            }
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        transaction.nftCollectionInfo.name ||
                        format(transaction.nftCollectionInfo.address)
                    }
                />
            )

        case 'Erc20ApprovalActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
            return (
                <ApprovalTokenListItem
                    approvalAmount={transaction.allowance}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            )

        case 'PartialTokenApprovalActivityTransaction':
            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            icon={
                                <QuestionCircle
                                    size={size}
                                    color="iconDefault"
                                />
                            }
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        <Text2
                            variant="paragraph"
                            color="textDisabled"
                            weight="regular"
                        >
                            <FormattedMessage
                                id="transactions.asset_list.unkown_assets"
                                defaultMessage="Unknown"
                            />
                        </Text2>
                    }
                />
            )

        case 'FailedActivityTransaction':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
