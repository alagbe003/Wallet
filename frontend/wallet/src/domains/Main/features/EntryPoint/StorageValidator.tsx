import { ImperativeError } from '@zeal/domains/Error'
import { LockScreen } from 'src/domains/Password/features/LockScreen'
import { Storage } from '@zeal/domains/Storage'
import { calculateStorageState } from '@zeal/domains/Storage/helpers/calculateStorageState'
import { notReachable } from '@zeal/toolkit'

import { Add as AddAccount } from 'src/domains/Account/features/Add'
import { AddFromHardwareWallet } from 'src/domains/Account/features/AddFromHardwareWallet'
import { TrackWallet } from 'src/domains/Account/features/TrackWallet'
import { BANK_TRANSFER_NETWORK } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { DepositWithdraw } from 'src/domains/Currency/domains/BankTransfer/features/DepositWithdraw'
import { Bridge } from 'src/domains/Currency/domains/Bridge/features/Bridge'
import { Swap } from 'src/domains/Currency/features/Swap'
import { SetupRecoveryKit } from 'src/domains/KeyStore/features/SetupRecoveryKit'
import { OnboardedEntrypoint } from '@zeal/domains/Main'
import { KycProcess } from 'src/domains/Main/features/KycProcess'
import { NetworkMap } from '@zeal/domains/Network'
import { Send } from 'src/domains/RPCRequest/features/Send'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { toLocalStorage } from 'src/domains/Storage/helpers/toLocalStorage'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { removeTransactionRequest } from 'src/domains/TransactionRequest/helpers/removeTransactionRequest'
import { saveFeePreset } from '@zeal/domains/Storage/helpers/saveFeePreset'
import { updateNetworkRPC } from '@zeal/domains/Network/helpers/updateNetworkRPC'

type Props = {
    entryPoint: OnboardedEntrypoint

    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof LockScreen>,
          {
              type: 'lock_screen_close_click'
          }
      >
    | Extract<
          MsgOf<typeof Send>,
          {
              type:
                  | 'close'
                  | 'add_wallet_clicked'
                  | 'track_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'import_keys_button_clicked'
          }
      >
    | MsgOf<typeof SetupRecoveryKit>
    | Extract<
          MsgOf<typeof TrackWallet>,
          {
              type: 'close' | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof AddAccount>,
          {
              type: 'close' | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof AddFromHardwareWallet>,
          {
              type: 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof Swap>,
          {
              type:
                  | 'close'
                  | 'import_keys_button_clicked'
                  | 'on_all_transaction_success'
          }
      >
    | Extract<
          MsgOf<typeof Bridge>,
          {
              type: 'bridge_completed'
          }
      >
    | Extract<
          MsgOf<typeof KycProcess>,
          {
              type: 'on_do_bank_transfer_clicked'
          }
      >
    | Extract<
          MsgOf<typeof DepositWithdraw>,
          { type: 'on_on_ramp_transfer_success_close_click' }
      >

export const StorageValidator = ({
    storage,
    sessionPassword,
    installationId,
    networkMap,
    entryPoint,
    onMsg,
}: Props) => {
    const state = calculateStorageState({ storage, sessionPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={state.storage.encryptedPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                onMsg(msg)
                                break

                            case 'session_password_decrypted':
                                await chrome.storage.session.set({
                                    password: msg.sessionPassword,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'unlocked': {
            switch (entryPoint.type) {
                case 'kyc_process':
                    return (
                        <KycProcess
                            bankTransferInfo={state.storage.bankTransferInfo}
                            keyStoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            accountsMap={state.storage.accounts}
                            networkMap={networkMap}
                            network={BANK_TRANSFER_NETWORK}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                    case 'on_do_bank_transfer_clicked':
                                        onMsg(msg)
                                        break
                                    case 'kyc_applicant_created':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                ...msg.bankTransferInfo,
                                                sumSubAccessToken:
                                                    msg.sumSubAccessToken,
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
                case 'bank_transfer':
                    return (
                        <DepositWithdraw
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            accountsMap={state.storage.accounts}
                            bankTransfer={state.storage.bankTransferInfo}
                            customCurrencies={state.storage.customCurrencies}
                            installationId={installationId}
                            keystoreMap={state.storage.keystoreMap}
                            network={BANK_TRANSFER_NETWORK}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            feePresetMap={state.storage.feePresetMap}
                            portfolioMap={state.storage.portfolios}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'kyc_applicant_created':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                ...msg.bankTransferInfo,
                                                sumSubAccessToken:
                                                    msg.sumSubAccessToken,
                                            },
                                        })
                                        break
                                    case 'on_withdrawal_monitor_fiat_transaction_start':
                                        const { submittedOffRampTransactions } =
                                            state.storage

                                        await toLocalStorage({
                                            ...state.storage,
                                            submittedOffRampTransactions: [
                                                ...submittedOffRampTransactions,
                                                msg.submittedTransaction,
                                            ],
                                        })

                                        break
                                    case 'on_withdrawal_monitor_fiat_transaction_success':
                                    case 'on_withdrawal_monitor_fiat_transaction_failed':
                                        const removed =
                                            state.storage.submittedOffRampTransactions.filter(
                                                (submitted) =>
                                                    submitted.transactionHash !==
                                                    msg.event.transactionHash
                                            )

                                        await toLocalStorage({
                                            ...state.storage,
                                            submittedOffRampTransactions:
                                                removed,
                                        })
                                        break
                                    case 'close':
                                    case 'import_keys_button_clicked':
                                    case 'track_wallet_clicked':
                                    case 'add_wallet_clicked':
                                    case 'hardware_wallet_clicked':
                                    case 'on_on_ramp_transfer_success_close_click':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'unblock_user_created':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                type: 'unblock_user_created',
                                                connectedWalletAddress:
                                                    msg.address,
                                                countryCode:
                                                    msg.user.countryCode,
                                                unblockUserId:
                                                    msg.loginInfo.unblockUserId,
                                                unblockLoginSignature:
                                                    msg.unblockLoginSignature,
                                                sumSubAccessToken: null,
                                            },
                                        })
                                        break

                                    case 'unblock_user_already_exist':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                type: 'unblock_user_created',
                                                connectedWalletAddress:
                                                    msg.address,
                                                countryCode: null,
                                                unblockUserId:
                                                    msg.loginInfo.unblockUserId,
                                                unblockLoginSignature:
                                                    msg.unblockLoginSignature,
                                                sumSubAccessToken:
                                                    msg.sumSubAccessToken,
                                            },
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'bridge':
                    return (
                        <Bridge
                            feePresetMap={state.storage.feePresetMap}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            swapSlippagePercent={
                                state.storage.swapSlippagePercent
                            }
                            accountMap={state.storage.accounts}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            installationId={installationId}
                            portfolioMap={state.storage.portfolios}
                            fromCurrencyId={entryPoint.fromCurrencyId}
                            account={
                                state.storage.accounts[entryPoint.fromAddress]
                            }
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'bridge_completed': {
                                        const fromAddress =
                                            msg.bridgeSubmitted.fromAddress

                                        const currentSubmitedBridges =
                                            state.storage.submitedBridges[
                                                fromAddress
                                            ] || []

                                        await toLocalStorage({
                                            ...state.storage,
                                            submitedBridges: {
                                                ...state.storage
                                                    .submitedBridges,
                                                [fromAddress]:
                                                    currentSubmitedBridges.filter(
                                                        (bridge) =>
                                                            bridge.sourceTransactionHash !==
                                                            msg.bridgeSubmitted
                                                                .sourceTransactionHash
                                                    ),
                                            },
                                        })
                                        onMsg(msg)
                                        break
                                    }

                                    case 'source_transaction_submitted': {
                                        const fromAddress =
                                            msg.request.fromAddress

                                        const currentSubmitedBridges =
                                            state.storage.submitedBridges[
                                                fromAddress
                                            ] || []

                                        await toLocalStorage({
                                            ...state.storage,
                                            submitedBridges: {
                                                ...state.storage
                                                    .submitedBridges,
                                                [fromAddress]: [
                                                    msg.request,
                                                    ...currentSubmitedBridges,
                                                ],
                                            },
                                        })
                                        break
                                    }

                                    case 'on_set_slippage_percent':
                                        await toLocalStorage({
                                            ...state.storage,
                                            swapSlippagePercent:
                                                msg.slippagePercent,
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    updateNetworkRPC({
                                                        network: msg.network,
                                                        initialRPCUrl:
                                                            msg.initialRPCUrl,
                                                        networkRPCMap:
                                                            state.storage
                                                                .networkRPCMap,
                                                        rpcUrl: msg.rpcUrl,
                                                    }),
                                            },
                                        })
                                        break

                                    case 'on_select_rpc_click':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    msg.networkRPC,
                                            },
                                        })
                                        break

                                    case 'import_keys_button_clicked':
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
                case 'add_account':
                    return (
                        <AddAccount
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            customCurrencies={state.storage.customCurrencies}
                            accountsMap={state.storage.accounts}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'create_contact':
                    return (
                        <TrackWallet
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            sessionPassword={state.sessionPassword}
                            variant="track"
                            customCurrencies={state.storage.customCurrencies}
                            accountsMap={state.storage.accounts}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'send_erc20_token':
                case 'send_nft':
                    return (
                        <Send
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            entrypoint={entryPoint}
                            customCurrencies={state.storage.customCurrencies}
                            accountsMap={state.storage.accounts}
                            keyStoreMap={state.storage.keystoreMap}
                            portfolioMap={state.storage.portfolios}
                            sessionPassword={state.sessionPassword}
                            installationId={installationId}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            feePresetMap={state.storage.feePresetMap}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_transaction_completed_splash_animation_screen_competed':
                                    case 'cancel_submitted': {
                                        const from =
                                            msg.transactionRequest.account
                                                .address

                                        const removed = state.storage
                                            .transactionRequests[from]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      from
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [from]: removed,
                                            },
                                        })
                                        break
                                    }
                                    case 'transaction_submited':
                                        const fromAddress =
                                            msg.transactionRequest.account
                                                .address

                                        const existingRequests = state.storage
                                            .transactionRequests[fromAddress]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      fromAddress
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [fromAddress]: [
                                                    msg.transactionRequest,
                                                    ...existingRequests,
                                                ],
                                            },
                                        })
                                        break

                                    case 'on_transaction_relayed':
                                        // FIXME @resetko-zeal we do not store relayed transactions in storage now
                                        break

                                    case 'import_keys_button_clicked':
                                    case 'close':
                                    case 'on_accounts_create_success_animation_finished':
                                    case 'track_wallet_clicked':
                                    case 'add_wallet_clicked':
                                    case 'hardware_wallet_clicked':
                                        onMsg(msg)
                                        break
                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'setup_recovery_kit':
                    return (
                        <SetupRecoveryKit
                            accountsMap={state.storage.accounts}
                            encryptedPassword={state.storage.encryptedPassword}
                            keystoreMap={state.storage.keystoreMap}
                            address={entryPoint.address}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break

                                    case 'on_secret_phrase_verified_success':
                                    case 'on_google_drive_backup_success':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        onMsg(msg)
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'swap':
                    return (
                        <Swap
                            feePresetMap={state.storage.feePresetMap}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            swapSlippagePercent={
                                state.storage.swapSlippagePercent
                            }
                            accountsMap={state.storage.accounts}
                            entrypoint={entryPoint}
                            portfolioMap={state.storage.portfolios}
                            installationId={installationId}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_transaction_completed_splash_animation_screen_competed':
                                    case 'cancel_submitted': {
                                        const from =
                                            msg.transactionRequest.account
                                                .address

                                        const removed = state.storage
                                            .transactionRequests[from]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      from
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [from]: removed,
                                            },
                                        })
                                        break
                                    }
                                    case 'transaction_submited':
                                        const fromAddress =
                                            msg.transactionRequest.account
                                                .address

                                        const existingRequests = state.storage
                                            .transactionRequests[fromAddress]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      fromAddress
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [fromAddress]: [
                                                    msg.transactionRequest,
                                                    ...existingRequests,
                                                ],
                                            },
                                        })
                                        break
                                    case 'close':
                                    case 'import_keys_button_clicked':
                                    case 'on_all_transaction_success':
                                        onMsg(msg)
                                        break

                                    case 'on_set_slippage_percent':
                                        await toLocalStorage({
                                            ...state.storage,
                                            swapSlippagePercent:
                                                msg.slippagePercent,
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    updateNetworkRPC({
                                                        network: msg.network,
                                                        initialRPCUrl:
                                                            msg.initialRPCUrl,
                                                        networkRPCMap:
                                                            state.storage
                                                                .networkRPCMap,
                                                        rpcUrl: msg.rpcUrl,
                                                    }),
                                            },
                                        })
                                        break

                                    case 'on_select_rpc_click':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    msg.networkRPC,
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

                case 'add_from_hardware_wallet':
                    return (
                        <AddFromHardwareWallet
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            closable={false}
                            accounts={state.storage.accounts}
                            customCurrencies={state.storage.customCurrencies}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        throw new ImperativeError(
                                            'Close event is not possible for HW flow on entrypoint'
                                        )

                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
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
                    return notReachable(entryPoint)
            }
        }

        case 'no_storage':
            throw new ImperativeError(
                `Impossible state. No storage for onboarded entry points`
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
