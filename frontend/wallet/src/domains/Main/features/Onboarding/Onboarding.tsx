import { useState } from 'react'
import { Onboarding as OnboardingEntrypoint } from '@zeal/domains/Main'
import { Storage } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { GetStarted } from './GetStarted'
import { StorageValidator } from './StorageValidator'
import { State as WelcomeState } from './WelcomeToZeal'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    entryPoint: OnboardingEntrypoint

    storage: Storage | null
    sessionPassword: string | null
    networkMap: NetworkMap

    installationId: string

    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'getting_started' }
    | { type: 'onboarding_flow'; flow: WelcomeState }

type Msg = Extract<
    MsgOf<typeof StorageValidator>,
    {
        type:
            | 'on_account_create_request'
            | 'on_accounts_create_success_animation_finished'
    }
>

export const Onboarding = ({
    sessionPassword,
    storage,
    installationId,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'getting_started' })

    switch (state.type) {
        case 'getting_started':
            return (
                <GetStarted
                    onImportClicked={() =>
                        setState({
                            type: 'onboarding_flow',
                            flow: 'restore_existing',
                        })
                    }
                    onGetStartedClicked={() =>
                        setState({
                            type: 'onboarding_flow',
                            flow: 'get_started',
                        })
                    }
                />
            )

        case 'onboarding_flow':
            return (
                <StorageValidator
                    networkMap={networkMap}
                    installationId={installationId}
                    flowState={state.flow}
                    sessionPassword={sessionPassword}
                    storage={storage}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                setState({ type: 'getting_started' })
                                break

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

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
