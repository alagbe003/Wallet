import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from 'src/domains/RPCRequest/features/SendTransaction'
import { createNFTEthSendTransaction } from '@zeal/domains/RPCRequest/helpers/createNFTEthSendTransaction'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SelectToAddress } from '../SelectToAddress'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    nft: PortfolioNFT
    collection: PortfolioNFTCollection

    fromAccount: Account
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keyStoreMap: KeyStoreMap

    installationId: string

    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof SelectToAddress>,
          {
              type:
                  | 'close'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_transaction_completed_splash_animation_screen_competed'
          }
      >

type State =
    | {
          type: 'select_to_address'
      }
    | {
          type: 'send_token'
          ethTransaction: EthSendTransaction
          network: Network
      }

export const Flow = ({
    collection,
    nft,
    fromAccount,
    onMsg,
    portfolioMap,
    accountsMap,
    keyStoreMap,
    sessionPassword,
    installationId,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_to_address' })

    switch (state.type) {
        case 'select_to_address':
            return (
                <SelectToAddress
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencyMap}
                    keyStoreMap={keyStoreMap}
                    portfolioMap={portfolioMap}
                    toAddress={null}
                    account={fromAccount}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                                onMsg(msg)
                                break

                            case 'on_accounts_create_success_animation_finished':
                                // we don't do redirect on send flow
                                break

                            case 'on_add_label_skipped':
                                setState({
                                    type: 'send_token',
                                    network: findNetworkByHexChainId(
                                        collection.networkHexId,
                                        networkMap
                                    ),
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress: msg.address,
                                            collection,
                                            nft,
                                        }
                                    ),
                                })
                                break

                            case 'on_account_create_request':
                                onMsg(msg)
                                setState({
                                    type: 'send_token',
                                    network: findNetworkByHexChainId(
                                        collection.networkHexId,
                                        networkMap
                                    ),
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress:
                                                msg.accountsWithKeystores[0]
                                                    .account.address,
                                            collection,
                                            nft,
                                        }
                                    ),
                                })
                                break

                            case 'account_item_clicked':
                                setState({
                                    type: 'send_token',
                                    network: findNetworkByHexChainId(
                                        collection.networkHexId,
                                        networkMap
                                    ),
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress: msg.account.address,
                                            collection,
                                            nft,
                                        }
                                    ),
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'send_token':
            return (
                <SendTransaction
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
                    account={fromAccount}
                    sendTransactionRequest={state.ethTransaction}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_cancel_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_minimize_click':
                            case 'on_completed_transaction_close_click':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_failure_accepted':
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
