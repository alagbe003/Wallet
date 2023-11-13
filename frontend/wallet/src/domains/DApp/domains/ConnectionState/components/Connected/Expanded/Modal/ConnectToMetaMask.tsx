import React from 'react'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { ListItem } from 'src/domains/DApp/components/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { FormattedMessage } from 'react-intl'
import { Connected } from 'src/domains/DApp/domains/ConnectionState'
import { Text } from '@zeal/uikit/Text'
import { ListItemButton } from '@zeal/uikit/ListItem'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'

type Props = {
    connectionState: Connected
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_continue_with_meta_mask' }
    | { type: 'on_connect_to_metamask_click' }

export const ConnectToMetaMask = ({ connectionState, onMsg }: Props) => {
    return (
        <Screen background="light" padding="form">
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

            <Column spacing={12} fillHeight={1}>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connected.expanded.meta_mask_selcted.title"
                                    defaultMessage="Connect"
                                />
                            }
                        />
                    }
                    footer={null}
                >
                    <Column spacing={20}>
                        <ListItem
                            variant="regular"
                            highlightHostName={null}
                            dApp={connectionState.dApp}
                        />
                        <Column spacing={24}>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="connection_state.connected.expanded.meta_mask_selcted.connect_wallets"
                                        defaultMessage="Connect to"
                                    />
                                </Text>
                                <ListItemButton
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_connect_to_metamask_click',
                                        })
                                    }}
                                    avatar={({ size }) => (
                                        <CustomMetamask size={size} />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="connection_state.connect.metamask"
                                            defaultMessage="MetaMask"
                                        />
                                    }
                                    side={{
                                        rightIcon: ({ size }) => (
                                            <LightArrowDown2
                                                size={size}
                                                color="iconDefault"
                                            />
                                        ),
                                    }}
                                />
                            </Column>
                        </Column>
                    </Column>
                </Content>

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_continue_with_meta_mask',
                        })
                    }
                >
                    <FormattedMessage
                        id="connection_state.connect.cancel"
                        defaultMessage="Continue with MetaMask"
                    />
                </Button>
            </Column>
        </Screen>
    )
}
