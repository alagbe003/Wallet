import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

import { components } from '@zeal/api/portfolio'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    NotSigned,
    Simulated,
    Submited,
} from '@zeal/domains/TransactionRequest'
import { State as SignState } from 'src/domains/TransactionRequest/features/Sign'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    ConfirmTransaction,
    FetchSimulationByRequest,
} from './ConfirmTransaction'
import { SignAndSubmit } from 'src/domains/TransactionRequest/features/SignAndSubmit'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    sendTransactionRequest: EthSendTransaction
    sessionPassword: string

    account: Account
    network: Network
    networkRPCMap: NetworkRPCMap
    dApp: DAppSiteInfo | null

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    installationId: string
    source: components['schemas']['TransactionSubmittedEventSource']

    fetchSimulationByRequest: FetchSimulationByRequest

    state: State

    onMsg: (msg: Msg) => void
}

export type State = SignState

type InternalState =
    | {
          type: 'confirm_transaction'
          network: Network
          account: Account
          transactionRequest: NotSigned
      }
    | {
          type: 'sign_and_submit_transaction'
          keyStore: SigningKeyStore
          transactionRequest: Simulated | Submited
      }

export type Msg =
    | Extract<
          MsgOf<typeof ConfirmTransaction>,
          {
              type:
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_minimize_click'
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
          }
      >
    | Extract<
          MsgOf<typeof SignAndSubmit>,
          {
              type:
                  | 'drag'
                  | 'on_expand_request'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_cancelled_accepted'
                  | 'on_completed_transaction_close_click'
                  | 'transaction_failure_accepted'
                  | 'transaction_submited'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'transaction_cancel_success'
                  | 'cancel_submitted'
                  | 'transaction_cancel_failure_accepted'
          }
      >
// FIXME @resetko-zeal rename to something like "SendRegularTransaction"? :'D
export const SendTransaction = ({
    account,
    dApp,
    network,
    networkRPCMap,
    sendTransactionRequest,
    sessionPassword,
    state,
    accounts,
    keystores,
    installationId,
    source,
    fetchSimulationByRequest,
    networkMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const [internalState, setInternalState] = useState<InternalState>({
        type: 'confirm_transaction',
        network,
        account,
        transactionRequest: {
            state: 'not_signed',
            account,
            dApp,
            networkHexId: network.hexChainId,
            rpcRequest: sendTransactionRequest,
        },
    })

    switch (internalState.type) {
        case 'confirm_transaction':
            return (
                <ConfirmTransaction
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={internalState.transactionRequest}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                            case 'drag':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'import_keys_button_clicked':
                            case 'on_minimize_click':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'user_confirmed_transaction_for_signing':
                                setInternalState({
                                    type: 'sign_and_submit_transaction',
                                    keyStore: msg.keyStore,
                                    transactionRequest: msg.transactionRequest,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign_and_submit_transaction':
            return (
                <SignAndSubmit
                    transactionRequest={internalState.transactionRequest}
                    keyStore={internalState.keyStore}
                    sessionPassword={sessionPassword}
                    installationId={installationId}
                    layoutState={state}
                    source={source}
                    accounts={accounts}
                    keystores={keystores}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_with_hw_wallet_cancel_clicked':
                                setInternalState({
                                    type: 'confirm_transaction',
                                    network,
                                    account,
                                    transactionRequest: {
                                        state: 'not_signed',
                                        account,
                                        dApp,
                                        networkHexId: network.hexChainId,
                                        rpcRequest: sendTransactionRequest,
                                    },
                                })
                                break
                            case 'transaction_submited':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_completed_transaction_close_click':
                            case 'transaction_failure_accepted':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_minimize_click':
                            case 'cancel_submitted':
                            case 'on_expand_request':
                            case 'drag':
                                onMsg(msg)
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
            return notReachable(internalState)
    }
}
