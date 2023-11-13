import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import {
    KeyStoreMap,
    SecretPhrase,
    SigningKeyStore,
} from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { Submited } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { SelectTypeOfAccountToAdd } from 'src/domains/Account/components/SelectTypeOfAccountToAdd'
import { AddFromSecretPhrase } from 'src/domains/Account/features/AddFromSecretPhrase'
import { CreateNewSafe } from 'src/domains/Account/features/CreateNewSafe'
import { Receive } from 'src/domains/Account/features/Receive'
import { TransfersSetupWithDifferentWallet } from 'src/domains/Currency/domains/BankTransfer/components/TransfersSetupWithDifferentWallet'
import { CheckBridgeSubmittedStatus } from 'src/domains/Currency/domains/Bridge/features/CheckBridgeSubmittedStatus'
import { SendOrReceiveToken } from 'src/domains/RPCRequest/features/SendOrReceiveToken'
import { SignAndSubmit } from 'src/domains/TransactionRequest/features/SignAndSubmit'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { ThisWalletIsTrackedOnly } from './ThisWalletIsTrackedOnly'

type Props = {
    state: State
    account: Account
    portfolioMap: PortfolioMap
    keyStoreMap: KeyStoreMap
    installationId: string
    accountsMap: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    sessionPassword: string
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type State =
    | {
          type: 'closed'
      }
    | {
          type: 'transact_popup'
          token: Token
      }
    | {
          type: 'bridge_submitted_status_popup'
          bridgeSubmitted: BridgeSubmitted
      }
    | {
          type: 'submitted_transaction_request_status_popup'
          transactionRequest: Submited
          keyStore: SigningKeyStore
      }
    | {
          type: 'select_type_of_account_to_add'
      }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              string,
              {
                  keystore: SecretPhrase
                  account: Account
              }[]
          >
      }
    | {
          type: 'tracked_only_wallet_selected'
      }
    | {
          type: 'receive_token'
      }
    | {
          type: 'bank_transfer_setup_for_another_account'
          bankTransferSetupForAccount: Account
      }
    | { type: 'safe_wallet_creation' }

type Msg =
    | MsgOf<typeof SendOrReceiveToken>
    | MsgOf<typeof CheckBridgeSubmittedStatus>
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof ThisWalletIsTrackedOnly>
    | MsgOf<typeof TransfersSetupWithDifferentWallet>
    | MsgOf<typeof CreateNewSafe>
    | Extract<
          MsgOf<typeof SignAndSubmit>,
          {
              type:
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_transaction_completed_splash_animation_screen_competed'
          }
      >

export const Modal = ({
    state,
    currentNetwork,
    networkRPCMap,
    account,
    keyStoreMap,
    accountsMap,
    installationId,
    sessionPassword,
    customCurrencyMap,
    portfolioMap,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'submitted_transaction_request_status_popup':
            return (
                <UIModal>
                    <SignAndSubmit
                        transactionRequest={state.transactionRequest}
                        keyStore={state.keyStore}
                        sessionPassword={sessionPassword}
                        installationId={installationId}
                        layoutState={{ type: 'maximised' }}
                        source="transactionRequestWidget"
                        accounts={accountsMap}
                        keystores={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'transaction_submited':
                                case 'cancel_submitted':
                                case 'on_transaction_completed_splash_animation_screen_competed':
                                    onMsg(msg)
                                    break
                                case 'on_sign_cancel_button_clicked':
                                case 'transaction_cancel_success':
                                case 'on_minimize_click':
                                case 'on_completed_transaction_close_click':
                                case 'transaction_failure_accepted':
                                case 'transaction_cancel_failure_accepted':
                                case 'on_sign_with_hw_wallet_cancel_clicked':
                                    onMsg({ type: 'close' })
                                    break
                                case 'on_expand_request': // N/A in extension
                                case 'drag': // N/A in extension
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )
        case 'closed':
            return null

        case 'bank_transfer_setup_for_another_account':
            return (
                <TransfersSetupWithDifferentWallet
                    currencyHiddenMap={currencyHiddenMap}
                    bankTransferAccount={state.bankTransferSetupForAccount}
                    keyStoreMap={keyStoreMap}
                    portfolioMap={portfolioMap}
                    onMsg={onMsg}
                />
            )
        case 'bridge_submitted_status_popup':
            return (
                <UIModal>
                    <CheckBridgeSubmittedStatus
                        networkMap={networkMap}
                        account={account}
                        keystoreMap={keyStoreMap}
                        bridgeSubmitted={state.bridgeSubmitted}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'transact_popup':
            return (
                <SendOrReceiveToken
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    customCurrencies={customCurrencyMap}
                    networkMap={networkMap}
                    fromAccount={account}
                    portfolios={portfolioMap}
                    currentNetwork={currentNetwork}
                    networkRPCMap={networkRPCMap}
                    currencyId={state.token?.balance.currencyId || null}
                    onMsg={onMsg}
                />
            )

        case 'select_type_of_account_to_add':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />

        case 'add_from_secret_phrase':
            return (
                <UIModal>
                    <AddFromSecretPhrase
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        accountsMap={accountsMap}
                        customCurrencies={customCurrencyMap}
                        keystoreMap={keyStoreMap}
                        secretPhraseMap={state.secretPhraseMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'tracked_only_wallet_selected':
            return <ThisWalletIsTrackedOnly onMsg={onMsg} />

        case 'receive_token':
            return (
                <UIModal>
                    <Receive
                        keystore={getKeyStore({
                            keyStoreMap,
                            address: account.address,
                        })}
                        onMsg={onMsg}
                        account={account}
                    />
                </UIModal>
            )

        case 'safe_wallet_creation':
            return (
                <UIModal>
                    <CreateNewSafe
                        sessionPassword={sessionPassword}
                        networkRPCMap={networkRPCMap}
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
