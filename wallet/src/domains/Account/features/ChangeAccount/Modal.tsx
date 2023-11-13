import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    SelectTypeOfAccountToAdd,
    Msg as SelectTypeOfAccountToAddMsg,
} from 'src/domains/Account/components/SelectTypeOfAccountToAdd'
import {
    AddFromAddress,
    Msg as AddFromAddressMsg,
} from 'src/domains/Account/features/AddFromAddress'
import { AddFromSecretPhrase } from 'src/domains/Account/features/AddFromSecretPhrase'
import { CreateNewSafe } from 'src/domains/Account/features/CreateNewSafe'
import { Modal as UIModal } from '@zeal/uikit/Modal'

type Props = {
    state: State
    accountMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | SelectTypeOfAccountToAddMsg
    | AddFromAddressMsg
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof CreateNewSafe>

export type State =
    | { type: 'closed' }
    | { type: 'select_type_of_account_to_add' }
    | { type: 'track_account'; address: Address }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              string,
              { keystore: SecretPhrase; account: Account }[]
          >
      }
    | { type: 'safe_wallet_creation' }

export const Modal = ({
    state,
    accountMap,
    keystoreMap,
    sessionPassword,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'safe_wallet_creation':
            return (
                <UIModal>
                    <CreateNewSafe
                        sessionPassword={sessionPassword}
                        networkRPCMap={networkRPCMap}
                        accountsMap={accountMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'closed':
            return null

        case 'track_account':
            return (
                <UIModal>
                    <AddFromAddress
                        address={state.address}
                        accountMap={accountMap}
                        onMsg={onMsg}
                    />
                </UIModal>
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
                        accountsMap={accountMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        secretPhraseMap={state.secretPhraseMap}
                        customCurrencies={customCurrencyMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
