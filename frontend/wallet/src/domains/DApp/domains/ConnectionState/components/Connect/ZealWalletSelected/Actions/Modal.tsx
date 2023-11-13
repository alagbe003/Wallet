import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { ConfirmSafetyCheckConnection } from 'src/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'confirm_connection'; safetyChecks: ConnectionSafetyCheck[] }

export type Msg = MsgOf<typeof ConfirmSafetyCheckConnection>

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_connection':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
