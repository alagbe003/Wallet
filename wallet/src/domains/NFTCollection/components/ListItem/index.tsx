import { format } from '@zeal/domains/Address/helpers/format'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { NetworkMap } from '@zeal/domains/Network'
import { Avatar } from 'src/domains/Network/components/Avatar'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { notReachable } from '@zeal/toolkit'
import { Base } from 'src/uikit/Base'
import { Caption } from '@zeal/uikit/Caption'
import { Clickable } from 'src/uikit/Clickable'
import { Column2 } from 'src/uikit/Column2'
import { GroupHeaderByRows } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import styled from 'styled-components'
import { BorderRadiusProps, borderRadius } from 'styled-system'

type Props = {
    nft: PortfolioNFT
    size: number
} & BorderRadiusProps

type ImageSource =
    | { type: 'web'; uri: string }
    | { type: 'ipfs'; uri: string }
    | { type: 'unknown'; uri: unknown }

export const getNFTImageSource = (nft: PortfolioNFT): ImageSource => {
    if (nft.uri?.match(/^http/i)) {
        return { type: 'web', uri: nft.uri }
    } else if (nft.uri?.match(/^ipfs/i)) {
        return { type: 'ipfs', uri: nft.uri }
    } else {
        return { type: 'unknown', uri: nft.uri }
    }
}

export const ListItem = styled(Base)<Props>`
    padding: 8px;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
    border-radius: 8px;
    overflow: hidden;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    background-image: url('${({ nft }) => {
        const imageSource = getNFTImageSource(nft)
        switch (imageSource.type) {
            case 'web':
                return imageSource.uri

            case 'ipfs':
                return `https://ipfs.io/ipfs/${new URL(
                    imageSource.uri
                ).pathname.replace(/^\/\//, '')}`

            case 'unknown':
                return 'none' // TODO stub for missing image data

            /* istanbul ignore next */
            default:
                return notReachable(imageSource)
        }
    }}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    ${borderRadius}
`

type ListItemWithInfoProps = {
    nft: PortfolioNFT
    currencies: KnownCurrencies
    onClick: () => void
}

export const ListItemWithInfo = ({
    nft,
    currencies,
    onClick,
}: ListItemWithInfoProps) => {
    return (
        <Clickable onClick={onClick}>
            <Column2 spacing={0}>
                <ListItem borderRadius="0" size={146} nft={nft} />

                <Caption>
                    <Column2 spacing={4}>
                        <Text2
                            ellipsis
                            variant="caption1"
                            weight="medium"
                            color="textPrimary"
                            align="left"
                        >
                            #{nft.tokenId}
                        </Text2>

                        <Text2
                            variant="caption2"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedTokenBalanceInDefaultCurrency
                                money={nft.priceInDefaultCurrency}
                                knownCurrencies={currencies}
                            />
                        </Text2>
                    </Column2>
                </Caption>
            </Column2>
        </Clickable>
    )
}

export const CollectionHeader = ({
    nftCollection,
    currencies,
    networkMap,
}: {
    nftCollection: PortfolioNFTCollection
    currencies: KnownCurrencies
    networkMap: NetworkMap
}) => {
    return (
        <GroupHeaderByRows
            topLeft={
                <Text2 variant="paragraph" weight="regular" color="textPrimary">
                    {`${nftCollection.name} (${nftCollection.nfts.length})`}
                </Text2>
            }
            topRight={
                <Text2 variant="paragraph" weight="regular" color="textPrimary">
                    <FormattedTokenBalanceInDefaultCurrency
                        money={nftCollection.priceInDefaultCurrency}
                        knownCurrencies={currencies}
                    />
                </Text2>
            }
            bottomLeft={
                <Row spacing={3}>
                    <Avatar
                        currentNetwork={{
                            type: 'specific_network',
                            network: findNetworkByHexChainId(
                                nftCollection.networkHexId,
                                networkMap
                            ),
                        }}
                        size={14}
                    />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        {format(nftCollection.mintAddress)}
                    </Text2>
                </Row>
            }
        />
    )
}
