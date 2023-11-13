import { GroupHeader as UIGroupHeader } from '@zeal/uikit/Group'
import { FormattedMessage } from 'react-intl'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { sumNFTSInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Chain } from 'src/uikit/Chain'
import { Text2 } from 'src/uikit/Text2'
import { Row } from '@zeal/uikit/Row'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    knownCurrencies: KnownCurrencies
    onClick: null | (() => void)
}

export const GroupHeader = ({
    nftCollections,
    knownCurrencies,
    onClick,
}: Props) => {
    const sum = sumNFTSInDefaultCurrency(nftCollections)
    const _onClick = onClick ?? undefined
    const count = nftCollections.reduce(
        (count, currentValue) => count + currentValue.nfts.length,
        0
    )

    return (
        <UIGroupHeader
            onClick={_onClick}
            left={
                <Chain>
                    <Text2>
                        <FormattedMessage
                            id="ntft.groupHeader.text"
                            defaultMessage="NFTs"
                        />
                    </Text2>
                    {sum && (
                        <Text2>
                            <FormattedTokenBalanceInDefaultCurrency
                                money={sum}
                                knownCurrencies={knownCurrencies}
                            />
                        </Text2>
                    )}
                </Chain>
            }
            right={
                !!count ? (
                    <Row spacing={4}>
                        <Chain>
                            <Text2>{count}</Text2>
                            <Text2>
                                <FormattedMessage
                                    id="ntft.groupHeader.seeAll"
                                    defaultMessage="See all"
                                />
                            </Text2>
                        </Chain>
                        <ForwardIcon size={16} color="iconDefault" />
                    </Row>
                ) : null
            }
        />
    )
}
