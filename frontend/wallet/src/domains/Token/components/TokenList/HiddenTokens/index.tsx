import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Column } from '@zeal/uikit/Column'
import { Text2 } from 'src/uikit/Text2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Group } from 'src/uikit/Group'
import { ListItem } from 'src/domains/Token/components/ListItem'
import { NetworkMap } from '@zeal/domains/Network'
import { FormattedMessage } from 'react-intl'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { BoldDelete } from 'src/uikit/Icon/BoldDelete'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    portfolio: Portfolio
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'on_token_click'; token: Token }

export const HiddenTokens = ({
    currencyHiddenMap,
    networkMap,
    currencyPinMap,
    portfolio,
    onMsg,
}: Props) => {
    const filterNonHidden = filterByHideMap(currencyHiddenMap)
    const tokens = portfolio.tokens.filter((token) => !filterNonHidden(token))

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'close' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column spacing={12}>
                <Text2 variant="title3" weight="semi_bold" color="textPrimary">
                    <FormattedMessage
                        id="token.hidden_tokens.page.title"
                        defaultMessage="Hidden tokens"
                    />
                </Text2>
                {!!tokens.length ? (
                    <Group variant="default" style={{ overflow: 'auto' }}>
                        {tokens.map((token) => {
                            return (
                                <ListItem
                                    key={token.balance.currencyId}
                                    token={token}
                                    aria-selected={false}
                                    knownCurrencies={portfolio.currencies}
                                    networkMap={networkMap}
                                    currencyHiddenMap={currencyHiddenMap}
                                    currencyPinMap={currencyPinMap}
                                    onClick={() => {
                                        onMsg({ type: 'on_token_click', token })
                                    }}
                                />
                            )
                        })}
                    </Group>
                ) : (
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <BoldDelete size={size} color="iconDefault" />
                        )}
                        title={
                            <FormattedMessage
                                id="hidden_tokens.widget.emptyState"
                                defaultMessage="We found no hidden tokens"
                            />
                        }
                    />
                )}
            </Column>
        </Layout2>
    )
}
