import { useEffect } from 'react'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated, Submited } from '@zeal/domains/TransactionRequest'
import { signAndSubmit } from '@zeal/domains/TransactionRequest/api/signAndSubmit'
import {
    CheckConfirmation,
    Msg as CheckConfirmationMsg,
} from 'src/domains/TransactionRequest/features/CheckConfirmation'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import {
    LoadableData,
    useLoadableData,
} from '@zeal/toolkit/LoadableData/LoadableData'

import { components } from '@zeal/api/portfolio'
import { AccountsMap } from '@zeal/domains/Account'
import { ErrorPopup as LedgerErrorPopup } from 'src/domains/Error/domains/Ledger/components/ErrorPopup'
import { ErrorPopup as TrezorErrorPopup } from 'src/domains/Error/domains/Trezor/components/ErrorPopup'
import { SignOnHardwareWalletPopup } from 'src/domains/TransactionRequest/components/SignOnHardwareWalletPopup'
import { keystoreToUserEventType } from 'src/domains/UserEvents'
import { postUserEvent } from 'src/domains/UserEvents/api/postUserEvent'
import { withDelay } from '@zeal/toolkit/delay'
import { Layout, Msg as LayoutMsg, State as LayoutState } from './Layout'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    transactionRequest: Simulated | Submited
    keyStore: SigningKeyStore
    sessionPassword: string

    installationId: string
    source: components['schemas']['TransactionSubmittedEventSource']

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    state: State

    onMsg: (msg: Msg) => void
}

export type State = LayoutState

export type Msg =
    | { type: 'transaction_submited'; transactionRequest: Submited }
    | { type: 'on_sign_cancel_button_clicked' }
    | { type: 'on_sign_with_hw_wallet_cancel_clicked' }
    | Extract<
          CheckConfirmationMsg,
          {
              type:
                  | 'cancellation_confirmed'
                  | 'transaction_cancelled_accepted'
                  | 'on_completed_transaction_close_click'
                  | 'transaction_failure_accepted'
                  | 'on_transaction_completed_splash_animation_screen_competed'
          }
      >
    | LayoutMsg

const calculateState = ({
    transactionRequest,
    keyStore,
    sessionPassword,
    networkMap,
    networkRPCMap,
}: {
    transactionRequest: Simulated | Submited
    keyStore: SigningKeyStore
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): LoadableData<
    Submited,
    {
        transactionRequest: Simulated
        keyStore: SigningKeyStore
        sessionPassword: string
        networkMap: NetworkMap
        networkRPCMap: NetworkRPCMap
    },
    unknown
> => {
    switch (transactionRequest.state) {
        case 'simulated':
            return {
                type: 'loading',
                params: {
                    transactionRequest,
                    keyStore,
                    sessionPassword,
                    networkMap,
                    networkRPCMap,
                },
            }
        case 'submited':
            return {
                type: 'loaded',
                params: {
                    transactionRequest: {
                        account: transactionRequest.account,
                        dApp: transactionRequest.dApp,
                        networkHexId: transactionRequest.networkHexId,
                        rpcRequest: transactionRequest.rpcRequest,
                        selectedFee: transactionRequest.selectedFee,
                        simulation: transactionRequest.simulation,
                        gasEstimate: transactionRequest.gasEstimate,
                        selectedGas: transactionRequest.selectedGas,
                        selectedNonce: transactionRequest.selectedNonce,
                        state: 'simulated',
                    },
                    networkMap,
                    networkRPCMap,
                    keyStore,
                    sessionPassword,
                },
                data: transactionRequest,
            }

        default:
            return notReachable(transactionRequest)
    }
}

const SIGN_ANIMATION_TIME_MS = 1000

export const Sign = ({
    transactionRequest,
    keyStore,
    sessionPassword,
    state,
    onMsg,
    accounts,
    installationId,
    source,
    networkMap,
    networkRPCMap,
    keystores,
}: Props) => {
    const msgLive = useLiveRef(onMsg)
    const transactionRequestLive = useLiveRef(transactionRequest)
    const keystoreLive = useLiveRef(keyStore)
    const [loadable, setLoadable] = useLoadableData(
        withDelay(signAndSubmit, SIGN_ANIMATION_TIME_MS),
        calculateState({
            transactionRequest,
            keyStore,
            sessionPassword,
            networkMap,
            networkRPCMap,
        })
    )

    useEffect(() => {
        postUserEvent({
            type: 'TransactionSubmittedEvent',
            keystoreType: keystoreToUserEventType(keystoreLive.current),
            installationId,
            network: transactionRequestLive.current.networkHexId,
            source,
        })
    }, [installationId, keystoreLive, transactionRequestLive, source])

    useEffect(() => {
        switch (loadable.type) {
            case 'error':
            case 'loading':
                break

            case 'loaded':
                msgLive.current({
                    type: 'transaction_submited',
                    transactionRequest: loadable.data,
                })
                break

            /* istanbul ignore next */
            default:
                notReachable(loadable)
        }
    }, [loadable, msgLive])

    switch (loadable.type) {
        case 'loading':
            return (
                <>
                    <Layout
                        networkMap={networkMap}
                        keystores={keystores}
                        state={state}
                        transactionRequest={loadable.params.transactionRequest}
                        onMsg={onMsg}
                    />
                    {(() => {
                        switch (keyStore.type) {
                            case 'secret_phrase_key':
                            case 'private_key_store':
                            case 'safe_v0':
                                return null

                            case 'trezor':
                            case 'ledger':
                                return (
                                    <SignOnHardwareWalletPopup
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    onMsg({
                                                        type: 'on_sign_with_hw_wallet_cancel_clicked',
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        msg.type
                                                    )
                                            }
                                        }}
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(keyStore)
                        }
                    })()}
                </>
            )

        case 'loaded':
            return (
                <CheckConfirmation
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={loadable.data}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'confirm_speed_up_click':
                                setLoadable((oldLoadable) => ({
                                    type: 'loading',
                                    params: {
                                        transactionRequest: {
                                            ...oldLoadable.params
                                                .transactionRequest,
                                            selectedFee: msg.newFee,
                                        },
                                        keyStore,
                                        sessionPassword,
                                        networkMap,
                                        networkRPCMap,
                                    },
                                }))
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'cancellation_confirmed':
                            case 'on_completed_transaction_close_click':
                            case 'transaction_failure_accepted':
                            case 'on_expand_request':
                            case 'drag':
                            case 'on_minimize_click':
                                onMsg(msg)
                                break
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <>
                    <Layout
                        networkMap={networkMap}
                        keystores={keystores}
                        state={state}
                        transactionRequest={loadable.params.transactionRequest}
                        onMsg={onMsg}
                    />
                    {(() => {
                        switch (error.type) {
                            case 'trezor_connection_already_initialized':
                            case 'trezor_popup_closed':
                            case 'trezor_permissions_not_granted':
                            case 'trezor_method_cancelled':
                            case 'trezor_action_cancelled':
                            case 'trezor_pin_cancelled':
                            case 'trezor_device_used_elsewhere':
                                return (
                                    <TrezorErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_trezor_error_close':
                                                    onMsg({
                                                        type: 'on_sign_cancel_button_clicked',
                                                    })
                                                    break
                                                case 'on_sync_trezor_click':
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

                            case 'ledger_not_running_any_app':
                            case 'hardware_wallet_failed_to_open_device':
                            case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
                            case 'ledger_running_non_eth_app':
                            case 'ledger_is_locked':
                            case 'user_trx_denied_by_user':
                                return (
                                    <LedgerErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_ledger_error_close':
                                                    onMsg({
                                                        type: 'on_sign_cancel_button_clicked',
                                                    })
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
                            /* istanbul ignore next */
                            default:
                                return (
                                    <AppErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    onMsg({
                                                        type: 'on_sign_cancel_button_clicked',
                                                    })
                                                    break

                                                case 'try_again_clicked':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break

                                                default:
                                                    notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
