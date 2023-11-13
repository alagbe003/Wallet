import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import {
    ErrorPopup as LedgerErrorPopup,
    Msg as LedgerMsg,
} from 'src/domains/Error/domains/Ledger/components/ErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CancelSimulated, Submited } from '@zeal/domains/TransactionRequest'
import { cancel } from '@zeal/domains/TransactionRequest/api/cancel'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Confirmation, Msg as ConfirmationMsg } from './Confirmation'
import { Layout, Msg as LayoutMsg, State as LayoutState } from './Layout'
import { useEffect } from 'react'
import { cancelSubmittedToSubmitted } from 'src/domains/TransactionRequest/helpers/cancelSubmittedToSubmitted'

export type State = LayoutState

type Props = {
    transactionRequest: CancelSimulated
    keyStore: SigningKeyStore
    sessionPassword: string
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    state: State

    onMsg: (msg: Msg) => void
}

export type Msg =
    | LayoutMsg
    | ConfirmationMsg
    | { type: 'on_cancel_cancellation_click' }
    | { type: 'cancel_submitted'; transactionRequest: Submited }
    | Extract<LedgerMsg, { type: 'on_ledger_error_close' }>

export const Cancel = ({
    transactionRequest,
    keyStore,
    sessionPassword,
    state,
    keystores,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(cancel, {
        type: 'loading',
        params: {
            transactionRequest,
            keyStore,
            sessionPassword,
            networkMap,
            networkRPCMap,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'cancel_submitted',
                    transactionRequest: cancelSubmittedToSubmitted(
                        loadable.data
                    ),
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
        case 'loading':
            return (
                <Layout
                    networkMap={networkMap}
                    kestores={keystores}
                    state={state}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
            return (
                <Confirmation
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    keystores={keystores}
                    state={state}
                    transactionRequest={loadable.data}
                    onMsg={onMsg}
                />
            )

        case 'error': {
            const error = parseAppError(loadable.error)
            return (
                <>
                    <Layout
                        networkMap={networkMap}
                        kestores={keystores}
                        state={state}
                        transactionRequest={transactionRequest}
                        onMsg={onMsg}
                    />
                    {(() => {
                        switch (error.type) {
                            case 'hardware_wallet_failed_to_open_device':
                            case 'ledger_not_running_any_app':
                            case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
                            case 'ledger_running_non_eth_app':
                            case 'ledger_is_locked':
                                return (
                                    <LedgerErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_ledger_error_close':
                                                    onMsg(msg)
                                                    break
                                                case 'on_sync_ledger_click':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={parseAppError(loadable.error)}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    onMsg({
                                                        type: 'on_cancel_cancellation_click',
                                                    })
                                                    break

                                                case 'try_again_clicked':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )
        }

        default:
            return notReachable(loadable)
    }
}
