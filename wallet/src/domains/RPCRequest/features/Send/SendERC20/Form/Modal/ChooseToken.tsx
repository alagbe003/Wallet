import { Account } from '@zeal/domains/Account'
import {
    Currency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { searchCurrencies } from '@zeal/domains/Currency/helpers/searchCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'
import { noop, notReachable } from '@zeal/toolkit'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Tokens } from '@zeal/uikit/Icon/Empty'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { ListItem } from 'src/domains/Token/components/ListItem'
import { SectionList } from '@zeal/uikit/SectionList'

type Props = {
    portfolioMap: PortfolioMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    selectedToken: Token | null
    knownCurrencies: KnownCurrencies
    account: Account
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}
type Msg = { type: 'close' } | { type: 'on_token_select'; token: Token }

export const ChooseToken = ({
    portfolioMap,
    selectedToken,
    account,
    knownCurrencies,
    keyStoreMap,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const portfolio = portfolioMap[account.address]

    const searchResult = searchCurrencies({
        currencies: portfolio.tokens.map((token) => token.balance.currencyId),
        search,
        knownCurrencies,
        portfolio,
        currencyPinMap,
    })

    const selectedCurrencyId: CurrencyId | null =
        selectedToken?.balance.currencyId || null

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="choose-tokens-label"
        >
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                network={null}
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column shrink spacing={16}>
                <Text
                    variant="title3"
                    weight="bold"
                    color="textPrimary"
                    id="choose-tokens-label"
                >
                    <FormattedMessage
                        id="SendERC20.tokens"
                        defaultMessage="Tokens"
                    />
                </Text>
                <Column spacing={8}>
                    <Input
                        autoFocus
                        placeholder={formatMessage({
                            id: 'SendERC20.tokens.searchPlaceholder',
                            defaultMessage: 'Search',
                        })}
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        state="normal"
                        variant="regular"
                        onChange={(search) => setSearch(search)}
                        value={search}
                        onSubmitEditing={noop}
                    />

                    {(() => {
                        switch (searchResult.type) {
                            case 'no_currencies_found':
                                return (
                                    <EmptyStateWidget
                                        icon={({ size }) => (
                                            <Tokens
                                                size={size}
                                                color="backgroundLight"
                                            />
                                        )}
                                        size="regular"
                                        title={
                                            <FormattedMessage
                                                id="ERC20.tokens.emptyState"
                                                defaultMessage="We found no tokens"
                                            />
                                        }
                                    />
                                )

                            case 'grouped_results': {
                                const sections = [
                                    {
                                        data: searchResult.portfolioCurrencies
                                            .map((currency) =>
                                                mapCurrencyToToken({
                                                    currency,
                                                    portfolio,
                                                })
                                            )
                                            .filter(
                                                filterByHideMap(
                                                    currencyHiddenMap
                                                )
                                            ),
                                    },
                                    {
                                        data: searchResult.nonPortfolioCurrencies
                                            .map((currency) =>
                                                mapCurrencyToToken({
                                                    currency,
                                                    portfolio,
                                                })
                                            )
                                            .filter(
                                                filterByHideMap(
                                                    currencyHiddenMap
                                                )
                                            ),
                                    },
                                ]

                                return (
                                    <SectionList
                                        variant="grouped"
                                        itemSpacing={8}
                                        sectionSpacing={8}
                                        sections={sections}
                                        renderItem={({ item: token }) => (
                                            <ListItem
                                                currencyHiddenMap={
                                                    currencyHiddenMap
                                                }
                                                currencyPinMap={currencyPinMap}
                                                key={token.balance.currencyId}
                                                networkMap={networkMap}
                                                aria-selected={
                                                    selectedCurrencyId ===
                                                    token.balance.currencyId
                                                }
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                token={token}
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_token_select',
                                                        token,
                                                    })
                                                }
                                            />
                                        )}
                                    />
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </Column>
            </Column>
        </Screen>
    )
}

const mapCurrencyToToken = ({
    currency,
    portfolio,
}: {
    currency: Currency
    portfolio: Portfolio
}): Token => {
    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                'Fiat currency can not appear in SendERC20 flow'
            )

        case 'CryptoCurrency': {
            const portfolioToken =
                portfolio.tokens.find(
                    (token) => token.balance.currencyId === currency.id
                ) || null

            return (
                portfolioToken || {
                    address: currency.address,
                    balance: {
                        amount: 0n,
                        currencyId: currency.id,
                    },
                    networkHexId: currency.networkHexChainId,
                    priceInDefaultCurrency: null,
                    rate: null,
                    marketData: null,
                    scam: false,
                }
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
