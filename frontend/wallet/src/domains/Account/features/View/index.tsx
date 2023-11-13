import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'
import { Address } from '@zeal/domains/Address'
import { Submited } from '@zeal/domains/TransactionRequest'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    account: Account
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    portfolios: PortfolioMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    networkMap: NetworkMap
    bankTransferInfo: BankTransferInfo

    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    encryptedPassword: string
    sessionPassword: string

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'reload_button_click'
                  | 'on_profile_change_confirm_click'
                  | 'on_recovery_kit_setup'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_token_click'
                  | 'on_send_nft_click'
                  | 'bridge_completed'
                  | 'on_bridge_submitted_click'
                  | 'on_transaction_request_widget_click'
                  | 'bank_transfer_click'
                  | 'receive_click'
                  | 'on_tracked_tag_click'
                  | 'on_dismiss_kyc_button_clicked'
                  | 'on_kyc_try_again_clicked'
                  | 'on_do_bank_transfer_clicked'
                  | 'transaction_request_completed'
                  | 'transaction_request_cancelled'
                  | 'transaction_request_failed'
                  | 'on_onramp_success'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_withdrawal_monitor_fiat_transaction_failed'
          }
      >
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_account_label_change_submit'
                  | 'account_item_clicked'
                  | 'confirm_account_delete_click'
                  | 'on_network_item_click'
                  | 'on_account_create_request'
                  | 'on_recovery_kit_setup'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'add_new_account_click'
                  | 'track_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
          }
      >

export const View = ({
    account,
    accounts,
    portfolios,
    portfolioLoadable,
    submittedOffRampTransactions,
    selectedNetwork,
    networkRPCMap,
    keystoreMap,
    submitedBridgesMap,
    transactionRequests,
    encryptedPassword,
    networkMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                accountsMap={accounts}
                submitedBridgesMap={submitedBridgesMap}
                transactionRequests={transactionRequests}
                submittedOffRampTransactions={submittedOffRampTransactions}
                keystoreMap={keystoreMap}
                selectedNetwork={selectedNetwork}
                account={account}
                portfolioLoadable={portfolioLoadable}
                bankTransferInfo={bankTransferInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'account_filter_click':
                            setModalState({ type: 'account_filter' })
                            break
                        case 'network_filter_click':
                            setModalState({ type: 'network_filter' })
                            break
                        case 'reload_button_click':
                        case 'on_profile_change_confirm_click':
                        case 'on_recovery_kit_setup':
                        case 'on_custom_currency_update_request':
                        case 'on_custom_currency_delete_request':
                        case 'on_token_click':
                        case 'on_send_nft_click':
                        case 'bridge_completed':
                        case 'on_bridge_submitted_click':
                        case 'on_transaction_request_widget_click':
                        case 'bank_transfer_click':
                        case 'receive_click':
                        case 'on_tracked_tag_click':
                        case 'on_dismiss_kyc_button_clicked':
                        case 'on_kyc_try_again_clicked':
                        case 'on_do_bank_transfer_clicked':
                        case 'transaction_request_completed':
                        case 'transaction_request_failed':
                        case 'on_onramp_success':
                        case 'on_withdrawal_monitor_fiat_transaction_failed':
                        case 'on_withdrawal_monitor_fiat_transaction_success':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                sessionPassword={sessionPassword}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                encryptedPassword={encryptedPassword}
                keystoreMap={keystoreMap}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                state={modalState}
                accounts={accounts}
                portfolios={portfolios}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_account_create_request':
                        case 'on_recovery_kit_setup':
                        case 'on_account_label_change_submit':
                        case 'add_new_account_click':
                        case 'track_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                            onMsg(msg)
                            break

                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'account_item_clicked':
                        case 'confirm_account_delete_click':
                        case 'on_network_item_click':
                            setModalState({ type: 'closed' })
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
