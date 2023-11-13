import React from 'react'
import { IconButton } from 'src/uikit'
import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const ActionBar = ({ onMsg }: Props) => {
    return (
        <UIActionBar
            left={
                <IconButton
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    <BackIcon size={24} />
                </IconButton>
            }
        />
    )
}
