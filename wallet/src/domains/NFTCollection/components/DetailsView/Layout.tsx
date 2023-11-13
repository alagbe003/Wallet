import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import {
    ListItem,
    getNFTImageSource,
} from 'src/domains/NFTCollection/components/ListItem'
import { getOpenSeeLink } from 'src/domains/NFTCollection/helpers/getOpenSeeLink'
import { NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { AddressBook } from 'src/uikit/Icon/AddressBook'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Opensea } from 'src/uikit/Icon/Opensea'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    nft: PortfolioNFT
    nftCollection: PortfolioNFTCollection
    account: Account
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_info_button_click' }
    | { type: 'on_change_account_icon_click'; src: string }
    | {
          type: 'on_send_nft_click'
          nft: PortfolioNFT
          collection: PortfolioNFTCollection
          fromAddress: Address
      }

export const Layout = ({
    onMsg,
    nft,
    nftCollection,
    account,
    knownCurrencies,
    networkMap,
}: Props) => {
    return (
        <Layout2 padding="form" background="default">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={16} style={{ flex: '1' }} alignX="center">
                <Text2
                    ellipsis
                    variant="caption1"
                    weight="semi_bold"
                    color="textSecondary"
                >
                    {nftCollection.name}
                </Text2>

                <Row spacing={6}>
                    <Text2
                        ellipsis
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        #{nft.tokenId}
                    </Text2>
                    <IconButton
                        onClick={() => {
                            window.open(
                                getOpenSeeLink(nftCollection, nft, networkMap),
                                '_blank'
                            )
                        }}
                    >
                        <Opensea size={24} />
                    </IconButton>
                </Row>

                <Column2 spacing={24}>
                    <ListItem borderRadius="12px" size={328} nft={nft}>
                        <ChangeProfilePicture nft={nft} onMsg={onMsg} />
                    </ListItem>

                    <Row alignX="center" alignY="center" spacing={8}>
                        <Text2
                            variant="title1"
                            weight="semi_bold"
                            color="textPrimary"
                        >
                            <FormattedTokenBalanceInDefaultCurrency
                                money={nft.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        </Text2>
                        <IconButton
                            onClick={() => {
                                onMsg({ type: 'on_info_button_click' })
                            }}
                        >
                            <InfoCircle size={18} />
                        </IconButton>
                    </Row>
                </Column2>

                <Spacer2 />

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => {
                        onMsg({
                            type: 'on_send_nft_click',
                            nft,
                            collection: nftCollection,
                            fromAddress: account.address,
                        })
                    }}
                >
                    <FormattedMessage id="action.send" defaultMessage="Send" />
                </Button>
            </Column2>
        </Layout2>
    )
}

const ChangeProfilePicture = ({
    nft,
    onMsg,
}: {
    nft: PortfolioNFT
    onMsg: (msg: Msg) => void
}) => {
    const src = getNFTImageSource(nft)
    switch (src.type) {
        case 'web':
        case 'ipfs':
            return (
                <Column2 spacing={0}>
                    <Row spacing={0} alignX="end">
                        <IconButton
                            onClick={() => {
                                onMsg({
                                    type: 'on_change_account_icon_click',
                                    src: src.uri,
                                })
                            }}
                        >
                            <AddressBook size={28} />
                        </IconButton>
                    </Row>
                </Column2>
            )
        case 'unknown':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(src)
    }
}
