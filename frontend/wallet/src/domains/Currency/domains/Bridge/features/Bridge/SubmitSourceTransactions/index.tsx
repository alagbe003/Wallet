import React, { useCallback, useState } from 'react'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { SendTransaction } from 'src/domains/RPCRequest/features/SendTransaction'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { getCryptoCurrency } from '../helpers/getCryptoCurrency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import {
    BridgeRequest,
    BridgeSubmitted,
} from '@zeal/domains/Currency/domains/Bridge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SendRegularOrGasAbstractionTransaction } from 'src/domains/RPCRequest/features/SendRegularOrGasAbstractionTransaction'
import { PortfolioMap } from '@zeal/domains/Portfolio'

type Props = {
    request: BridgeRequest
    sessionPassword: string
    account: Account
    accountMap: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'source_transaction_submitted'; request: BridgeSubmitted }
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
          }
      >

type State =
    | {
          type: 'submit_approval'
          approveTransaction: EthSendTransaction
      }
    | {
          type: 'submit_source_trx'
      }

export const SubmitSourceTransactions = ({
    request,
    sessionPassword,
    account,
    accountMap,
    keystoreMap,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolioMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        request.route.approvalTransaction
            ? {
                  type: 'submit_approval',
                  approveTransaction: request.route.approvalTransaction,
              }
            : { type: 'submit_source_trx' }
    )

    const fetchBridgeSimulation = useCallback(
        async ({
            network,
            rpcRequest,
        }: {
            network: Network
            rpcRequest: EthSendTransaction
        }) => {
            const resp = await fetchSimulationByRequest({ network, rpcRequest })
            switch (resp.type) {
                case 'failed':
                case 'not_supported':
                    return resp
                case 'simulated':
                    return {
                        ...resp,
                        simulation: {
                            ...resp.simulation,
                            currencies: {
                                ...resp.simulation.currencies,
                                ...request.knownCurrencies,
                            },
                            transaction: {
                                type: 'BridgeTrx' as const,
                                bridgeRoute: request.route,
                            },
                        },
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(resp)
            }
        },
        [request.knownCurrencies, request.route]
    )

    switch (state.type) {
        case 'submit_source_trx':
            return (
                <SendRegularOrGasAbstractionTransaction
                    portfolioMap={portfolioMap}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    fetchSimulationByRequest={fetchBridgeSimulation}
                    key={request.route.sourceTransaction.id}
                    source="bridge"
                    sendTransactionRequest={request.route.sourceTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={findNetworkByHexChainId(
                        getCryptoCurrency({
                            cryptoCurrencyId: request.route.from.currencyId,
                            knownCurrencies: request.knownCurrencies,
                        }).networkHexChainId,
                        networkMap
                    )}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: request.route.displayName,
                        avatar: request.route.icon,
                        hostname: '',
                    }}
                    accounts={accountMap}
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

                            case 'on_transaction_completed_splash_animation_screen_competed':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.transaction.hash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break
                            case 'on_completed_transaction_close_click':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.completedTransaction.hash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break

                            case 'on_transaction_relayed':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.transactionHash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
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
                <SendRegularOrGasAbstractionTransaction
                    portfolioMap={portfolioMap}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="bridgeApprove"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={state.approveTransaction.id}
                    sendTransactionRequest={state.approveTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={findNetworkByHexChainId(
                        getCryptoCurrency({
                            cryptoCurrencyId: request.route.from.currencyId,
                            knownCurrencies: request.knownCurrencies,
                        }).networkHexChainId,
                        networkMap
                    )}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: request.route.displayName,
                        avatar: request.route.icon,
                        hostname: '',
                    }}
                    accounts={accountMap}
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
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_transaction_relayed':
                                setState({ type: 'submit_source_trx' })
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
