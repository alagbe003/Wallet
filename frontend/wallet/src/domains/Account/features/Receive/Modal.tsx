import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Modal as UIModal } from 'src/uikit/Modal'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { ListItem as NetworkListItem } from 'src/domains/Network/components/ListItem'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import {
    PREDEFINED_NETWORKS,
    TEST_NETWORKS,
} from '@zeal/domains/Network/constants'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'supported_networks_list' }

type Msg = { type: 'close' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'supported_networks_list':
            return (
                <UIModal>
                    <Layout2 background="light" padding="form">
                        <ActionBar
                            left={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            }
                        />
                        <Column2 spacing={16} style={{ overflowY: 'auto' }}>
                            <Text2
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="accountDetails.networks"
                                    defaultMessage="Networks"
                                />
                            </Text2>
                            <Group
                                style={{ flex: '0 0 auto' }}
                                variant="default"
                            >
                                {[...TEST_NETWORKS, ...PREDEFINED_NETWORKS]
                                    .filter((k) => k.isZealRPCSupported)
                                    .map((network) => (
                                        <NetworkListItem
                                            key={network.hexChainId}
                                            aria-selected={false}
                                            network={network}
                                        />
                                    ))}
                            </Group>
                        </Column2>
                    </Layout2>
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
