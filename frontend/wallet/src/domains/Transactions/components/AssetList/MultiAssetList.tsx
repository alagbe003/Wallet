import { TransactionNft, TransactionToken } from '@zeal/domains/Transactions'
import { notReachable } from '@zeal/toolkit'
import { TokenListItem } from './TokenListItem'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Network } from '@zeal/domains/Network'
import { Divider } from 'src/uikit/Divider'
import { Row } from '@zeal/uikit/Row'
import { FormattedMessage } from 'react-intl'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'
import { Text2 } from 'src/uikit/Text2'
import { Column2 } from 'src/uikit/Column2'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'
import React from 'react'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { NftAvatar } from 'src/domains/NFTCollection/components/NftAvatar'
import { Badge } from 'src/domains/Network/components/Badge'
import { format } from '@zeal/domains/Address/helpers/format'
import { FormattedNftAmount } from 'src/domains/Money/components/FormattedNftAmount'
import { Avatar as UIAvatar } from 'src/uikit/Avatar'
import { Document } from 'src/uikit/Icon/Document'

type Props = {
    tokens: TransactionToken[]
    nfts: TransactionNft[]
    knownCurrencies: KnownCurrencies
    network: Network
    displayLimit: boolean
}

const MAX_DISPLAY_LIMIT = 4

const group = (
    tokens: TransactionToken[],
    nfts: TransactionNft[]
): Record<
    'incoming' | 'outgoing',
    Array<TransactionToken | TransactionNft>
> => {
    return [...tokens, ...nfts].reduce(
        (record, asset) => {
            switch (asset.direction) {
                case 'Send':
                    record.outgoing.push(asset)
                    return record
                case 'Receive':
                    record.incoming.push(asset)
                    return record

                /* istanbul ignore next */
                default:
                    return notReachable(asset.direction)
            }
        },
        { incoming: [], outgoing: [] } as Record<
            'incoming' | 'outgoing',
            Array<TransactionToken | TransactionNft>
        >
    )
}

export const MultiAssetList = ({
    tokens,
    nfts,
    network,
    displayLimit,
    knownCurrencies,
}: Props) => {
    const { incoming, outgoing } = group(tokens, nfts)

    const incomingSliced = incoming.slice(
        0,
        displayLimit ? MAX_DISPLAY_LIMIT / 2 : incoming.length
    )

    const outgoingSliced = outgoing.slice(
        0,
        displayLimit ? MAX_DISPLAY_LIMIT / 2 : outgoing.length
    )

    const remaining =
        tokens.length +
        nfts.length -
        incomingSliced.length -
        outgoingSliced.length

    if (tokens.length + nfts.length === 0) {
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
    }

    return (
        <>
            {incomingSliced.map((asset, idx) => (
                <Item
                    key={`incoming-${idx}-${asset.type}`}
                    asset={asset}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            ))}
            {outgoingSliced.map((asset, idx) => (
                <Item
                    key={`outgoing-${idx}-${asset.type}`}
                    asset={asset}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            ))}
            {!!remaining && <Footer numTokens={remaining} />}
        </>
    )
}

const Item = ({
    asset,
    knownCurrencies,
    network,
}: {
    asset: TransactionToken | TransactionNft
    knownCurrencies: KnownCurrencies
    network: Network
}) => {
    switch (asset.type) {
        case 'transaction_token':
            return (
                <TokenListItem
                    token={asset}
                    knownCurrencies={knownCurrencies}
                    network={network}
                />
            )
        case 'transaction_nft':
            return (
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={asset.nft}
                            badge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        asset.nft.name || `#${BigInt(asset.nft.tokenId)}`
                    }
                    shortText={
                        asset.nft.collectionInfo.name ||
                        format(asset.nft.collectionInfo.address)
                    }
                    side={{
                        title: (
                            <>
                                {getSign(asset.direction)}
                                <FormattedNftAmount
                                    nft={asset.nft}
                                    transferAmount={asset.amount}
                                />
                            </>
                        ),
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(asset)
    }
}

const Footer = ({ numTokens }: { numTokens: number }) => (
    <Column2 spacing={8}>
        <Divider variant="secondary" />
        <Row spacing={4} alignX="end">
            <Text2 variant="caption1" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="activity.more-tokens.label"
                    defaultMessage="+{numTokens} more token(s)"
                    values={{ numTokens }}
                />
            </Text2>
            <LightArrowRight2 size={14} color="iconDefault" />
        </Row>
    </Column2>
)
