import { Portfolio } from '@zeal/domains/Portfolio'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Msg as AppWidgetMsg } from 'src/domains/App/components/Widget'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Msg as NFTWidgetMsg } from 'src/domains/NFTCollection/components/Widget'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Msg as TokenWidgetMsg } from 'src/domains/Token/components/Widget'
import { notReachable } from '@zeal/toolkit'

import { Address } from '@zeal/domains/Address'

import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from 'src/domains/Currency/features/BridgeWidget'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { MainNetOrAllNetworks } from './MainNetOrAllNetworks'
import { TestNetworkView } from './TestNetworkView'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    keystore: KeyStore
    account: Account
    portfolio: Portfolio
    fetchedAt: Date
    accountsMap: AccountsMap
    currentNetwork: CurrentNetwork
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | TokenWidgetMsg
    | AppWidgetMsg
    | NFTWidgetMsg
    | { type: 'reload_button_click' }
    | { type: 'on_recovery_kit_setup'; address: Address }
    | MsgOf<typeof TestNetworkView>
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof MainNetOrAllNetworks>

export const View = ({
    portfolio,
    fetchedAt,
    keystore,
    account,
    currentNetwork,
    keyStoreMap,
    submitedBridgesMap,
    accountsMap,
    transactionRequests,
    submittedOffRampTransactions,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return (
                <MainNetOrAllNetworks
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    bankTransferInfo={bankTransferInfo}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    networkMap={networkMap}
                    currentNetwork={currentNetwork}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                    account={account}
                    portfolio={portfolio}
                    keystore={keystore}
                    fetchedAt={fetchedAt}
                    submitedBridgesMap={submitedBridgesMap}
                    submittedOffRampTransactions={submittedOffRampTransactions}
                    transactionRequests={transactionRequests}
                />
            )
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return (
                        <MainNetOrAllNetworks
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            bankTransferInfo={bankTransferInfo}
                            accountsMap={accountsMap}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            currentNetwork={currentNetwork}
                            networkRPCMap={networkRPCMap}
                            onMsg={onMsg}
                            account={account}
                            portfolio={portfolio}
                            keystore={keystore}
                            fetchedAt={fetchedAt}
                            submitedBridgesMap={submitedBridgesMap}
                            submittedOffRampTransactions={
                                submittedOffRampTransactions
                            }
                            transactionRequests={transactionRequests}
                        />
                    )
                case 'custom':
                case 'testnet':
                    return (
                        <TestNetworkView
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            networkMap={networkMap}
                            network={currentNetwork.network}
                            networkRPCMap={networkRPCMap}
                            fetchedAt={fetchedAt}
                            knownCurrencies={portfolio.currencies}
                            tokens={portfolio.tokens}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }

        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
