import React from 'react'
import { Disconnected } from '../..'
import { IconButton } from 'src/uikit'
import { DisconnectedLogo } from 'src/uikit/Icon/DisconnectedLogo'
import { noop, notReachable } from '@zeal/toolkit'
import {
    DragAndClickHandler,
    Msg as DragAndClickHandlerMsg,
} from 'src/uikit/DragAndClickHandler'
import { useIntl } from 'react-intl'

type Props = {
    state: Disconnected
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_expand_request' }
    | Extract<DragAndClickHandlerMsg, { type: 'drag' }>

export const Minimized = ({ onMsg }: Props) => {
    const { formatMessage } = useIntl()
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
            <IconButton
                aria-label={formatMessage({
                    id: 'zwidget.minimizedDisconnected.label',
                    defaultMessage: 'Zeal Disconnected',
                })}
                onClick={noop}
            >
                <DisconnectedLogo size={36} />
            </IconButton>
        </DragAndClickHandler>
    )
}
