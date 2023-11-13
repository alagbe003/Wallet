import React from 'react'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Network } from '@zeal/domains/Network'
import { Name } from '@zeal/domains/Network/components/Name'
import { Avatar } from 'src/domains/Network/components/Avatar'

type Props = {
    network: Network
    onClick?: () => void
    'aria-selected': boolean
    fullHeight?: boolean
}

export const ListItem = ({
    'aria-selected': selected,
    network,
    onClick,
}: Props) => {
    const currentNetwork = { type: 'specific_network' as const, network }
    return (
        <UIListItem
            onClick={onClick}
            aria-selected={selected}
            size="regular"
            avatar={({ size }) => (
                <Avatar currentNetwork={currentNetwork} size={size} />
            )}
            primaryText={<Name currentNetwork={currentNetwork} />}
        />
    )
}
