import { useCallback, useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from 'src/domains/RPCRequest/features/SendTransaction'
import { createERC20EthSendTransaction } from '@zeal/domains/RPCRequest/helpers/createERC20EthSendTransaction'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    fetchSimulationByRequest,
    SimulationResult,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { MonitorFiatTransaction } from './MonitorFiatTransaction'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { WithdrawalRequest } from '@zeal/domains/Currency/domains/BankTransfer'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    unblockLoginInfo: UnblockLoginInfo
    installationId: string
    sessionPassword: string
    account: Account
    withdrawalRequest: WithdrawalRequest
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    toAddress: Address
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'crypto_transaction_submitted' }
    | MsgOf<typeof MonitorFiatTransaction>
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'on_minimize_click'
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_predefined_fee_preset_selected'
          }
      >

type State =
    | { type: 'send_crypto_transaction'; rpcRequest: EthSendTransaction }
    | { type: 'monitor_fiat_transaction'; transactionHash: string }

export const Flow = ({
    accountsMap,
    keystoreMap,
    installationId,
    withdrawalRequest,
    network,
    networkMap,
    networkRPCMap,
    account,
    toAddress,
    sessionPassword,
    onMsg,
    bankTransferInfo,
    feePresetMap,
    unblockLoginInfo,
    bankTransferCurrencies,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'send_crypto_transaction',
        rpcRequest: createERC20EthSendTransaction({
            fromAccount: account,
            knownCurrencies: withdrawalRequest.knownCurrencies,
            toAddress,
            network,
            amount: withdrawalRequest.fromAmount,
        }),
    })

    const fetchWithdrawalSimulation = useCallback(
        async ({
            network,
            rpcRequest,
        }: {
            network: Network
            rpcRequest: EthSendTransaction
        }): Promise<SimulationResult> => {
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
                                ...withdrawalRequest.knownCurrencies,
                            },
                            transaction: {
                                type: 'WithdrawalTrx' as const,
                                withdrawalRequest,
                            },
                        },
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(resp)
            }
        },
        [withdrawalRequest]
    )

    switch (state.type) {
        case 'send_crypto_transaction':
            return (
                <SendTransaction
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    fetchSimulationByRequest={fetchWithdrawalSimulation}
                    key={state.rpcRequest.id}
                    source="offramp"
                    sendTransactionRequest={state.rpcRequest}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={network}
                    dApp={null}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in off-ramp $${msg.type}`
                                    )
                                )
                                break

                            case 'on_minimize_click':
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
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash: msg.transaction.hash,
                                })
                                break
                            case 'on_completed_transaction_close_click':
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash:
                                        msg.completedTransaction.hash,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'monitor_fiat_transaction':
            return (
                <MonitorFiatTransaction
                    bankTransferCurrencies={bankTransferCurrencies}
                    network={network}
                    networkMap={networkMap}
                    account={account}
                    keyStoreMap={keystoreMap}
                    bankTransferInfo={bankTransferInfo}
                    loginInfo={unblockLoginInfo}
                    transactionHash={state.transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
