import {
    DragAndClickHandler,
    Msg as DragAndClickHandlerMsg,
} from 'src/uikit/DragAndClickHandler'
import { noop, notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { DisconnectLogoWithMM } from 'src/uikit/Icon/DisconnectLogoWithMM'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_expand_request' }
    | Extract<DragAndClickHandlerMsg, { type: 'drag' }>

export const Minimize = ({ onMsg }: Props) => {
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
                <DisconnectLogoWithMM size={36} />
            </IconButton>
        </DragAndClickHandler>
    )
}
