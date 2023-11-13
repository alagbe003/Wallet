import { useState } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { HowExperiencedYouAre } from './Layout'
import { NewToWeb3 } from './NewToWeb3'
import { UsedWeb3Before } from './UsedWeb3Before'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    accountsMap: AccountsMap
    customCurrencies: CustomCurrencyMap
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    onMsg: (msg: Msg) => void
}

type State = 'how_experienced_you_are' | 'used_web3_before' | 'new_to_web3'

type Msg =
    | Extract<
          MsgOf<typeof UsedWeb3Before>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | MsgOf<typeof NewToWeb3>

export const GetStarted = ({
    onMsg,
    accountsMap,
    customCurrencies,
    sessionPassword,
    networkMap,
    networkRPCMap,
}: Props) => {
    const [state, setState] = useState<State>('how_experienced_you_are')

    switch (state) {
        case 'how_experienced_you_are':
            return (
                <HowExperiencedYouAre
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_used_web3_before_click':
                                setState('used_web3_before')
                                break

                            case 'on_new_to_web3_click':
                                setState('new_to_web3')
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'used_web3_before':
            return (
                <UsedWeb3Before
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState('how_experienced_you_are')
                                break

                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'new_to_web3':
            return (
                <NewToWeb3
                    accountsMap={accountsMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
