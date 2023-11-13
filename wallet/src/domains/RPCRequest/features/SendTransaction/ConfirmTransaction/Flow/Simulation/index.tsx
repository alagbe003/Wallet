import { useEffect, useState } from 'react'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'

import { AccountsMap } from '@zeal/domains/Account'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
    FeePresetMap,
    fetchFeeForecast,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'
import { getSuggestedGasLimit } from '../../../helpers/getSuggestedGasLimit'
import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'
import { getDefaultFeePreset } from '@zeal/domains/Transactions/helpers/getDefaultFeePreset'

type Props = {
    transactionRequest: NotSigned
    simulation: SimulateTransactionResponse
    nonce: number
    gasEstimate: string

    accounts: AccountsMap
    keystores: KeyStoreMap

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    state: State

    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_minimize_click'
                  | 'import_keys_button_clicked'
                  | 'on_edit_approval_form_submit'
          }
      >
    | Extract<
          ModalMsg,
          {
              type:
                  | 'keystore_added'
                  | 'password_added'
                  | 'on_predefined_fee_preset_selected'
          }
      >
    | MinimizedMsg

export type State = { type: 'minimised' } | { type: 'maximised' }

const POLLING_INTERVAL = 16000

export const Simulation = ({
    simulation,
    nonce,
    gasEstimate,
    transactionRequest,
    state,
    accounts,
    keystores,
    networkMap,
    networkRPCMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)

    const [forecastFeePollable, setForecastFeePollable] = usePollableData<
        FeeForecastResponse,
        FeeForecastRequest
    >(
        fetchFeeForecast,
        {
            type: 'loading',
            params: {
                gasEstimate,
                address: transactionRequest.account.address,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
                gasLimit: getSuggestedGasLimit(gasEstimate),
                selectedPreset: getDefaultFeePreset({
                    feePresetMap,
                    networkHexId: transactionRequest.networkHexId,
                }),
                sendTransactionRequest: transactionRequest.rpcRequest,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: POLLING_INTERVAL,
        }
    )

    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [forecastFeePollable])

    useEffect(() => {
        switch (forecastFeePollable.type) {
            case 'loading':
            case 'loaded':
            case 'reloading':
                break
            case 'subsequent_failed':
            case 'error':
                captureError(forecastFeePollable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(forecastFeePollable)
        }
    }, [forecastFeePollable])

    switch (state.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />
        case 'maximised':
            return (
                <>
                    <Layout
                        networkMap={networkMap}
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        keystores={keystores}
                        accounts={accounts}
                        pollingStartedAt={pollingStartedAt}
                        pollingInterval={POLLING_INTERVAL}
                        pollableData={forecastFeePollable}
                        transactionRequest={transactionRequest}
                        simulation={simulation}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_cancel_confirm_transaction_clicked':
                                case 'on_minimize_click':
                                case 'import_keys_button_clicked':
                                case 'on_edit_approval_form_submit':
                                    onMsg(msg)
                                    break
                                case 'on_approval_info_click':
                                    setModalState({ type: 'approval_info' })
                                    break

                                case 'continue_button_clicked':
                                    onMsg({
                                        type: 'user_confirmed_transaction_for_signing',
                                        keyStore: msg.keyStore,
                                        transactionRequest: msg.simulated,
                                    })
                                    break

                                case 'on_forecast_fee_click':
                                    setModalState({ type: 'edit_fee_modal' })
                                    break
                                case 'user_confirmation_requested':
                                    setModalState({
                                        type: 'user_confirmation_required',
                                        reason: msg.reason,
                                    })
                                    break

                                case 'on_forecast_fee_error_reload_click':
                                    setForecastFeePollable({
                                        type: 'loading',
                                        params: forecastFeePollable.params,
                                    })
                                    break
                                case 'on_forecast_subsequent_failed_reload_click':
                                    setForecastFeePollable({
                                        type: 'reloading',
                                        params: forecastFeePollable.params,
                                        data: msg.data,
                                    })
                                    break

                                case 'safety_checks_clicked':
                                    setModalState({ type: 'safety_checks' })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />

                    <Modal
                        keystoreMap={keystores}
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        pollingStartedAt={pollingStartedAt}
                        transactionRequest={transactionRequest}
                        simulateTransactionResponse={simulation}
                        pollingInterval={POLLING_INTERVAL}
                        pollable={forecastFeePollable}
                        state={modalState}
                        knownCurrencies={simulation.currencies}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'pollable_params_changed':
                                    switch (forecastFeePollable.type) {
                                        case 'loading':
                                        case 'error':
                                            setForecastFeePollable({
                                                ...forecastFeePollable,
                                                type: 'loading',
                                                params: msg.params,
                                            })
                                            break
                                        case 'loaded':
                                        case 'reloading':
                                        case 'subsequent_failed':
                                            setForecastFeePollable({
                                                ...forecastFeePollable,
                                                params: msg.params,
                                                type: 'reloading',
                                            })

                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(
                                                forecastFeePollable
                                            )
                                    }

                                    break
                                case 'close':
                                    setModalState({ type: 'closed' })
                                    break
                                case 'user_confirmed_transaction_for_signing':
                                    onMsg(msg)
                                    break

                                case 'on_predefined_fee_preset_selected':
                                    setForecastFeePollable({
                                        ...forecastFeePollable,
                                        params: {
                                            ...forecastFeePollable.params,
                                            selectedPreset: msg.preset,
                                        },
                                    })
                                    onMsg(msg)
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
