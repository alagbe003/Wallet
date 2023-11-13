import React from 'react'
import { Token } from '@zeal/domains/Token'
import { Avatar } from '@zeal/domains/Token/components/Avatar'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedRate } from '@zeal/domains/FXRate/components/FormattedRate'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge as UIBadge } from '@zeal/uikit/Avatar'
import { BoldStarFavourite } from '@zeal/uikit/Icon/BoldStarFavourite'
import { Row } from '@zeal/uikit/Row'
import { notReachable } from '@zeal/toolkit'
import { useIntl } from 'react-intl'
import { Text } from '@zeal/uikit/Text'
import { Spam } from '@zeal/uikit/Icon/Spam'

type Props = {
    token: Token
    'aria-selected': boolean
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onClick?: () => void
}

const TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION = 2

export const ListItem = ({
    token,
    'aria-selected': ariaSelected,
    knownCurrencies,
    networkMap,
    currencyPinMap,
    currencyHiddenMap,
    onClick,
}: Props) => {
    const currency = useCurrencyById(token.balance.currencyId, knownCurrencies)
    return (
        <UIListItem
            size="large"
            onClick={onClick}
            aria-selected={ariaSelected}
            avatar={({ size }) => (
                <Avatar
                    leftBadge={({ size }) => {
                        if (
                            currencyHiddenMap[token.balance.currencyId] ||
                            (currencyHiddenMap[token.balance.currencyId] ===
                                undefined &&
                                token.scam)
                        ) {
                            return (
                                <UIBadge outlineColor="transparent" size={size}>
                                    <Spam
                                        size={size}
                                        color="iconStatusCritical"
                                    />
                                </UIBadge>
                            )
                        }

                        if (currencyPinMap[token.balance.currencyId]) {
                            return (
                                <UIBadge outlineColor="transparent" size={size}>
                                    <BoldStarFavourite size={size} />
                                </UIBadge>
                            )
                        }

                        return null
                    }}
                    key={token.balance.currencyId}
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
            primaryText={currency?.symbol}
            shortText={
                <Row spacing={4}>
                    <Text ellipsis>
                        {token.rate ? (
                            <FormattedRate
                                rate={token.rate}
                                knownCurriencies={knownCurrencies}
                            />
                        ) : null}
                    </Text>

                    <PriceChange24H token={token} />
                </Row>
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

export const PriceChange24H = ({ token }: { token: Token }) => {
    const { formatNumber } = useIntl()

    if (!token.marketData) {
        return null
    }

    switch (token.marketData.priceChange24h.direction) {
        case 'Unchanged':
            return <Text ellipsis>0%</Text>

        case 'Up':
            return (
                <Text ellipsis color="textStatusSuccess">
                    {formatNumber(token.marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'always',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                </Text>
            )

        case 'Down':
            return (
                <Text ellipsis color="textStatusWarning">
                    {formatNumber(token.marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'always',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(token.marketData.priceChange24h)
    }
}
