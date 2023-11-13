import React, { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Form } from './Form'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { SubmitSourceTransactions } from './SubmitSourceTransactions'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import {
    BridgeRequest,
    BridgeSubmitted,
} from '@zeal/domains/Currency/domains/Bridge'
import { CheckBridgeSubmittedStatus } from 'src/domains/Currency/domains/Bridge/features/CheckBridgeSubmittedStatus'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    account: Account
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    fromCurrencyId: CurrencyId | null
    currenciesMatrix: CurrenciesMatrix
    sessionPassword: string
    accountMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    installationId: string
    swapSlippagePercent: number | null
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof CheckBridgeSubmittedStatus>
    | Extract<
          MsgOf<typeof SubmitSourceTransactions>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'source_transaction_submitted'
          }
      >
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'on_set_slippage_percent'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
          }
      >

type State =
    | { type: 'form' }
    | { type: 'submit_source_transaction'; bridgeRequest: BridgeRequest }
    | {
          type: 'check_bridge_submitted_status'
          bridgeSubmitted: BridgeSubmitted
      }

export const Flow = ({
    account,
    portfolioMap,
    fromCurrencyId,
    currenciesMatrix,
    keystoreMap,
    accountMap,
    sessionPassword,
    installationId,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    portfolioMap={portfolioMap}
                    keystoreMap={keystoreMap}
                    fromCurrencyId={fromCurrencyId}
                    currenciesMatrix={currenciesMatrix}
                    swapSlippagePercent={swapSlippagePercent}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_set_slippage_percent':
                            case 'on_rpc_change_confirmed':
                            case 'on_select_rpc_click':
                                onMsg(msg)
                                break
                            case 'on_bridge_continue_clicked':
                                setState({
                                    type: 'submit_source_transaction',
                                    bridgeRequest: msg.route,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_source_transaction':
            return (
                <SubmitSourceTransactions
                    portfolioMap={portfolioMap}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    request={state.bridgeRequest}
                    sessionPassword={sessionPassword}
                    account={account}
                    accountMap={accountMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'form' })
                                break
                            case 'source_transaction_submitted':
                                setState({
                                    type: 'check_bridge_submitted_status',
                                    bridgeSubmitted: msg.request,
                                })
                                onMsg(msg)
                                break

                            case 'transaction_failure_accepted':
                            case 'transaction_cancel_failure_accepted':
                                setState({ type: 'form' })
                                break

                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_sign_cancel_button_clicked':
                                setState({ type: 'form' })
                                break

                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'transaction_submited':
                            case 'transaction_cancel_success':
                            case 'cancel_submitted':
                                // We do not report bridge transaction statuses to upper components
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'check_bridge_submitted_status':
            return (
                <CheckBridgeSubmittedStatus
                    networkMap={networkMap}
                    bridgeSubmitted={state.bridgeSubmitted}
                    account={account}
                    keystoreMap={keystoreMap}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
