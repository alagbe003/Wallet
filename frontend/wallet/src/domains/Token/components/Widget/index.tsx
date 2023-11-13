import { FormattedMessage } from 'react-intl'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Token } from '@zeal/domains/Token'
import { Button } from 'src/uikit'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, Section } from 'src/uikit/Group'
import { Tokens } from 'src/uikit/Icon/Empty'
import { ListItem as TokenListItem } from '../ListItem'
import { TokensGroupHeader } from '../TokensGroupHeader'
import { notReachable } from '@zeal/toolkit'
import { useState } from 'react'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    tokens: Token[]
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'show_all_tokens_click' }
    | { type: 'on_token_click'; token: Token }
    | { type: 'on_add_funds_click' }

const NUM_OF_ELEMENTS = 3

export const Widget = ({
    tokens,
    knownCurrencies,
    networkMap,
    currentNetwork,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [labelId] = useState(crypto.randomUUID())
    const filteredTokens = tokens.filter(filterByHideMap(currencyHiddenMap))
    return (
        <Section
            style={{ flex: '0 0 auto' }}
            role="associationlist"
            aria-labelledby={labelId}
        >
            <TokensGroupHeader
                labelId={labelId}
                onClick={
                    filteredTokens.length
                        ? () => onMsg({ type: 'show_all_tokens_click' })
                        : null
                }
                tokens={filteredTokens}
                knownCurrencies={knownCurrencies}
            />
            <Group style={{ flex: '0 0 auto' }} variant="default">
                {filteredTokens.length ? (
                    filteredTokens.slice(0, NUM_OF_ELEMENTS).map((token) => (
                        <TokenListItem
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            networkMap={networkMap}
                            aria-selected={false}
                            onClick={() => {
                                onMsg({
                                    type: 'on_token_click',
                                    token,
                                })
                            }}
                            key={token.balance.currencyId + token.networkHexId}
                            knownCurrencies={knownCurrencies}
                            token={token}
                        />
                    ))
                ) : (
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <Tokens size={size} color="backgroundLight" />
                        )}
                        title={
                            <FormattedMessage
                                id="token.widget.emptyState"
                                defaultMessage="We found no tokens"
                            />
                        }
                        action={(() => {
                            switch (currentNetwork.type) {
                                case 'all_networks':
                                    return (
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_add_funds_click',
                                                })
                                            }
                                        >
                                            <FormattedMessage
                                                id="token.widget.addFunds"
                                                defaultMessage="Add funds"
                                            />
                                        </Button>
                                    )
                                case 'specific_network':
                                    return null

                                default:
                                    notReachable(currentNetwork)
                            }
                        })()}
                    />
                )}
            </Group>
        </Section>
    )
}
