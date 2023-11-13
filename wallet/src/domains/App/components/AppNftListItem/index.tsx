import { AppNft } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { Avatar } from 'src/uikit/Avatar'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    'aria-selected': boolean
    nft: AppNft
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

export const AppNftListItem = ({
    'aria-selected': ariaSelected,
    nft,
    knownCurrencies,
    networkMap,
}: Props) => {
    return (
        <ListItem2
            size="large"
            aria-selected={ariaSelected}
            avatar={({ size }) =>
                nft.uri && <Avatar src={nft.uri} size={size} />
            }
            primaryText={nft.name}
            side={{
                title: nft.priceInDefaultCurrency ? (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={nft.priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ) : null,
            }}
        />
    )
}
