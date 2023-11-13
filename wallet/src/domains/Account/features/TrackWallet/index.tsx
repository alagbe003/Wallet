import { useState } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { CreateNewAccount } from 'src/domains/Account/features/CreateNewAccount'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Track } from './Track'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    accountsMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    customCurrencies: CustomCurrencyMap
    sessionPassword: string
    variant: 'track' | 'track_or_create'
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof CreateNewAccount>
    | Extract<
          MsgOf<typeof Track>,
          {
              type:
                  | 'close'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

type State = { type: 'track' } | { type: 'create_wallet' }

export const TrackWallet = ({
    accountsMap,
    customCurrencies,
    sessionPassword,
    variant,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'track' })

    switch (state.type) {
        case 'track':
            return (
                <Track
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    variant={variant}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'on_create_wallet_instead_clicked':
                                setState({ type: 'create_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'create_wallet':
            return (
                <CreateNewAccount
                    sessionPassword={sessionPassword}
                    accounts={accountsMap}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
