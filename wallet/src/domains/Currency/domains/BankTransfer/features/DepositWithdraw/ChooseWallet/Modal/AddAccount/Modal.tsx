import React from 'react'
import { EncryptedPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { notReachable } from '@zeal/toolkit'
import { AddFromSecretPhrase } from 'src/domains/Account/features/AddFromSecretPhrase'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { TrackWallet } from 'src/domains/Account/features/TrackWallet'
import { AddFromHardwareWallet } from 'src/domains/Account/features/AddFromHardwareWallet'
import { Add } from 'src/domains/Account/features/Add'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { CreateNewSafe } from 'src/domains/Account/features/CreateNewSafe'

type Props = {
    state: State
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof TrackWallet>
    | MsgOf<typeof AddFromHardwareWallet>
    | MsgOf<typeof Add>

export type State =
    | { type: 'closed' }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              EncryptedPhrase,
              { keystore: SecretPhrase; account: Account }[]
          >
      }
    | { type: 'create_contact' }
    | { type: 'add_hardware_wallet' }
    | { type: 'add_account' }
    | { type: 'safe_wallet_creation' }

export const Modal = ({
    state,
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    onMsg,
    sessionPassword,
    customCurrencies,
    currencyHiddenMap,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'add_account':
            return (
                <UIModal>
                    <Add
                        currencyHiddenMap={currencyHiddenMap}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        customCurrencies={customCurrencies}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'create_contact':
            return (
                <UIModal>
                    <TrackWallet
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        variant="track"
                        customCurrencies={customCurrencies}
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_from_secret_phrase':
            return (
                <UIModal>
                    <AddFromSecretPhrase
                        currencyHiddenMap={currencyHiddenMap}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        customCurrencies={customCurrencies}
                        secretPhraseMap={state.secretPhraseMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_hardware_wallet':
            return (
                <UIModal>
                    <AddFromHardwareWallet
                        currencyHiddenMap={currencyHiddenMap}
                        accounts={accountsMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        customCurrencies={customCurrencies}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        closable
                        onMsg={onMsg}
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
