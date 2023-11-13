import React, { useEffect, useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Success } from './Success'
import { AddForm } from './Form'
import { Confirm } from './Confirm'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { v4 as uuid } from 'uuid'
import { encrypt } from '@zeal/toolkit/Crypto'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'password_added'
    sessionPassword: string
    encryptedPassword: string
}

type State =
    | { type: 'form'; initialPassword: string }
    | { type: 'confirm'; password: string }
    | { type: 'success'; sessionPassword: string; encryptedPassword: string }

export const Add = ({ onMsg }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        async ({ password }: { password: string }) => {
            const sessionPassword = uuid()
            const encryptedPassword = await encrypt(password, {
                password: sessionPassword,
            })
            return { sessionPassword, encryptedPassword }
        }
    )

    const [state, setState] = useState<State>({
        type: 'form',
        initialPassword: '',
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
                break
            case 'loading':
                break
            case 'loaded':
                setState({
                    type: 'success',
                    sessionPassword: loadable.data.sessionPassword,
                    encryptedPassword: loadable.data.encryptedPassword,
                })
                break
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (state.type) {
        case 'form':
            return (
                <AddForm
                    initialPassword={state.initialPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'password_added':
                                setState({
                                    type: 'confirm',
                                    password: msg.password,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'confirm':
            return (
                <Confirm
                    isPending={loadable.type === 'loading'}
                    password={state.password}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({
                                    type: 'form',
                                    initialPassword: state.password,
                                })
                                break
                            case 'password_confirmed':
                                setLoadable({
                                    type: 'loading',
                                    params: { password: msg.password },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'success':
            return (
                <Success
                    onSuccess={() => {
                        onMsg({
                            type: 'password_added',
                            encryptedPassword: state.encryptedPassword,
                            sessionPassword: state.sessionPassword,
                        })
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
