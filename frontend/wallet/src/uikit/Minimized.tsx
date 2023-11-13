import React from 'react'
import { IconButton } from 'src/uikit'
import { ConnectedLogo } from 'src/uikit/Icon/ConnectedLogo'
import {
    DragAndClickHandler,
    Msg as DragAndClickHandlerMsg,
} from 'src/uikit/DragAndClickHandler'
import { noop, notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_expand_request' }
    | Extract<DragAndClickHandlerMsg, { type: 'drag' }>

export const Minimized = ({ onMsg }: Props) => {
    return (
        <DragAndClickHandler
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_click':
                        onMsg({ type: 'on_expand_request' })
                        break
                    case 'drag':
                        onMsg(msg)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        >
            <IconButton onClick={noop}>
                <ConnectedLogo size={36} />
            </IconButton>
        </DragAndClickHandler>
    )
}
