import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { useState } from 'react'
import { SendRegularOrGasAbstractionTransaction } from 'src/domains/RPCRequest/features/SendRegularOrGasAbstractionTransaction'
import { Form } from './Form'

type Props = {
    currencyId: CurrencyId | null
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    customCurrencies: CustomCurrencyMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'close'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof SendRegularOrGasAbstractionTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_transaction_relayed'
          }
      >

type State =
    | { type: 'form' }
    | {
          type: 'submit_transaction'
          ethTransaction: EthSendTransaction
          network: Network
      }

const calculateToken = (
    currencyId: CurrencyId | null,
    portfolioMap: PortfolioMap,
    account: Account
): Token | null => {
    const portfolio = portfolioMap[account.address]
    const token = portfolio.tokens.find(
        (token) => token.balance.currencyId === currencyId
    )
    return token || null
}

export const SendERC20 = ({
    account,
    portfolioMap,
    currencyId,
    accountsMap,
    sessionPassword,
    customCurrencies,
    onMsg,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    customCurrencies={customCurrencies}
                    sessionPassword={sessionPassword}
                    token={calculateToken(currencyId, portfolioMap, account)}
                    portfolioMap={portfolioMap}
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_submit_form':
                                setState({
                                    type: 'submit_transaction',
                                    ethTransaction: msg.request,
                                    network: msg.network,
                                })
                                break
                            case 'close':
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_transaction':
            return (
                <SendRegularOrGasAbstractionTransaction
                    portfolioMap={portfolioMap}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="send"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    accounts={accountsMap}
                    keystores={keyStoreMap}
                    state={{ type: 'maximised' }}
                    dApp={null}
                    network={state.network}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    sendTransactionRequest={state.ethTransaction}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_failure_accepted':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_cancel_confirm_transaction_clicked':
                                setState({ type: 'form' })
                                break

                            case 'on_minimize_click':
                            case 'on_completed_transaction_close_click':
                            case 'on_transaction_relayed':
                            case 'transaction_cancel_success':
                                onMsg({ type: 'close' })
                                break
                            case 'on_expand_request':
                            case 'drag':
                                break

                            case 'import_keys_button_clicked':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_transaction_completed_splash_animation_screen_competed':
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
            return notReachable(state)
    }
}
