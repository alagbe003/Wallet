import { FormattedMessage } from 'react-intl'
import { AppToken } from '@zeal/domains/App'
import { AppTokenAvatar } from 'src/domains/App/components/AppTokenAvatar'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    'aria-selected': boolean
    token: AppToken
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

export const AppTokenListItem = ({
    'aria-selected': ariaSelected,
    token,
    knownCurrencies,
    networkMap,
}: Props) => {
    const currency = useCurrencyById(token.balance.currencyId, knownCurrencies)

    return (
        <ListItem2
            size="large"
            aria-selected={ariaSelected}
            avatar={({ size }) => (
                <AppTokenAvatar
                    token={token}
                    knownCurrencies={knownCurrencies}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge
                            size={size}
                            network={findNetworkByHexChainId(
                                token.networkHexId,
                                networkMap
                            )}
                        />
                    )}
                />
            )}
            primaryText={
                currency ? (
                    currency.symbol
                ) : (
                    <Text2
                        color="textSecondary"
                        variant="callout"
                        weight="medium"
                    >
                        <FormattedMessage
                            id="app.token_list_item.unknown"
                            defaultMessage="Unknown"
                        />
                    </Text2>
                )
            }
            side={{
                title: (
                    <FormattedTokenBalances
                        money={token.balance}
                        knownCurrencies={knownCurrencies}
                    />
                ),
                subtitle: token.priceInDefaultCurrency ? (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={token.priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ) : null,
            }}
        />
    )
}
