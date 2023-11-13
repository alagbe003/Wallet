import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { CurrentNetwork, Network, NetworkMap } from '@zeal/domains/Network'
import { Avatar as NetworkAvatar } from '@zeal/domains/Network/components/Avatar'
import { Name } from '@zeal/domains/Network/components/Name'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { isEqual } from '@zeal/domains/Network/helpers/isEqual'
import { Portfolio } from '@zeal/domains/Portfolio'
import { filterPortfolioByNetwork } from '@zeal/domains/Portfolio/helpers/filterPortfolioByNetwork'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { notReachable } from '@zeal/toolkit'
import { keys } from '@zeal/toolkit/Object'
import { IconButton } from '@zeal/uikit/IconButton'
import { Avatar } from '@zeal/uikit/Avatar'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { SolidInterfacePlus } from '@zeal/uikit/Icon/SolidInterfacePlus'
import { ThreeDotVertical } from '@zeal/uikit/Icon/ThreeDotVertical'
import { Screen } from '@zeal/uikit/Screen'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { TabHeader } from '@zeal/uikit/TabHeader'
import { ScrollView } from 'react-native'

type Props = {
    portfolio: Portfolio | null

    account: Account
    keyStoreMap: KeyStoreMap

    networks: CurrentNetwork[]
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

type NetworkListItem = {
    network: CurrentNetwork
    priceInDefaultCurrency: Money | null
}

type Msg =
    | { type: 'close' }
    | { type: 'on_network_item_click'; network: CurrentNetwork }
    | { type: 'on_add_network_click' }
    | { type: 'on_edit_network_details_click'; network: Network }

type TabState = { type: 'mainnet' | 'testnet' }

export const Layout = ({
    currentNetwork,
    portfolio,
    account,
    keyStoreMap,
    networks,
    currencyHiddenMap,
    networkMap,

    onMsg,
}: Props) => {
    const [currentTab, setCurrentTab] = useState<TabState>(() => {
        switch (currentNetwork.type) {
            case 'all_networks':
                return { type: 'mainnet' }
            case 'specific_network':
                switch (currentNetwork.network.type) {
                    case 'predefined':
                        return { type: 'mainnet' }

                    case 'custom': {
                        const knownNetwork =
                            KNOWN_NETWORKS_MAP[
                                currentNetwork.network.hexChainId
                            ]

                        if (knownNetwork) {
                            return { type: knownNetwork.type }
                        } else {
                            return { type: 'testnet' }
                        }
                    }
                    case 'testnet':
                        return { type: 'testnet' }

                    /* istanbul ignore next */
                    default:
                        return notReachable(currentNetwork.network)
                }

            /* istanbul ignore next */
            default:
                return notReachable(currentNetwork)
        }
    })

    const listItems = createNetworkListItems(
        networks,
        portfolio,
        currencyHiddenMap,
        networkMap
    )
    const grouped = groupByTabState(listItems)

    const currentTabItems = grouped[currentTab.type]
    const tabs = keys(grouped).filter((tab) => grouped[tab].length > 0)

    return (
        <Screen background="light" padding="form">
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

            <Column spacing={16} shrink>
                {tabs.length > 1 && (
                    <Row spacing={12} alignX="stretch">
                        {tabs.map((tabTypeItem) => (
                            <TabHeader
                                key={tabTypeItem}
                                selected={currentTab.type === tabTypeItem}
                                onClick={() =>
                                    setCurrentTab({ type: tabTypeItem })
                                }
                            >
                                {(() => {
                                    switch (tabTypeItem) {
                                        case 'mainnet':
                                            return (
                                                <FormattedMessage
                                                    id="networks.filter.tab.netwokrs"
                                                    defaultMessage="Networks"
                                                />
                                            )
                                        case 'testnet':
                                            return (
                                                <FormattedMessage
                                                    id="networks.filter.tab.testnets"
                                                    defaultMessage="Testnets"
                                                />
                                            )
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(tabTypeItem)
                                    }
                                })()}
                            </TabHeader>
                        ))}

                        <Tertiary
                            color="on_light"
                            size="regular"
                            onClick={() =>
                                onMsg({ type: 'on_add_network_click' })
                            }
                        >
                            <Avatar backgroundColor="surfaceDefault" size={28}>
                                <SolidInterfacePlus size={28} />
                            </Avatar>
                        </Tertiary>
                    </Row>
                )}

                <ScrollView>
                    <Column spacing={16}>
                        <Group variant="default">
                            {currentTabItems.map((listItem) => {
                                const { network, priceInDefaultCurrency } =
                                    listItem
                                const selected = isEqual(
                                    network,
                                    currentNetwork
                                )

                                return (
                                    <ListItem
                                        key={
                                            network.type === 'specific_network'
                                                ? network.network.hexChainId
                                                : network.type
                                        }
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_network_item_click',
                                                network,
                                            })
                                        }
                                        aria-selected={selected}
                                        size="regular"
                                        avatar={({ size }) => (
                                            <NetworkAvatar
                                                size={size}
                                                currentNetwork={network}
                                            />
                                        )}
                                        primaryText={
                                            <Name currentNetwork={network} />
                                        }
                                        side={{
                                            title: portfolio &&
                                                priceInDefaultCurrency && (
                                                    <FormattedTokenBalanceInDefaultCurrency
                                                        money={
                                                            priceInDefaultCurrency
                                                        }
                                                        knownCurrencies={
                                                            portfolio.currencies
                                                        }
                                                    />
                                                ),
                                            rightIcon: ({ size }) => {
                                                switch (network.type) {
                                                    case 'specific_network':
                                                        return (
                                                            <IconButton
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation()
                                                                    onMsg({
                                                                        type: 'on_edit_network_details_click',
                                                                        network:
                                                                            network.network,
                                                                    })
                                                                }}
                                                            >
                                                                <ThreeDotVertical
                                                                    size={size}
                                                                />
                                                            </IconButton>
                                                        )

                                                    case 'all_networks':
                                                        return null

                                                    default:
                                                        return notReachable(
                                                            network
                                                        )
                                                }
                                            },
                                        }}
                                    />
                                )
                            })}
                        </Group>

                        <Group variant="default">
                            <ListItem
                                onClick={() =>
                                    onMsg({ type: 'on_add_network_click' })
                                }
                                aria-selected={false}
                                size="regular"
                                avatar={({ size }) => (
                                    <Avatar
                                        backgroundColor="surfaceDefault"
                                        size={size}
                                    >
                                        <SolidInterfacePlus
                                            color="iconDefault"
                                            size={size}
                                        />
                                    </Avatar>
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="networks.filter.add_networks.title"
                                        defaultMessage="Add networks"
                                    />
                                }
                                shortText={
                                    <FormattedMessage
                                        id="networks.filter.add_networks.subtitle"
                                        defaultMessage="All EVM networks supported"
                                    />
                                }
                            />
                        </Group>
                    </Column>
                </ScrollView>
            </Column>
        </Screen>
    )
}

const groupByTabState = (
    listItems: NetworkListItem[]
): Record<TabState['type'], NetworkListItem[]> =>
    listItems.reduce(
        (result, listItem) => {
            switch (listItem.network.type) {
                case 'all_networks':
                    result.mainnet.push(listItem)
                    break

                case 'specific_network':
                    switch (listItem.network.network.type) {
                        case 'predefined':
                            result.mainnet.push(listItem)
                            break

                        case 'testnet':
                            result.testnet.push(listItem)
                            break

                        case 'custom':
                            {
                                const knownNetwork =
                                    KNOWN_NETWORKS_MAP[
                                        listItem.network.network.hexChainId
                                    ]

                                if (knownNetwork) {
                                    switch (knownNetwork.type) {
                                        case 'mainnet':
                                            result.mainnet.push(listItem)
                                            break

                                        case 'testnet':
                                            result.testnet.push(listItem)
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(
                                                knownNetwork.type
                                            )
                                    }
                                } else {
                                    result.mainnet.push(listItem)
                                }
                            }
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(listItem.network.network)
                    }
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(listItem.network)
            }

            return result
        },
        { mainnet: [] as NetworkListItem[], testnet: [] as NetworkListItem[] }
    )

const createNetworkListItems = (
    currentNetworks: CurrentNetwork[],
    portfolio: Portfolio | null,
    currencyHiddenMap: CurrencyHiddenMap,
    networksMap: NetworkMap
): NetworkListItem[] =>
    currentNetworks
        .map((item): NetworkListItem => {
            switch (item.type) {
                case 'all_networks':
                    return {
                        network: { type: 'all_networks' },
                        priceInDefaultCurrency: portfolio
                            ? sumPortfolio(portfolio, currencyHiddenMap)
                            : null,
                    }

                case 'specific_network':
                    if (!portfolio) {
                        return {
                            network: item,
                            priceInDefaultCurrency: null,
                        }
                    }
                    const filteredPortfolio = filterPortfolioByNetwork(
                        portfolio,
                        { type: 'specific_network', network: item.network },
                        networksMap
                    )

                    return {
                        network: item,
                        priceInDefaultCurrency: sumPortfolio(
                            filteredPortfolio,
                            currencyHiddenMap
                        ),
                    }

                /* istanbul ignore next */
                default:
                    return notReachable(item)
            }
        })
        .sort((a, b) => {
            const aAmount = a?.priceInDefaultCurrency?.amount || 0n
            const bAmount = b?.priceInDefaultCurrency?.amount || 0n

            if (aAmount > bAmount) {
                return -1
            } else if (aAmount < bAmount) {
                return 1
            } else {
                return 0
            }
        })
