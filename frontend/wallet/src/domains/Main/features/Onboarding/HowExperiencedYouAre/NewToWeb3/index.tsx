import { useState } from 'react'

import { WalletStories } from '../WalletStories'
import { notReachable } from '@zeal/toolkit'
import { CreateNewAccount } from 'src/domains/Account/features/CreateNewAccount'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AccountsMap } from '@zeal/domains/Account'

type Props = {
    accountsMap: AccountsMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CreateNewAccount>

type State =
    | {
          type: 'stories'
      }
    | {
          type: 'create_wallet'
      }

export const NewToWeb3 = ({ onMsg, accountsMap, sessionPassword }: Props) => {
    const [state, setState] = useState<State>({ type: 'stories' })

    switch (state.type) {
        case 'stories':
            return (
                <WalletStories
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setState({ type: 'create_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'create_wallet':
            return (
                <CreateNewAccount
                    accounts={accountsMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
