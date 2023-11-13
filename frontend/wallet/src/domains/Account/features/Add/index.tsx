import { useState } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Modal>,
    {
        type:
            | 'on_account_create_request'
            | 'on_accounts_create_success_animation_finished'
    }
>

export const Add = ({
    keystoreMap,
    accountsMap,
    sessionPassword,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'on_add_from_secret_phrase':
                            setModalState({
                                type: 'choose_import_or_create_secret_phrase',
                            })
                            break
                        case 'on_add_account_private_key':
                            setModalState({ type: 'import_private_key' })
                            break
                        case 'on_add_account_from_recovery_kit':
                            setModalState({ type: 'import_from_recovery_kit' })
                            break
                        case 'on_add_account_from_hardware_wallet_click':
                            setModalState({
                                type: 'import_from_hardware_wallet',
                            })
                            break
                        case 'on_add_account_from_existing_phrase':
                            try {
                                const secretPhraseMap =
                                    await groupBySecretPhrase(
                                        values(accountsMap),
                                        keystoreMap,
                                        sessionPassword
                                    )

                                setModalState({
                                    type: 'add_account_from_existing_phrase',
                                    secretPhraseMap,
                                })
                            } catch (e) {
                                captureError(e)
                            }
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                state={modalState}
                keystoreMap={keystoreMap}
                accountsMap={accountsMap}
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
                            onMsg(msg)
                            break
                        case 'on_import_secret_phrase_clicked':
                            setModalState({ type: 'import_secret_phrase' })
                            break
                        case 'on_create_new_secret_phrase_clicked':
                            setModalState({ type: 'create_new_secret_phrase' })
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
