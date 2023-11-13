import { FormattedMessage } from 'react-intl'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EditNetwork } from 'src/domains/Network/features/EditNetwork'
import { Portfolio } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Avatar } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { ChainList } from 'src/uikit/Icon/ChainList'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Popup } from 'src/uikit/Popup'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    networkRPCMap: NetworkRPCMap
    portfolio: Portfolio | null
    state: State
    onMsg: (msg: Msg) => void
}

const CHAIN_LIST_URL = 'https://chainlist.org/'

export type State =
    | { type: 'closed' }
    | { type: 'add_network_tips' }
    | { type: 'edit_network_details'; network: Network }

type Msg = { type: 'close' } | MsgOf<typeof EditNetwork>

export const Modal = ({ networkRPCMap, portfolio, state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'add_network_tips':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="networks.filter.add_modal.add_networks"
                                defaultMessage="Add networks"
                            />
                        }
                    />

                    <Column2 spacing={16}>
                        <Group variant="default">
                            <ListItem2
                                onClick={() =>
                                    window.open(CHAIN_LIST_URL, '_blank')
                                }
                                aria-selected={false}
                                size="regular"
                                avatar={({ size }) => (
                                    <Avatar
                                        backgroundColor="surfaceDefault"
                                        size={size}
                                        icon={<ChainList size={size} />}
                                    />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="networks.filter.add_modal.chain_list.title"
                                        defaultMessage="Go to Chainlist"
                                    />
                                }
                                shortText={
                                    <FormattedMessage
                                        id="networks.filter.add_modal.chain_list.subtitle"
                                        defaultMessage="Add any EVM networks"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ExternalLink
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />
                        </Group>

                        <Group variant="default">
                            <Column2 spacing={8}>
                                <Text2
                                    color="textPrimary"
                                    weight="regular"
                                    variant="paragraph"
                                >
                                    <FormattedMessage
                                        id="networks.filter.add_modal.dapp_tip.title"
                                        defaultMessage="Or add a network from any dApp"
                                    />
                                </Text2>

                                <Text2
                                    color="textSecondary"
                                    weight="regular"
                                    variant="paragraph"
                                >
                                    <FormattedMessage
                                        id="networks.filter.add_modal.dapp_tip.subtitle"
                                        defaultMessage="In your favourite dApps, simply switch to the EVM network you want to use and Zeal will ask you if you want to add it to your wallet."
                                    />
                                </Text2>
                            </Column2>
                        </Group>
                    </Column2>
                </Popup.Layout>
            )

        case 'edit_network_details':
            return (
                <EditNetwork
                    network={state.network}
                    networkRPCMap={networkRPCMap}
                    portfolio={portfolio}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
