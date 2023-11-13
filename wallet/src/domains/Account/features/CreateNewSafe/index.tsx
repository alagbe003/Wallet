import { AccountsMap } from '@zeal/domains/Account'
import { NetworkRPCMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { useState } from 'react'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { CreateSafe } from './CreateSafe'
import { CreatePasskey, PasskeyV0 } from './CreatePasskey'

type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CreateSafe> | { type: 'close' }

type State =
    | { type: 'create_passkey' }
    | { type: 'create_safe'; passkey: PasskeyV0 }

export const CreateNewSafe = ({
    accountsMap,
    networkRPCMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'create_passkey' })

    switch (state.type) {
        case 'create_passkey':
            return (
                <CreatePasskey
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_passkey_created':
                                setState({
                                    type: 'create_safe',
                                    passkey: msg.passkey,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'create_safe':
            return (
                <CreateSafe
                    passkey={state.passkey}
                    accountsMap={accountsMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
