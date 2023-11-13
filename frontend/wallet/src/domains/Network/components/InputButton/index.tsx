import React from 'react'
import { Avatar } from 'src/domains/Network/components/Avatar'
import { Name } from 'src/domains/Network/components/Name'
import { Network } from '@zeal/domains/Network'
import { Column2 } from 'src/uikit/Column2'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { ListItemButton } from 'src/uikit/ListItem2'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'

type Props = {
    network: Network
    onClick: () => void
}

export type Msg = { type: 'close' }

export const InputButton = ({ network, onClick }: Props) => {
    return (
        <Column2 spacing={8}>
            <Text2 variant="paragraph" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="network.components.input_button_title"
                    defaultMessage="Network"
                />
            </Text2>
            <ListItemButton
                onClick={onClick}
                avatar={({ size }) => (
                    <Avatar
                        currentNetwork={{
                            type: 'specific_network',
                            network: network,
                        }}
                        size={size}
                    />
                )}
                primaryText={
                    <Name
                        currentNetwork={{
                            type: 'specific_network',
                            network: network,
                        }}
                    />
                }
                side={{
                    rightIcon: ({ size }) => (
                        <LightArrowDown2 size={size} color="iconDefault" />
                    ),
                }}
            />
        </Column2>
    )
}
