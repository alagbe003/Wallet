import React, { useState } from 'react'
import { ConnectionMap } from 'src/domains/DApp/domains/ConnectionState'
import { notReachable } from '@zeal/toolkit'
import { Flow } from './Flow'
import { SuccessLayout } from 'src/uikit/SuccessLayout'
import { FormattedMessage } from 'react-intl'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

type ForwardMsg = Extract<
    MsgOf<typeof Flow>,
    { type: 'on_disconnect_dapps_click' | 'on_delete_all_dapps_confirm_click' }
>

export type Msg = { type: 'close' } | ForwardMsg

type State = { type: 'flow' } | { type: 'success'; msg: ForwardMsg }

export const Manage = ({ connections, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'flow' })

    switch (state.type) {
        case 'flow':
            return (
                <Flow
                    connections={connections}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_disconnect_dapps_click':
                            case 'on_delete_all_dapps_confirm_click':
                                setState({ type: 'success', msg })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'success':
            // TODO: Maybe the message should be different, taking plural\signular into account or something neutral
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="dapp.connection.manage.disconnect.success.title"
                            defaultMessage="Apps Disconnected"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg(state.msg)
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
