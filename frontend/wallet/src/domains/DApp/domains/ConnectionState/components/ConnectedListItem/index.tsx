import React from 'react'
import { Connected } from 'src/domains/DApp/domains/ConnectionState'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Avatar as DAppAvatar } from 'src/domains/DApp/components/Avatar'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { NotSelected } from 'src/uikit/Icon/NotSelected'

type Props = {
    connection: Connected
    isSelected: boolean
    onClick: () => void
}

export type Msg = { type: 'close' }

export const ConnectedListItem = ({
    connection,
    isSelected,
    onClick,
}: Props) => {
    const { dApp } = connection
    return (
        <ListItem2
            onClick={onClick}
            aria-selected={false}
            size="regular"
            avatar={({ size }) => (
                <DAppAvatar size={size} dApp={connection.dApp} />
            )}
            primaryText={dApp.title || dApp.hostname}
            shortText={dApp.title ? dApp.hostname : null}
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
