import React from 'react'
import { Token } from '@zeal/domains/Token'
import { Avatar } from 'src/domains/Token/components/Avatar'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedRate } from 'src/domains/FXRate/components/FormattedRate'
import { Badge } from 'src/domains/Network/components/Badge'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge as UIBadge } from 'src/uikit/Avatar'
import { BoldStarFavourite } from 'src/uikit/Icon/BoldStarFavourite'
import { Row } from '@zeal/uikit/Row'
import { notReachable } from '@zeal/toolkit'
import { useIntl } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { Spam } from 'src/uikit/Icon/Spam'

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
        <ListItem2
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
                    <Text2 ellipsis>
                        {token.rate ? (
                            <FormattedRate
                                rate={token.rate}
                                knownCurriencies={knownCurrencies}
                            />
                        ) : null}
                    </Text2>

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
            return <Text2 ellipsis>0%</Text2>

        case 'Up':
            return (
                <Text2 ellipsis color="textStatusSuccess">
                    {formatNumber(token.marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'always',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                </Text2>
            )

        case 'Down':
            return (
                <Text2 ellipsis color="textStatusWarning">
                    {formatNumber(token.marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'always',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(token.marketData.priceChange24h)
    }
}
