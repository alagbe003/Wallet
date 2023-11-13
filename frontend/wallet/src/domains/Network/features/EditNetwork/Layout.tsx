import { FormattedMessage } from 'react-intl'
import {
    CustomNetwork,
    Network,
    NetworkRPC,
    NetworkRPCMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { ListItem } from 'src/domains/Network/components/ListItem'
import { getNetworkRPC } from '@zeal/domains/Network/helpers/getNetworkRPC'
import { Portfolio } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldNetwork } from 'src/uikit/Icon/BoldNetwork'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { LightEdit } from 'src/uikit/Icon/LightEdit'
import { NotSelected } from 'src/uikit/Icon/NotSelected'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { SolidZeal } from 'src/uikit/Icon/SolidZeal'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Popup } from 'src/uikit/Popup'
import { Text2 } from 'src/uikit/Text2'

export type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    portfolio: Portfolio | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_predefined_network_info_click' }
    | { type: 'on_add_custom_rpc_click' }
    | { type: 'on_edit_custom_rpc_click'; rpcUrl: string }
    | { type: 'on_select_rpc_click'; network: Network; networkRPC: NetworkRPC }

export const Layout = ({ network, networkRPCMap, portfolio, onMsg }: Props) => {
    const networkRPC = getNetworkRPC({ network, networkRPCMap })

    return (
        <Popup.Layout onMsg={onMsg}>
            <Column2 spacing={12}>
                <Group variant="default">
                    <ListItem
                        fullHeight
                        aria-selected={false}
                        network={network}
                    />
                </Group>

                <Column2 spacing={8}>
                    <GroupHeader
                        left={
                            <FormattedMessage
                                id="editNetwork.networkRPC"
                                defaultMessage="Network RPC"
                            />
                        }
                        right={null}
                    />

                    <Group variant="default">
                        {(() => {
                            switch (network.type) {
                                case 'predefined':
                                case 'testnet':
                                    return (
                                        <PredefinedNetworkDefaultRPC
                                            network={network}
                                            networkRPC={networkRPC}
                                            onMsg={onMsg}
                                        />
                                    )

                                case 'custom':
                                    return (
                                        <CustomNetworkDefaultRPC
                                            network={network}
                                            networkRPC={networkRPC}
                                            onMsg={onMsg}
                                        />
                                    )

                                default:
                                    return notReachable(network)
                            }
                        })()}
                    </Group>

                    <Group variant="default">
                        {networkRPC.available.length === 0 ? (
                            <ListItem2
                                onClick={() => {
                                    onMsg({
                                        type: 'on_add_custom_rpc_click',
                                    })
                                }}
                                aria-selected={false}
                                size="regular"
                                avatar={({ size }) => (
                                    <SolidInterfacePlus
                                        size={size}
                                        color="iconDefault"
                                    />
                                )}
                                primaryText={
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="editNetwork.addCustomRPC"
                                            defaultMessage="Add custom RPC node"
                                        />
                                    </Text2>
                                }
                            />
                        ) : (
                            networkRPC.available.map((url) => (
                                <CustomRPC
                                    key={url}
                                    network={network}
                                    networkRPC={networkRPC}
                                    url={url}
                                    onMsg={onMsg}
                                />
                            ))
                        )}
                    </Group>
                </Column2>
            </Column2>
        </Popup.Layout>
    )
}

export const PredefinedNetworkDefaultRPC = ({
    network,
    networkRPC,
    onMsg,
}: {
    network: PredefinedNetwork | TestNetwork
    networkRPC: NetworkRPC
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return true
            case 'custom':
                return false
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <ListItem2
            fullHeight
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'default',
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-selected={isSelected}
            size="regular"
            avatar={({ size }) => <SolidZeal size={size} />}
            primaryText={
                <FormattedMessage
                    id="editNetwork.zealRPCNode"
                    defaultMessage="Zeal RPC Node"
                />
            }
            primaryTextIcon={({ size }) => (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onMsg({
                            type: 'on_predefined_network_info_click',
                        })
                    }}
                >
                    <InfoCircle size={size} color="iconDefault" />
                </Tertiary>
            )}
            side={{
                rightIcon: ({ size }) =>
                    isSelected ? (
                        <Checkbox size={size} color="iconAccent2" />
                    ) : (
                        <NotSelected size={size} color="iconDefault" />
                    ),
            }}
        />
    )
}

export const CustomNetworkDefaultRPC = ({
    network,
    networkRPC,
    onMsg,
}: {
    network: CustomNetwork
    networkRPC: NetworkRPC
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return true
            case 'custom':
                return false
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <ListItem2
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'default',
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-selected={isSelected}
            size="regular"
            avatar={({ size }) => (
                <BoldNetwork size={size} color="iconAccent2" />
            )}
            primaryText={
                <FormattedMessage
                    id="editNetwork.defaultRPC"
                    defaultMessage="Default RPC"
                />
            }
            shortText={network.rpcUrl}
            side={{
                rightIcon: ({ size }) =>
                    isSelected ? (
                        <Checkbox size={size} color="iconAccent2" />
                    ) : (
                        <NotSelected size={size} color="iconDefault" />
                    ),
            }}
        />
    )
}

export const CustomRPC = ({
    network,
    networkRPC,
    url,
    onMsg,
}: {
    network: Network
    networkRPC: NetworkRPC
    url: string
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return false
            case 'custom':
                return networkRPC.current.url === url
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <ListItem2
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'custom',
                            url,
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-selected={isSelected}
            size="regular"
            avatar={({ size }) => (
                <BoldNetwork size={size} color="iconAccent2" />
            )}
            primaryText={
                <FormattedMessage
                    id="editNetwork.customRPCNode"
                    defaultMessage="Custom RPC node"
                />
            }
            primaryTextIcon={({ size }) => (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onMsg({
                            type: 'on_edit_custom_rpc_click',
                            rpcUrl: url,
                        })
                    }}
                >
                    <LightEdit size={size} color="iconDefault" />
                </Tertiary>
            )}
            shortText={url}
            side={{
                rightIcon: ({ size }) =>
                    isSelected ? (
                        <Checkbox size={size} color="iconAccent2" />
                    ) : (
                        <NotSelected size={size} color="iconDefault" />
                    ),
            }}
        />
    )
}
