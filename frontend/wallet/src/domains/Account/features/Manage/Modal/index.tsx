import { AccountsMap } from '@zeal/domains/Account'
import {
    AddFromAddress,
    Msg as AddFromAddressMsg,
} from 'src/domains/Account/features/AddFromAddress'
import {
    DetailsView,
    Msg as DetailsViewMsg,
} from 'src/domains/Account/features/DetailsView'
import { Address } from '@zeal/domains/Address'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { Modal as UIModal } from 'src/uikit/Modal'
import { ActiveAndTrackedWallets } from './ActiveAndTrackedWallets'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    state: State
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | DetailsViewMsg | AddFromAddressMsg

export type State =
    | { type: 'closed' }
    | { type: 'account_details'; address: Address }
    | { type: 'track_account'; address: Address }
    | { type: 'active_and_tracked_wallets' }

export const Modal = ({
    state,
    keystoreMap,
    portfolios,
    accounts,
    encryptedPassword,
    currencyHiddenMap,
    networkRPCMap,
    sessionPassword,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'account_details':
            return (
                <UIModal>
                    <DetailsView
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        currencyHiddenMap={currencyHiddenMap}
                        keystoreMap={keystoreMap}
                        accounts={accounts}
                        encryptedPassword={encryptedPassword}
                        portfolio={portfolios[state.address]}
                        account={accounts[state.address]}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'track_account':
            return (
                <UIModal>
                    <AddFromAddress
                        address={state.address}
                        accountMap={accounts}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'active_and_tracked_wallets':
            return <ActiveAndTrackedWallets onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
