import { notReachable } from '@zeal/toolkit'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { ListItem as NetworkListItem } from 'src/domains/Network/components/ListItem'
import { Text } from '@zeal/uikit/Text'
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
                    <Screen background="light" padding="form">
                        <ActionBar
                            left={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            }
                        />
                        <Column spacing={16} fill>
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="accountDetails.networks"
                                    defaultMessage="Networks"
                                />
                            </Text>
                            <Group scroll variant="default">
                                {[...PREDEFINED_NETWORKS, ...TEST_NETWORKS]
                                    .filter((k) => k.isZealRPCSupported)
                                    .map((network) => (
                                        <NetworkListItem
                                            key={network.hexChainId}
                                            aria-selected={false}
                                            network={network}
                                        />
                                    ))}
                            </Group>
                        </Column>
                    </Screen>
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
