import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { CreateUnblockUser } from 'src/domains/Currency/domains/BankTransfer/features/CreateUnblockUser'
import { SignUnblockLoginMsg } from 'src/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import {
    BankTransferInfo,
    BankTransferUnblockUserCreated,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ChooseWallet } from './ChooseWallet'
import { DepositWithdrawForm } from './DepositWithdrawForm'
import { SetupOfframpBankAccount } from './SetupOfframpBankAccount'
import { Story } from './Story'

type Props = {
    bankTransferCurrencies: BankTransferCurrencies
    bankTransfer: BankTransferInfo
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | Extract<
          MsgOf<typeof ChooseWallet>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof CreateUnblockUser>,
          {
              type: 'unblock_user_created' | 'unblock_user_already_exist'
          }
      >
    | Extract<
          MsgOf<typeof DepositWithdrawForm>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'kyc_applicant_created'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_on_ramp_transfer_success_close_click'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_withdrawal_monitor_fiat_transaction_start'
                  | 'on_withdrawal_monitor_fiat_transaction_failed'
          }
      >

type State =
    | {
          type: 'show_story'
      }
    | {
          type: 'choose_wallet_to_connect'
      }
    | {
          type: 'sign_unblock_login_msg'
          account: Account
      }
    | {
          type: 'create_user'
          account: Account
          unblockLoginSignature: UnblockLoginSignature
      }
    | {
          type: 'creating_account'
          loginInfo: UnblockLoginInfo
          bankTransferInfo: BankTransferUnblockUserCreated
      }
    | {
          type: 'deposit_withdraw_form'
          loginInfo: UnblockLoginInfo
          bankTransferInfo: BankTransferUnblockUserCreated
          offRampAccounts: OffRampAccount[]
      }

const calculateState = (
    bankTransfer: BankTransferInfo,
    accountsMap: AccountsMap
): State => {
    switch (bankTransfer.type) {
        case 'not_started':
            return { type: 'show_story' }
        case 'unblock_user_created':
            return {
                type: 'sign_unblock_login_msg',
                account: accountsMap[bankTransfer.connectedWalletAddress],
            }
        /* istanbul ignore next */
        default:
            return notReachable(bankTransfer)
    }
}

export const Flow = ({
    bankTransferCurrencies,
    customCurrencies,
    sessionPassword,
    bankTransfer,
    portfolioMap,
    accountsMap,
    keystoreMap,
    networkMap,
    installationId,
    network,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        calculateState(bankTransfer, accountsMap)
    )

    switch (state.type) {
        case 'show_story':
            return (
                <Story
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setState({ type: 'choose_wallet_to_connect' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'choose_wallet_to_connect':
            return (
                <ChooseWallet
                    currencyHiddenMap={currencyHiddenMap}
                    portfolioMap={portfolioMap}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_back_button_clicked':
                                setState({ type: 'show_story' })
                                break
                            case 'on_continue_click':
                                setState({
                                    type: 'sign_unblock_login_msg',
                                    account: msg.account,
                                })
                                break
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                            case 'on_account_create_request':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign_unblock_login_msg':
            const keystore = getKeyStore({
                address: state.account.address,
                keyStoreMap: keystoreMap,
            })
            switch (keystore.type) {
                case 'track_only':
                    throw new ImperativeError(
                        `we get track only keystore inside bank transfer flow`
                    )
                case 'safe_v0':
                    // FIXME @resetko-zeal - Safe implementation
                    throw new Error('Not implemented')
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    return (
                        <SignUnblockLoginMsg
                            networkMap={networkMap}
                            network={network}
                            account={state.account}
                            sessionPassword={sessionPassword}
                            keystore={keystore}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        switch (bankTransfer.type) {
                                            case 'not_started':
                                                setState({
                                                    type: 'choose_wallet_to_connect',
                                                })
                                                break

                                            case 'unblock_user_created':
                                                onMsg({ type: 'close' })
                                                break

                                            default:
                                                notReachable(bankTransfer)
                                        }
                                        break

                                    case 'on_message_signed':
                                        setState({
                                            type: 'create_user',
                                            account: msg.account,
                                            unblockLoginSignature:
                                                msg.loginSignature,
                                        })
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
                    return notReachable(keystore)
            }

        case 'create_user':
            return (
                <CreateUnblockUser
                    bankTransferInfo={bankTransfer}
                    keystoreMap={keystoreMap}
                    network={network}
                    account={state.account}
                    unblockLoginSignature={state.unblockLoginSignature}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({
                                    type: 'choose_wallet_to_connect',
                                })
                                break
                            case 'unblock_user_already_exist':
                                onMsg(msg)
                                setState({
                                    type: 'creating_account',
                                    loginInfo: msg.loginInfo,
                                    bankTransferInfo: {
                                        type: 'unblock_user_created',
                                        unblockUserId:
                                            msg.loginInfo.unblockUserId,
                                        unblockLoginSignature:
                                            msg.unblockLoginSignature,
                                        connectedWalletAddress: msg.address,
                                        countryCode: null,
                                        sumSubAccessToken:
                                            msg.sumSubAccessToken,
                                    },
                                })
                                break

                            case 'unblock_user_created':
                                onMsg(msg)
                                setState({
                                    type: 'creating_account',
                                    loginInfo: msg.loginInfo,
                                    bankTransferInfo: {
                                        type: 'unblock_user_created',
                                        unblockUserId:
                                            msg.loginInfo.unblockUserId,
                                        unblockLoginSignature:
                                            msg.unblockLoginSignature,
                                        connectedWalletAddress:
                                            msg.user.targetAddress,
                                        countryCode: msg.user.countryCode,
                                        sumSubAccessToken: null,
                                    },
                                })
                                break

                            case 'on_try_with_different_wallet_clicked':
                                setState({ type: 'choose_wallet_to_connect' })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'creating_account':
            return (
                <SetupOfframpBankAccount
                    currencies={bankTransferCurrencies}
                    account={
                        accountsMap[
                            state.bankTransferInfo.connectedWalletAddress
                        ]
                    }
                    network={network}
                    keyStoreMap={keystoreMap}
                    unblockLoginInfo={state.loginInfo}
                    bankTransferInfo={state.bankTransferInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'unblock_offramp_account_created':
                                setState({
                                    type: 'deposit_withdraw_form',
                                    loginInfo: state.loginInfo,
                                    offRampAccounts: [msg.account],
                                    bankTransferInfo: {
                                        ...state.bankTransferInfo,
                                        type: 'unblock_user_created',
                                    },
                                })
                                break
                            case 'unblock_offramp_account_fetched':
                                setState({
                                    type: 'deposit_withdraw_form',
                                    loginInfo: state.loginInfo,
                                    offRampAccounts: msg.offRampAccounts,
                                    bankTransferInfo: {
                                        ...state.bankTransferInfo,
                                        type: 'unblock_user_created',
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'deposit_withdraw_form': {
            const account =
                accountsMap[state.bankTransferInfo.connectedWalletAddress]

            if (!account) {
                throw new ImperativeError(
                    `we don't get account in bank transfer form`
                )
            }

            const keystore = getKeyStore({
                address: account.address,
                keyStoreMap: keystoreMap,
            })
            switch (keystore.type) {
                case 'track_only':
                    throw new ImperativeError(
                        `we get track only keystore inside bank transfer flow in deposit_withdraw_form`
                    )
                case 'safe_v0':
                    // FIXME @resetko-zeal - Safe implementation
                    throw new Error('Not implemented')
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    return (
                        <DepositWithdrawForm
                            feePresetMap={feePresetMap}
                            offRampAccounts={state.offRampAccounts}
                            customCurrencies={customCurrencies}
                            bankTransferCurrencies={bankTransferCurrencies}
                            accountsMap={accountsMap}
                            network={network}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            keystoreMap={keystoreMap}
                            installationId={installationId}
                            portfolioMap={portfolioMap}
                            account={account}
                            sessionPassword={sessionPassword}
                            loginInfo={state.loginInfo}
                            bankTransferInfo={state.bankTransferInfo}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'unblock_offramp_account_created':
                                        setState({
                                            ...state,
                                            offRampAccounts: [
                                                ...state.offRampAccounts.map(
                                                    (account) => {
                                                        return {
                                                            ...account,
                                                            mainBeneficiary:
                                                                false,
                                                        }
                                                    }
                                                ),
                                                {
                                                    ...msg.account,
                                                    mainBeneficiary: true,
                                                },
                                            ],
                                        })
                                        break
                                    case 'on_off_ramp_account_become_default':
                                        setState({
                                            ...state,
                                            offRampAccounts:
                                                state.offRampAccounts.map(
                                                    (account) => ({
                                                        ...account,
                                                        mainBeneficiary:
                                                            account.uuid ===
                                                            msg.offRampAccount
                                                                .uuid,
                                                    })
                                                ),
                                        })
                                        break
                                    case 'kyc_applicant_created':
                                    case 'import_keys_button_clicked':
                                    case 'on_predefined_fee_preset_selected':
                                    case 'on_on_ramp_transfer_success_close_click':
                                    case 'on_withdrawal_monitor_fiat_transaction_start':
                                    case 'on_withdrawal_monitor_fiat_transaction_success':
                                    case 'on_withdrawal_monitor_fiat_transaction_failed':
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
                    return notReachable(keystore)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
