import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Submited } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State } from './Modal'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    transactionRequests: Record<Address, Submited[]>
    submitedBridgesMap: SubmitedBridgesMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'on_network_item_click'
          network: CurrentNetwork
      }
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_account_label_change_submit'
                  | 'account_item_clicked'
                  | 'on_account_create_request'
                  | 'confirm_account_delete_click'
                  | 'on_recovery_kit_setup'
                  | 'track_wallet_clicked'
                  | 'add_new_account_click'
          }
      >
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'transaction_request_cancelled'
                  | 'bridge_completed'
                  | 'on_bridge_submitted_click'
                  | 'on_transaction_request_widget_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_rpc_change_confirmed' | 'on_select_rpc_click' }
      >

export const ViewTransactionActivity = ({
    selectedNetwork,
    networkRPCMap,
    portfolios,
    accounts,
    account,
    keystoreMap,
    transactionRequests,
    submitedBridgesMap,
    networkMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })

    return (
        <>
            <Layout
                accountsMap={accounts}
                keyStoreMap={keystoreMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                submitedBridgesMap={submitedBridgesMap}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                transactionRequests={transactionRequests}
                account={account}
                selectedNetwork={selectedNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_activity_transaction_click':
                            setState({
                                type: 'transaction_details',
                                transaction: msg.transaction,
                                currencies: msg.knownCurrencies,
                            })
                            break
                        case 'network_filter_click':
                            setState({ type: 'network_filter' })
                            break
                        case 'on_hidden_activity_icon_click':
                            setState({ type: 'hidden_activity' })
                            break

                        case 'transaction_request_completed':
                        case 'transaction_request_failed':
                        case 'bridge_completed':
                        case 'on_bridge_submitted_click':
                        case 'on_transaction_request_widget_click':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                currencyHiddenMap={currencyHiddenMap}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                accountsMap={accounts}
                networkMap={networkMap}
                keystoreMap={keystoreMap}
                state={state}
                portfolios={portfolios}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_network_item_click':
                            setState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
