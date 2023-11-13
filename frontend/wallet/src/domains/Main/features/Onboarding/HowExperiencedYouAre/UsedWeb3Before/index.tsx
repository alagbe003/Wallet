import { useState } from 'react'

import { AccountsMap } from '@zeal/domains/Account'
import { TrackWallet } from 'src/domains/Account/features/TrackWallet'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { WalletStories } from '../WalletStories'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    accountsMap: AccountsMap
    customCurrencies: CustomCurrencyMap
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof TrackWallet>

type State = { type: 'stories' } | { type: 'track_account' }

export const UsedWeb3Before = ({
    onMsg,
    accountsMap,
    customCurrencies,
    sessionPassword,
    networkMap,
    networkRPCMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'stories' })

    switch (state.type) {
        case 'stories':
            return (
                <WalletStories
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setState({ type: 'track_account' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'track_account':
            return (
                <TrackWallet
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    variant="track_or_create"
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
