import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { LabelAddress } from './LabelAddress'
import { Address } from '@zeal/domains/Address'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { SelectTypeOfAccountToAdd } from 'src/domains/Account/components/SelectTypeOfAccountToAdd'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { TrackWallet } from 'src/domains/Account/features/TrackWallet'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { AddFromSecretPhrase } from 'src/domains/Account/features/AddFromSecretPhrase'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { CreateNewSafe } from 'src/domains/Account/features/CreateNewSafe'

type Props = {
    state: State
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof LabelAddress>
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof TrackWallet>
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof CreateNewSafe>

export type State =
    | { type: 'closed' }
    | { type: 'label_address'; address: Address }
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
    | { type: 'add_wallet' }
    | { type: 'add_tracked' }
    | { type: 'safe_wallet_creation' }

export const Modal = ({
    state,
    accountsMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    sessionPassword,
    keyStoreMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'label_address':
            return (
                <LabelAddress
                    accountsMap={accountsMap}
                    address={state.address}
                    onMsg={onMsg}
                />
            )

        case 'add_wallet':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />

        case 'add_tracked':
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
                <AddFromSecretPhrase
                    currencyHiddenMap={currencyHiddenMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    secretPhraseMap={state.secretPhraseMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
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
