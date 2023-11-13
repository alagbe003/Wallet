import { notReachable } from '@zeal/toolkit'
import { SourceOfFundsDescription } from './SourceOfFundsDescription'
import { MsgOf } from '@zeal/toolkit/MsgOf'

export type State = { type: 'closed' } | { type: 'source_of_funds_description' }

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SourceOfFundsDescription>
export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'source_of_funds_description':
            return <SourceOfFundsDescription onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
