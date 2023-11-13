import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
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
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { ListItem } from 'src/domains/Token/components/ListItem'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Group } from 'src/uikit/Group'
import { Tokens } from 'src/uikit/Icon/Empty'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { OutlineSearch } from 'src/uikit/Icon/OutlineSearch'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { List } from 'src/uikit/List'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    currencies: CurrencyId[]
    currentNetwork: CurrentNetwork

    selectedCurrencyId: CurrencyId | null

    account: Account
    keystoreMap: KeyStoreMap
    portfolio: Portfolio

    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_network_selection_click' }
    | { type: 'on_currency_selected'; currencyId: CurrencyId }

const mapCurrencyToToken = ({
    currency,
    portfolio,
}: {
    currency: Currency
    portfolio: Portfolio
}): Token => {
    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

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

export const Layout = ({
    currencies,
    currentNetwork,
    selectedCurrencyId,
    account,
    portfolio,
    keystoreMap,
    knownCurrencies,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const searchResult = searchCurrencies({
        currencies,
        search,
        knownCurrencies,
        portfolio,
        currencyPinMap,
    })

    return (
        <Layout2
            background="light"
            padding="form"
            aria-labelledby="select-currency-and-network-label"
        >
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={16}>
                <Row spacing={8}>
                    <Text2
                        variant="title3"
                        weight="bold"
                        color="textPrimary"
                        id="select-currency-and-network-label"
                    >
                        <FormattedMessage
                            id="SelectCurrency.tokens"
                            defaultMessage="Tokens"
                        />
                    </Text2>
                    <Spacer2 />

                    {(() => {
                        switch (currentNetwork.type) {
                            case 'all_networks':
                                return null
                            case 'specific_network':
                                return (
                                    <FancyButton
                                        rounded
                                        network={currentNetwork.network}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_network_selection_click',
                                            })
                                        }
                                    />
                                )

                            default:
                                return notReachable(currentNetwork)
                        }
                    })()}
                </Row>

                <Input2
                    placeholder={formatMessage({
                        id: 'SelectCurrency.tokens.searchPlaceholder',
                        defaultMessage: 'Search',
                    })}
                    leftIcon={<OutlineSearch size={24} color="iconDefault" />}
                    state="normal"
                    variant="regular"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />

                <Column2
                    spacing={16}
                    style={{ overflowY: 'auto', flex: '1 1 auto' }}
                >
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
                                                id="SelectCurrency.tokens.emptyState"
                                                defaultMessage="We found no tokens"
                                            />
                                        }
                                    />
                                )

                            case 'grouped_results': {
                                const tokens = {
                                    nonPortfolio:
                                        searchResult.nonPortfolioCurrencies
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
                                    fromPortfolio:
                                        searchResult.portfolioCurrencies
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
                                }

                                return (
                                    <>
                                        {!!tokens.fromPortfolio.length && (
                                            <Group
                                                variant="default"
                                                style={{ flex: '1 0 auto' }}
                                            >
                                                <List
                                                    items={tokens.fromPortfolio}
                                                    renderItem={(token) => (
                                                        <ListItem
                                                            currencyHiddenMap={
                                                                currencyHiddenMap
                                                            }
                                                            currencyPinMap={
                                                                currencyPinMap
                                                            }
                                                            key={
                                                                token.balance
                                                                    .currencyId
                                                            }
                                                            networkMap={
                                                                networkMap
                                                            }
                                                            aria-selected={
                                                                selectedCurrencyId ===
                                                                token.balance
                                                                    .currencyId
                                                            }
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            token={token}
                                                            onClick={() =>
                                                                onMsg({
                                                                    type: 'on_currency_selected',
                                                                    currencyId:
                                                                        token
                                                                            .balance
                                                                            .currencyId,
                                                                })
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Group>
                                        )}

                                        {!!tokens.nonPortfolio.length && (
                                            <Group
                                                variant="default"
                                                style={{ flex: '1 0 auto' }}
                                            >
                                                <List
                                                    items={tokens.nonPortfolio}
                                                    renderItem={(token) => (
                                                        <ListItem
                                                            currencyHiddenMap={
                                                                currencyHiddenMap
                                                            }
                                                            currencyPinMap={
                                                                currencyPinMap
                                                            }
                                                            key={
                                                                token.balance
                                                                    .currencyId
                                                            }
                                                            networkMap={
                                                                networkMap
                                                            }
                                                            aria-selected={
                                                                selectedCurrencyId ===
                                                                token.balance
                                                                    .currencyId
                                                            }
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            token={token}
                                                            onClick={() =>
                                                                onMsg({
                                                                    type: 'on_currency_selected',
                                                                    currencyId:
                                                                        token
                                                                            .balance
                                                                            .currencyId,
                                                                })
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Group>
                                        )}
                                    </>
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </Column2>
            </Column2>
        </Layout2>
    )
}
