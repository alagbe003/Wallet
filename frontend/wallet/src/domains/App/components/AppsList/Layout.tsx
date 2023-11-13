import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { App, AppNft, AppProtocol, AppToken } from '@zeal/domains/App'
import { tokensFromProtocol } from '@zeal/domains/App/helpers/tokensFromProtocol'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Name } from 'src/domains/Network/components/Name'
import { sumAppsInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Chain } from 'src/uikit/Chain'
import { Column2 } from 'src/uikit/Column2'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Group } from 'src/uikit/Group'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { BoldStarWithinCircle } from 'src/uikit/Icon/BoldStarWithinCircle'
import { Filter2 } from 'src/uikit/Icon/Filter2'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'
import { ListItem } from '../ListItem'

type Props = {
    apps: App[]
    account: Account
    currincies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    keystore: KeyStore
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'network_filter_click' }
    | MsgOf<typeof ListItem>

type State = { searchInput: string }

export const Layout = ({
    apps,
    account,
    selectedNetwork,
    keystore,
    currincies,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ searchInput: '' })

    const filteredApps =
        state.searchInput.length === 0
            ? apps
            : apps.filter((app) => {
                  const searchInput = state.searchInput.toLowerCase()

                  return searchMatchesApp(app, searchInput)
              })

    const sum = sumAppsInDefaultCurrency(apps)

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                account={account}
                keystore={keystore}
                network={null}
                right={
                    <Row shrink={false} spacing={4}>
                        <Tertiary
                            size="small"
                            color="on_light"
                            onClick={() => {
                                onMsg({ type: 'network_filter_click' })
                            }}
                        >
                            <Name currentNetwork={selectedNetwork} />
                            <Filter2 size={14} />
                        </Tertiary>
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <CloseCross size={24} />
                        </IconButton>
                    </Row>
                }
            />

            <Column2 spacing={12}>
                <Text variant="title3" weight="semi_bold" color="textPrimary">
                    <Chain>
                        <FormattedMessage
                            id="apps_list.page.title"
                            defaultMessage="DeFi"
                        />

                        {sum && (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={sum}
                                knownCurrencies={currincies}
                            />
                        )}
                    </Chain>
                </Text>

                <Input2
                    variant="regular"
                    value={state.searchInput}
                    onChange={(e) => {
                        setState({
                            searchInput: e.target.value,
                        })
                    }}
                    state="normal"
                    placeholder="Search"
                />

                {!filteredApps.length ? (
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <BoldStarWithinCircle size={size} />
                        )}
                        title={
                            <FormattedMessage
                                id="apps_list.page.emptyState"
                                defaultMessage="We found no apps here"
                            />
                        }
                    />
                ) : (
                    <Group style={{ overflowY: 'auto' }} variant="default">
                        {filteredApps.map((app) => {
                            return (
                                <ListItem
                                    networkMap={networkMap}
                                    key={`${app.networkHexId}-${app.name}`}
                                    app={app}
                                    knownCurrencies={currincies}
                                    onMsg={onMsg}
                                />
                            )
                        })}
                    </Group>
                )}
            </Column2>
        </Layout2>
    )
}

const searchMatchesApp = (app: App, searchInput: string) => {
    return (
        app.name.toLowerCase().includes(searchInput) ||
        app.protocols.some((protocol) =>
            searchMatchesProtocol(protocol, searchInput)
        )
    )
}

const searchMatchesProtocol = (protocol: AppProtocol, searchInput: string) => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
        case 'LendingAppProtocol':
        case 'LockedTokenAppProtocol':
        case 'VestingAppProtocol':
            return (
                protocol.category.includes(searchInput) ||
                searchMatchesTokensList(
                    tokensFromProtocol(protocol),
                    searchInput
                )
            )

        case 'UnknownAppProtocol':
            return (
                protocol.category.includes(searchInput) ||
                searchMatchesTokensList(
                    tokensFromProtocol(protocol),
                    searchInput
                ) ||
                searchMatchesNftsList(protocol.nfts, searchInput)
            )
        default:
            return notReachable(protocol)
    }
}

const searchMatchesTokensList = (list: AppToken[], searchInput: string) => {
    return list.some((token) => searchMatchesAppToken(token, searchInput))
}

const searchMatchesAppToken = (token: AppToken, searchInput: string) => {
    return (
        token.name.toLowerCase().includes(searchInput) ||
        token.address.toLowerCase().includes(searchInput)
    )
}

const searchMatchesNftsList = (list: AppNft[], searchInput: string) => {
    return list.some((nft) => searchMatchesAppNft(nft, searchInput))
}

const searchMatchesAppNft = (nft: AppNft, searchInput: string) => {
    if (!nft.name) {
        return false
    }

    return (
        nft.name.toLowerCase().includes(searchInput) ||
        nft.tokenId.toLowerCase().includes(searchInput)
    )
}
