import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    Manage as ManageAccounts,
    Msg as ManageAccountsMsg,
} from 'src/domains/Account/features/Manage'
import { ConnectionMap } from 'src/domains/DApp/domains/ConnectionState'
import { Manage } from 'src/domains/DApp/domains/ConnectionState/features/Manage'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
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
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    state: State
    accounts: AccountsMap
    portfolios: PortfolioMap
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    account: Account
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    connections: ConnectionMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | ManageAccountsMsg
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof Manage>

export type State =
    | { type: 'closed' }
    | { type: 'account_filter' }
    | { type: 'network_filter' }
    | { type: 'manage_connections' }

export const Modal = ({
    state,
    account,
    accounts,
    portfolios,
    selectedNetwork,
    networkRPCMap,
    keystoreMap,
    encryptedPassword,
    connections,
    currencyHiddenMap,
    networkMap,
    sessionPassword,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'network_filter': {
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
                        portfolio={portfolio}
                        currentNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        }
        case 'account_filter':
            return (
                <UIModal>
                    <ManageAccounts
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        currencyHiddenMap={currencyHiddenMap}
                        encryptedPassword={encryptedPassword}
                        keystoreMap={keystoreMap}
                        portfolios={portfolios}
                        accounts={accounts}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'manage_connections':
            return (
                <UIModal>
                    <Manage connections={connections} onMsg={onMsg} />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
