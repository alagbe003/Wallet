import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { SmallWidget } from 'src/domains/Account/components/Widget'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumNFTSInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { Chain } from 'src/uikit/Chain'
import { Column2 } from 'src/uikit/Column2'
import { GroupHeader as UIGroupHeader } from '@zeal/uikit/Group'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ContentBox, HeaderBox, Screen } from '@zeal/uikit/Screen'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'
import { CollectionHeader, ListItemWithInfo } from '../ListItem'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    account: Account
    currincies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    portfolio: Portfolio
    keystore: KeyStore
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_pricing_info_icon_click' }
    | {
          type: 'on_nft_click'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }
    | MsgOf<typeof SmallWidget>

export const Layout = ({
    nftCollections,
    account,
    selectedNetwork,
    portfolio,
    currincies,
    keystore,
    networkMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const sum = sumNFTSInDefaultCurrency(nftCollections)

    const count = nftCollections.reduce(
        (count, currentValue) => count + currentValue.nfts.length,
        0
    )

    return (
        <Screen
            padding="main"
            background={getLayoutBackground(selectedNetwork)}
        >
            <HeaderBox>
                <SmallWidget
                    currencyHiddenMap={currencyHiddenMap}
                    keystore={keystore}
                    portfolio={portfolio}
                    currentAccount={account}
                    currentNetwork={selectedNetwork}
                    onMsg={onMsg}
                />
            </HeaderBox>
            <ContentBox>
                <Column2 spacing={12}>
                    <UIGroupHeader
                        left={
                            <>
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={20} />
                                </IconButton>
                                <Chain>
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="ntft.groupHeader.text"
                                            defaultMessage="NFTs"
                                        />
                                    </Text>
                                    {!!count && (
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            {count}
                                        </Text>
                                    )}
                                </Chain>
                            </>
                        }
                        right={
                            <>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <>
                                        {sum && (
                                            <FormattedTokenBalanceInDefaultCurrency
                                                money={sum}
                                                knownCurrencies={currincies}
                                            />
                                        )}
                                    </>
                                </Text>
                                <IconButton
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_pricing_info_icon_click',
                                        })
                                    }}
                                >
                                    <InfoCircle size={20} />
                                </IconButton>
                            </>
                        }
                    />

                    <Column2
                        spacing={30}
                        style={{ overflowY: 'auto', flex: '1 1 auto' }}
                    >
                        {nftCollections.map((collection) => {
                            return (
                                <Column2
                                    key={collection.mintAddress}
                                    spacing={12}
                                >
                                    <CollectionHeader
                                        networkMap={networkMap}
                                        nftCollection={collection}
                                        currencies={currincies}
                                    />
                                    <Row spacing={16} wrap wrapSpacing={8}>
                                        {collection.nfts.map((nft) => (
                                            <ListItemWithInfo
                                                key={`${nft.tokenId}`}
                                                nft={nft}
                                                currencies={currincies}
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_nft_click',
                                                        nft,
                                                        nftCollection:
                                                            collection,
                                                    })
                                                }
                                            />
                                        ))}
                                    </Row>
                                </Column2>
                            )
                        })}
                    </Column2>
                </Column2>
            </ContentBox>
        </Screen>
    )
}
