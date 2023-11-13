import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { SwapRoute } from 'src/domains/Currency/domains/SwapQuote'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from 'src/domains/RPCRequest/features/SendTransaction'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    route: SwapRoute

    sessionPassword: string
    account: Account
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    feePresetMap: FeePresetMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_all_transaction_success' }
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_transaction_completed_splash_animation_screen_competed'
          }
      >

type State =
    | { type: 'submit_approval'; approvalTransaction: EthSendTransaction }
    | { type: 'submit_swap_trx' }

export const SubmitSwap = ({
    sessionPassword,
    account,
    accountsMap,
    keystoreMap,
    installationId,
    route,
    networkMap,
    networkRPCMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        route.approvalTransaction
            ? {
                  type: 'submit_approval',
                  approvalTransaction: route.approvalTransaction,
              }
            : { type: 'submit_swap_trx' }
    )

    switch (state.type) {
        case 'submit_swap_trx':
            return (
                <SendTransaction
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={route.swapTransaction.id}
                    source="swap"
                    sendTransactionRequest={route.swapTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={route.network}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: route.protocolDisplayName,
                        avatar: route.protocolIcon,
                        hostname: '',
                    }}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                                onMsg(msg)
                                break

                            case 'on_completed_transaction_close_click':
                                onMsg({ type: 'on_all_transaction_success' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_approval':
            return (
                <SendTransaction
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="swapApprove"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={state.approvalTransaction.id}
                    sendTransactionRequest={state.approvalTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={route.network}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: route.protocolDisplayName,
                        avatar: route.protocolIcon,
                        hostname: '',
                    }}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'on_completed_transaction_close_click':
                                setState({ type: 'submit_swap_trx' })
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                                onMsg(msg)
                                setState({ type: 'submit_swap_trx' })
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
