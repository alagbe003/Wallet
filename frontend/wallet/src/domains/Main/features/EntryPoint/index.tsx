import { useLayoutEffect, useMemo } from 'react'
import { Manifest } from 'src/domains/Manifest'
import { parseEntrypoint } from 'src/domains/Main/parsers/parseEntrypoint'
import { notReachable } from '@zeal/toolkit'

import { StorageLoader } from './StorageLoader'
import {
    openAddAccountPageTab,
    openAddFromHardwareWallet,
    openBankTransferPage,
    openBridge,
    openCreateContactPage,
    openRecoveryKitSetup,
    openSendERC20,
    openSendNFT,
    openSwap,
} from 'src/domains/Main/helpers/openEntrypoint'
import { Main } from 'src/domains/Main/features/Extension'
import { ZWidget } from 'src/domains/Main/features/ZWidget'

// TODO :: any idea how to fix styles?

const zwidgetStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
}

const extensionStyle = {
    width: '360px',
    height: '600px',
    display: 'flex',
    flexDirection: 'column' as const,
}

type Props = {
    manifest: Manifest
}

export const WalletWidgetFork = ({ manifest }: Props) => {
    const entryPoint = useMemo(() => {
        const params = Object.fromEntries(
            new URLSearchParams(window.location.search).entries()
        )

        return parseEntrypoint(params).getSuccessResultOrThrow(
            'fail to parse entrypoint params'
        )
    }, [])

    useLayoutEffect(() => {
        switch (entryPoint.type) {
            case 'extension':
                document.documentElement.style.minHeight = '600px'
                break
            case 'bridge':
            case 'zwidget':
            case 'add_account':
            case 'send_nft':
            case 'send_erc20_token':
            case 'setup_recovery_kit':
            case 'onboarding':
            case 'create_contact':
            case 'swap':
            case 'add_from_hardware_wallet':
            case 'bank_transfer':
            case 'kyc_process':
                break
            /* istanbul ignore next */
            default:
                return notReachable(entryPoint)
        }
    }, [entryPoint])

    switch (entryPoint.type) {
        case 'add_account':
        case 'create_contact':
        case 'onboarding':
        case 'send_erc20_token':
        case 'send_nft':
        case 'setup_recovery_kit':
        case 'swap':
        case 'add_from_hardware_wallet':
        case 'bridge':
        case 'bank_transfer':
        case 'kyc_process':
            return (
                <div style={extensionStyle}>
                    <StorageLoader
                        entryPoint={entryPoint}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'add_wallet_clicked':
                                case 'import_keys_button_clicked':
                                    openAddAccountPageTab()
                                    break

                                case 'track_wallet_clicked':
                                    openCreateContactPage()
                                    break

                                case 'hardware_wallet_clicked':
                                    openAddFromHardwareWallet()
                                    break

                                case 'on_secret_phrase_verified_success':
                                case 'on_google_drive_backup_success':
                                    window.parent.location.replace(
                                        chrome.runtime.getURL(
                                            'account_is_ready.html'
                                        )
                                    )
                                    break

                                case 'on_accounts_create_success_animation_finished':
                                    window.parent.location.replace(
                                        chrome.runtime.getURL(
                                            'account_is_ready.html'
                                        )
                                    )
                                    break

                                case 'lock_screen_close_click':
                                case 'close':
                                case 'on_all_transaction_success':
                                case 'bridge_completed':
                                case 'on_on_ramp_transfer_success_close_click':
                                    window.parent.close()
                                    break
                                case 'on_do_bank_transfer_clicked':
                                    openBankTransferPage()
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </div>
            )

        case 'extension':
            return (
                <div style={extensionStyle}>
                    <Main
                        manifest={manifest}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_recovery_kit_setup':
                                    openRecoveryKitSetup(msg.address)
                                    break

                                case 'on_send_nft_click':
                                    openSendNFT({
                                        collection: msg.collection,
                                        fromAddress: msg.fromAddress,
                                        nft: msg.nft,
                                    })
                                    break

                                case 'on_swap_clicked':
                                    openSwap({
                                        fromAddress: msg.fromAddress,
                                        fromCurrencyId: msg.currencyId,
                                    })

                                    break
                                case 'on_bridge_clicked':
                                    openBridge({
                                        fromAddress: msg.fromAddress,
                                        fromCurrencyId: msg.currencyId,
                                    })
                                    break
                                case 'on_send_clicked':
                                    openSendERC20({
                                        currencyId: msg.currencyId,
                                        fromAddress: msg.fromAddress,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </div>
            )

        case 'zwidget':
            return (
                <div style={zwidgetStyle}>
                    <ZWidget dAppUrl={entryPoint.dAppUrl} />
                </div>
            )

        /* istanbul ignore next */
        default:
            return notReachable(entryPoint)
    }
}
