import { Token } from '@zeal/domains/Token'
import { Account } from '@zeal/domains/Account'
import {
    CurrentNetwork,
    CustomNetwork,
    NetworkMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { ListItem } from 'src/domains/Token/components/ListItem'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { FormattedMessage } from 'react-intl'
import { Portfolio } from '@zeal/domains/Portfolio'
import { SmallWidget } from 'src/domains/Account/components/Widget'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Text2 } from 'src/uikit/Text2'
import { ContentBox, HeaderBox, Layout2 } from 'src/uikit/Layout/Layout2'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { notReachable } from '@zeal/toolkit'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Tokens } from 'src/uikit/Icon/Empty'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Avatar } from 'src/uikit/Avatar'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { BoldSubtract } from 'src/uikit/Icon/BoldSubtract'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'
import { Spam } from 'src/uikit/Icon/Spam'

type Props = {
    account: Account
    selectedNetwork: CurrentNetwork
    networkMap: NetworkMap
    keystore: KeyStore
    portfolio: Portfolio
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof SmallWidget>
    | { type: 'on_token_click'; token: Token }
    | {
          type: 'on_add_custom_currency_click'
          network: TestNetwork | CustomNetwork
      }
    | { type: 'on_show_hidden_token_click' }

export const Layout = ({
    account,
    selectedNetwork,
    portfolio,
    keystore,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const filteredTokens = portfolio.tokens.filter(
        filterByHideMap(currencyHiddenMap)
    )
    return (
        <Layout2
            background={getLayoutBackground(selectedNetwork)}
            padding="main"
        >
            <HeaderBox>
                <SmallWidget
                    currencyHiddenMap={currencyHiddenMap}
                    keystore={keystore}
                    portfolio={portfolio}
                    currentAccount={account}
                    currentNetwork={selectedNetwork}
                    onMsg={onMsg}
                />
            </HeaderBox>

            <ContentBox>
                <Section>
                    <GroupHeader
                        right={null}
                        onClick={() => onMsg({ type: 'close' })}
                        left={<BackIcon size={20} />}
                    />
                    <Row spacing={8}>
                        <Text2
                            variant="title3"
                            weight="bold"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="token.TokensGroupHeader.text"
                                defaultMessage="Tokens"
                            />
                        </Text2>

                        <Spacer2 />

                        {(() => {
                            switch (selectedNetwork.type) {
                                case 'all_networks':
                                    return (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_show_hidden_token_click',
                                                })
                                            }}
                                        >
                                            <Spam size={20} />
                                        </IconButton>
                                    )
                                case 'specific_network':
                                    const net = selectedNetwork.network
                                    switch (net.type) {
                                        case 'predefined':
                                            return (
                                                <IconButton
                                                    onClick={() => {
                                                        onMsg({
                                                            type: 'on_show_hidden_token_click',
                                                        })
                                                    }}
                                                >
                                                    <BoldSubtract size={20} />
                                                </IconButton>
                                            )
                                        case 'custom':
                                        case 'testnet':
                                            return (
                                                <Tertiary
                                                    color="on_light"
                                                    size="regular"
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_add_custom_currency_click',
                                                            network: net,
                                                        })
                                                    }
                                                >
                                                    <Avatar
                                                        backgroundColor="surfaceDefault"
                                                        size={28}
                                                        icon={
                                                            <SolidInterfacePlus
                                                                size={28}
                                                            />
                                                        }
                                                    />
                                                </Tertiary>
                                            )
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(net)
                                    }

                                /* istanbul ignore next */
                                default:
                                    return notReachable(selectedNetwork)
                            }
                        })()}
                    </Row>

                    <Group variant="default" style={{ overflowY: 'auto' }}>
                        {!!filteredTokens.length ? (
                            filteredTokens.map((token) => (
                                <ListItem
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
                                    key={`${token.networkHexId}-${token.balance.currencyId}`}
                                    token={token}
                                    knownCurrencies={portfolio.currencies}
                                />
                            ))
                        ) : (
                            <EmptyState
                                selectedNetwork={selectedNetwork}
                                onAddCustomClick={(testNetwork) =>
                                    onMsg({
                                        type: 'on_add_custom_currency_click',
                                        network: testNetwork,
                                    })
                                }
                            />
                        )}
                    </Group>
                </Section>
            </ContentBox>
        </Layout2>
    )
}

// TODO Move to separate component if it's too much copypaste with other token list empty states
const EmptyState = ({
    selectedNetwork,
    onAddCustomClick,
}: {
    selectedNetwork: CurrentNetwork
    onAddCustomClick: (network: TestNetwork | CustomNetwork) => void
}) => {
    switch (selectedNetwork.type) {
        case 'all_networks':
            return (
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
                />
            )
        case 'specific_network': {
            const net = selectedNetwork.network
            switch (net.type) {
                case 'predefined':
                    return (
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
                        />
                    )
                case 'custom':
                case 'testnet':
                    return (
                        <EmptyStateWidget
                            onClick={() => onAddCustomClick(net)}
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
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(net)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(selectedNetwork)
    }
}
