import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from 'src/domains/Network/features/Fillter'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { TransactionDetails } from './TransactionDetails'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { Popup } from '@zeal/uikit/Popup'
import { IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { HiddenActivity } from './HiddenActivity'
import { useIntl } from 'react-intl'

type Props = {
    state: State
    portfolios: PortfolioMap
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    account: Account
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    keystore: KeyStore
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof NetworkFilter>

export type State =
    | { type: 'closed' | 'network_filter' | 'hidden_activity' }
    | {
          type: 'transaction_details'
          transaction: ActivityTransaction
          currencies: KnownCurrencies
      }

export const Modal = ({
    state,
    account,
    portfolios,
    selectedNetwork,
    networkRPCMap,
    accountsMap,
    keystore,
    keystoreMap,
    networkMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    switch (state.type) {
        case 'hidden_activity':
            return (
                <UIModal>
                    <HiddenActivity
                        networkMap={networkMap}
                        accountsMap={accountsMap}
                        account={account}
                        selectedNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        keystore={keystore}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'transaction_details':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Popup.Content>
                        <ActionBar
                            right={
                                <IconButton
                                    aria-label={formatMessage({
                                        id: 'transaction.activity.details.modal.close',
                                        defaultMessage: 'Close',
                                    })}
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <CloseCross size={24} />
                                </IconButton>
                            }
                        />
                        <TransactionDetails
                            transaction={state.transaction}
                            accountsMap={accountsMap}
                            account={account}
                            knownCurrencies={state.currencies}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                        />
                    </Popup.Content>
                </Popup.Layout>
            )
        case 'closed':
            return null
        case 'network_filter':
            const portfolio = portfolios[account.address] || null
            const networks: CurrentNetwork[] = [
                { type: 'all_networks' } as const,
                ...values(networkMap).map(
                    (network): CurrentNetwork => ({
                        type: 'specific_network',
                        network,
                    })
                ),
            ]

            return (
                <UIModal>
                    <NetworkFilter
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        networks={networks}
                        networkRPCMap={networkRPCMap}
                        portfolio={portfolio}
                        currentNetwork={selectedNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
