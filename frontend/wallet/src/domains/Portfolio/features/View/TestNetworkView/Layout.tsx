import { Column2 } from 'src/uikit/Column2'

import { TopupTestNetworkNotification } from '../TopupTestNetworkNotification'
import { Group, Section } from 'src/uikit/Group'
import { TokensGroupHeader } from 'src/domains/Token/components/TokensGroupHeader'
import { CustomNetwork, NetworkMap, TestNetwork } from '@zeal/domains/Network'
import { Token } from '@zeal/domains/Token'
import { ListItem as TokenListItem } from 'src/domains/Token/components/ListItem'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Tokens } from 'src/uikit/Icon/Empty'
import { FormattedMessage } from 'react-intl'
import { Spacer2 } from 'src/uikit/Spacer2'
import { LastRefreshed } from '../LastRefreshed'
import { notReachable } from '@zeal/toolkit'
import { useState } from 'react'

type Props = {
    network: TestNetwork | CustomNetwork
    tokens: Token[]
    fetchedAt: Date
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_add_custom_currency_click' }
    | { type: 'show_all_tokens_click' }
    | { type: 'reload_button_click' }
    | { type: 'on_token_click'; token: Token }

const NUM_OF_ELEMENTS = 3

export const Layout = ({
    network,
    tokens,
    knownCurrencies,
    networkMap,
    fetchedAt,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [tokensLabelId] = useState(crypto.randomUUID())
    return (
        <Column2 spacing={16}>
            {(() => {
                switch (network.type) {
                    case 'testnet':
                        return (
                            <TopupTestNetworkNotification
                                testNetwork={network}
                            />
                        )
                    case 'custom':
                        return null
                    /* istanbul ignore next */
                    default:
                        return notReachable(network)
                }
            })()}

            <Section
                style={{ flex: '0 0 auto' }}
                aria-labelledby={tokensLabelId}
            >
                <TokensGroupHeader
                    labelId={tokensLabelId}
                    onClick={
                        tokens.length
                            ? () => onMsg({ type: 'show_all_tokens_click' })
                            : null
                    }
                    tokens={tokens}
                    knownCurrencies={knownCurrencies}
                />
                <Group style={{ flex: '0 0 auto' }} variant="default">
                    {tokens.length ? (
                        tokens.slice(0, NUM_OF_ELEMENTS).map((token) => (
                            <TokenListItem
                                currencyHiddenMap={currencyHiddenMap}
                                currencyPinMap={currencyPinMap}
                                aria-selected={false}
                                networkMap={networkMap}
                                onClick={() => {
                                    onMsg({
                                        type: 'on_token_click',
                                        token,
                                    })
                                }}
                                key={
                                    token.balance.currencyId +
                                    token.networkHexId
                                }
                                knownCurrencies={knownCurrencies}
                                token={token}
                            />
                        ))
                    ) : (
                        <EmptyStateWidget
                            onClick={() =>
                                onMsg({ type: 'on_add_custom_currency_click' })
                            }
                            size="regular"
                            icon={({ size }) => (
                                <Tokens size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="token.widget.addTokens"
                                    defaultMessage="Add tokens"
                                />
                            }
                        />
                    )}
                </Group>
            </Section>

            <Spacer2 />

            <LastRefreshed
                fetchedAt={fetchedAt}
                onClick={() => onMsg({ type: 'reload_button_click' })}
            />
        </Column2>
    )
}
