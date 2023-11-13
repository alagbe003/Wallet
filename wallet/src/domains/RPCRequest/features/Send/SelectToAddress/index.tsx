import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Modal, State as ModalState } from './Modal'
import { Layout } from './Layout'
import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Address } from '@zeal/domains/Address'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { values } from '@zeal/toolkit/Object'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    toAddress: Address | null
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    account: Account
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}
type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' | 'account_item_clicked' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_add_label_skipped'
          }
      >

export const SelectToAddress = ({
    accountsMap,
    keyStoreMap,
    portfolioMap,
    toAddress,
    account,
    customCurrencies,
    networkMap,
    networkRPCMap,
    sessionPassword,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                toAddress={toAddress}
                accountsMap={accountsMap}
                keyStoreMap={keyStoreMap}
                portfolioMap={portfolioMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'account_item_clicked':
                            onMsg(msg)
                            break

                        case 'on_continue_clicked':
                            setModal({
                                type: 'label_address',
                                address: msg.address,
                            })
                            break

                        case 'add_new_account_click':
                            setModal({ type: 'add_wallet' })
                            break

                        case 'track_wallet_clicked':
                            setModal({ type: 'add_tracked' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                currencyHiddenMap={currencyHiddenMap}
                keyStoreMap={keyStoreMap}
                customCurrencies={customCurrencies}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                sessionPassword={sessionPassword}
                accountsMap={accountsMap}
                state={modal}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'create_clicked':
                            try {
                                const secretPhraseMap =
                                    await groupBySecretPhrase(
                                        values(accountsMap),
                                        keyStoreMap,
                                        sessionPassword
                                    )

                                setModal({
                                    type: 'add_from_secret_phrase',
                                    secretPhraseMap,
                                })
                            } catch (e) {
                                captureError(e)
                            }
                            break

                        case 'safe_wallet_clicked':
                            setModal({ type: 'safe_wallet_creation' })
                            break

                        case 'on_add_label_skipped':
                        case 'on_account_create_request':
                            onMsg(msg)
                            break

                        case 'close':
                            setModal({ type: 'closed' })
                            break
                        case 'on_accounts_create_success_animation_finished':
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                            setModal({ type: 'closed' })
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
